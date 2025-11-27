import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { resumes, users } from '@/db/schema';
import { eq, like, desc, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single resume by ID
    if (id) {
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const resume = await db
        .select()
        .from(resumes)
        .where(eq(resumes.id, parseInt(id)))
        .limit(1);

      if (resume.length === 0) {
        return NextResponse.json(
          { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(resume[0], { status: 200 });
    }

    // List with pagination, filtering, and search
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const userIdFilter = searchParams.get('userId');

    let query = db.select().from(resumes);

    // Build WHERE conditions
    const conditions = [];

    if (userIdFilter) {
      const userIdInt = parseInt(userIdFilter);
      if (!isNaN(userIdInt) && userIdInt > 0) {
        conditions.push(eq(resumes.userId, userIdInt));
      }
    }

    if (search) {
      conditions.push(like(resumes.fileName, `%${search}%`));
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    const results = await query
      .orderBy(desc(resumes.uploadedAt))
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
    const { userId, fileUrl, fileName, parsedData, suggestedRoles } = body;

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    if (!fileUrl || typeof fileUrl !== 'string' || fileUrl.trim() === '') {
      return NextResponse.json(
        { error: 'fileUrl is required and must be a non-empty string', code: 'INVALID_FILE_URL' },
        { status: 400 }
      );
    }

    if (!fileName || typeof fileName !== 'string' || fileName.trim() === '') {
      return NextResponse.json(
        { error: 'fileName is required and must be a non-empty string', code: 'INVALID_FILE_NAME' },
        { status: 400 }
      );
    }

    // Validate userId is a positive integer
    const userIdInt = parseInt(userId);
    if (isNaN(userIdInt) || userIdInt <= 0) {
      return NextResponse.json(
        { error: 'userId must be a positive integer', code: 'INVALID_USER_ID' },
        { status: 400 }
      );
    }

    // Verify user exists
    const userExists = await db
      .select()
      .from(users)
      .where(eq(users.id, userIdInt))
      .limit(1);

    if (userExists.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 400 }
      );
    }

    // Validate parsedData if provided
    if (parsedData !== undefined && parsedData !== null) {
      if (typeof parsedData !== 'object' || Array.isArray(parsedData)) {
        return NextResponse.json(
          { error: 'parsedData must be a valid JSON object', code: 'INVALID_PARSED_DATA' },
          { status: 400 }
        );
      }
    }

    // Validate suggestedRoles if provided
    if (suggestedRoles !== undefined && suggestedRoles !== null) {
      if (!Array.isArray(suggestedRoles)) {
        return NextResponse.json(
          { error: 'suggestedRoles must be a valid JSON array', code: 'INVALID_SUGGESTED_ROLES' },
          { status: 400 }
        );
      }
    }

    // Prepare insert data
    const insertData: any = {
      userId: userIdInt,
      fileUrl: fileUrl.trim(),
      fileName: fileName.trim(),
      uploadedAt: new Date().toISOString(),
    };

    if (parsedData !== undefined && parsedData !== null) {
      insertData.parsedData = parsedData;
    }

    if (suggestedRoles !== undefined && suggestedRoles !== null) {
      insertData.suggestedRoles = suggestedRoles;
    }

    // Insert resume
    const newResume = await db.insert(resumes).values(insertData).returning();

    return NextResponse.json(newResume[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    
    // Handle foreign key constraint violation
    if (error instanceof Error && error.message.includes('FOREIGN KEY constraint failed')) {
      return NextResponse.json(
        { error: 'Invalid userId: user does not exist', code: 'FOREIGN_KEY_VIOLATION' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error: ' + error },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const resumeId = parseInt(id);

    // Check if resume exists
    const existingResume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (existingResume.length === 0) {
      return NextResponse.json(
        { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { fileUrl, fileName, parsedData, suggestedRoles } = body;

    // Validate fields if provided
    if (fileUrl !== undefined) {
      if (typeof fileUrl !== 'string' || fileUrl.trim() === '') {
        return NextResponse.json(
          { error: 'fileUrl must be a non-empty string', code: 'INVALID_FILE_URL' },
          { status: 400 }
        );
      }
    }

    if (fileName !== undefined) {
      if (typeof fileName !== 'string' || fileName.trim() === '') {
        return NextResponse.json(
          { error: 'fileName must be a non-empty string', code: 'INVALID_FILE_NAME' },
          { status: 400 }
        );
      }
    }

    if (parsedData !== undefined && parsedData !== null) {
      if (typeof parsedData !== 'object' || Array.isArray(parsedData)) {
        return NextResponse.json(
          { error: 'parsedData must be a valid JSON object', code: 'INVALID_PARSED_DATA' },
          { status: 400 }
        );
      }
    }

    if (suggestedRoles !== undefined && suggestedRoles !== null) {
      if (!Array.isArray(suggestedRoles)) {
        return NextResponse.json(
          { error: 'suggestedRoles must be a valid JSON array', code: 'INVALID_SUGGESTED_ROLES' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (fileUrl !== undefined) {
      updateData.fileUrl = fileUrl.trim();
    }

    if (fileName !== undefined) {
      updateData.fileName = fileName.trim();
    }

    if (parsedData !== undefined) {
      updateData.parsedData = parsedData;
    }

    if (suggestedRoles !== undefined) {
      updateData.suggestedRoles = suggestedRoles;
    }

    // Only update if there are fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No fields to update', code: 'NO_FIELDS_TO_UPDATE' },
        { status: 400 }
      );
    }

    // Update resume
    const updated = await db
      .update(resumes)
      .set(updateData)
      .where(eq(resumes.id, resumeId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const resumeId = parseInt(id);

    // Check if resume exists
    const existingResume = await db
      .select()
      .from(resumes)
      .where(eq(resumes.id, resumeId))
      .limit(1);

    if (existingResume.length === 0) {
      return NextResponse.json(
        { error: 'Resume not found', code: 'RESUME_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete resume
    const deleted = await db
      .delete(resumes)
      .where(eq(resumes.id, resumeId))
      .returning();

    return NextResponse.json(
      {
        message: 'Resume deleted successfully',
        deletedResume: deleted[0],
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