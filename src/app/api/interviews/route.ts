import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { interviews, users, resumes } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

const VALID_STATUSES = ['in_progress', 'completed', 'abandoned'];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    // Single interview by ID
    if (id) {
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const interview = await db
        .select()
        .from(interviews)
        .where(eq(interviews.id, parseInt(id)))
        .limit(1);

      if (interview.length === 0) {
        return NextResponse.json(
          { error: 'Interview not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(interview[0], { status: 200 });
    }

    // List interviews with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userIdParam = searchParams.get('userId');
    const statusParam = searchParams.get('status');
    const roleParam = searchParams.get('role');

    // Build conditions array
    const conditions = [];

    if (userIdParam) {
      const userIdInt = parseInt(userIdParam);
      if (!isNaN(userIdInt) && userIdInt > 0) {
        conditions.push(eq(interviews.userId, userIdInt));
      }
    }

    if (statusParam && VALID_STATUSES.includes(statusParam)) {
      conditions.push(eq(interviews.status, statusParam));
    }

    if (roleParam && roleParam.trim()) {
      conditions.push(eq(interviews.role, roleParam.trim()));
    }

    let query = db.select().from(interviews);

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(interviews.startedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, resumeId, role, timePerQuestion, totalDuration, status } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (typeof userId !== 'number' || userId <= 0) {
      return NextResponse.json(
        { error: 'userId must be a positive integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    if (!role || typeof role !== 'string' || !role.trim()) {
      return NextResponse.json(
        { error: 'role is required and must be a non-empty string', code: 'MISSING_ROLE' },
        { status: 400 }
      );
    }

    if (!timePerQuestion || typeof timePerQuestion !== 'number' || timePerQuestion <= 0) {
      return NextResponse.json(
        { error: 'timePerQuestion is required and must be a positive integer', code: 'INVALID_TIME_PER_QUESTION' },
        { status: 400 }
      );
    }

    if (!totalDuration || typeof totalDuration !== 'number' || totalDuration <= 0) {
      return NextResponse.json(
        { error: 'totalDuration is required and must be a positive integer', code: 'INVALID_TOTAL_DURATION' },
        { status: 400 }
      );
    }

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `status must be one of: ${VALID_STATUSES.join(', ')}`, code: 'INVALID_STATUS' },
        { status: 400 }
      );
    }

    // Validate userId exists
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate resumeId if provided
    if (resumeId) {
      if (typeof resumeId !== 'number' || resumeId <= 0) {
        return NextResponse.json(
          { error: 'resumeId must be a positive integer', code: 'INVALID_RESUME_ID' },
          { status: 400 }
        );
      }

      const resumeExists = await db
        .select()
        .from(resumes)
        .where(eq(resumes.id, resumeId))
        .limit(1);

      if (resumeExists.length === 0) {
        return NextResponse.json(
          { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
          { status: 400 }
        );
      }
    }

    const now = new Date().toISOString();

    const newInterview = await db
      .insert(interviews)
      .values({
        userId,
        resumeId: resumeId || null,
        role: role.trim(),
        timePerQuestion,
        totalDuration,
        status: status || 'in_progress',
        startedAt: now,
        createdAt: now,
      })
      .returning();

    return NextResponse.json(newInterview[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const interviewId = parseInt(id);

    // Check if interview exists
    const existingInterview = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1);

    if (existingInterview.length === 0) {
      return NextResponse.json(
        { error: 'Interview not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { role, actualDuration, status, completedAt } = body;

    const updates: any = {};

    // Validate and add role
    if (role !== undefined) {
      if (typeof role !== 'string' || !role.trim()) {
        return NextResponse.json(
          { error: 'role must be a non-empty string', code: 'INVALID_ROLE' },
          { status: 400 }
        );
      }
      updates.role = role.trim();
    }

    // Validate and add actualDuration
    if (actualDuration !== undefined) {
      if (typeof actualDuration !== 'number' || actualDuration < 0) {
        return NextResponse.json(
          { error: 'actualDuration must be a non-negative integer', code: 'INVALID_ACTUAL_DURATION' },
          { status: 400 }
        );
      }
      updates.actualDuration = actualDuration;
    }

    // Validate and add status
    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `status must be one of: ${VALID_STATUSES.join(', ')}`, code: 'INVALID_STATUS' },
          { status: 400 }
        );
      }
      updates.status = status;

      // Auto-set completedAt if status is completed and completedAt not provided
      if (status === 'completed' && !completedAt) {
        updates.completedAt = new Date().toISOString();
      }
    }

    // Add completedAt if provided
    if (completedAt !== undefined) {
      updates.completedAt = completedAt;
    }

    // Return error if no fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATES' },
        { status: 400 }
      );
    }

    const updatedInterview = await db
      .update(interviews)
      .set(updates)
      .where(eq(interviews.id, interviewId))
      .returning();

    return NextResponse.json(updatedInterview[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const interviewId = parseInt(id);

    // Check if interview exists
    const existingInterview = await db
      .select()
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1);

    if (existingInterview.length === 0) {
      return NextResponse.json(
        { error: 'Interview not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(interviews)
      .where(eq(interviews.id, interviewId))
      .returning();

    return NextResponse.json(
      {
        message: 'Interview deleted successfully',
        deletedInterview: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}