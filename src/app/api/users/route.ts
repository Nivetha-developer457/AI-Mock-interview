import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, like, or, desc, and } from 'drizzle-orm';

// Email validation helper
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single user fetch by ID
    if (id) {
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(id)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { error: 'User not found', code: 'USER_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(user[0], { status: 200 });
    }

    // List users with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let query = db.select().from(users);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(users.email, `%${search}%`),
          like(users.fullName, `%${search}%`)
        )
      );
    }

    if (role) {
      if (role !== 'user' && role !== 'admin') {
        return NextResponse.json(
          { error: 'Invalid role filter. Must be "user" or "admin"', code: 'INVALID_ROLE_FILTER' },
          { status: 400 }
        );
      }
      conditions.push(eq(users.role, role));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query
      .orderBy(desc(users.createdAt))
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
    const { email, fullName, role = 'user', avatarUrl } = body;

    // Validate required fields
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required', code: 'MISSING_EMAIL' },
        { status: 400 }
      );
    }

    if (!fullName || fullName.trim() === '') {
      return NextResponse.json(
        { error: 'Full name is required', code: 'MISSING_FULL_NAME' },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format', code: 'INVALID_EMAIL_FORMAT' },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== 'user' && role !== 'admin') {
      return NextResponse.json(
        { error: 'Role must be either "user" or "admin"', code: 'INVALID_ROLE' },
        { status: 400 }
      );
    }

    // Check email uniqueness
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

    // Create user
    const timestamp = new Date().toISOString();
    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase().trim(),
        fullName: fullName.trim(),
        role,
        avatarUrl: avatarUrl || null,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
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

    // Validate ID
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const userId = parseInt(id);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { email, fullName, role, avatarUrl } = body;

    // Build update object
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    // Validate and add email if provided
    if (email !== undefined) {
      if (!isValidEmail(email)) {
        return NextResponse.json(
          { error: 'Invalid email format', code: 'INVALID_EMAIL_FORMAT' },
          { status: 400 }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Check email uniqueness if changed
      if (normalizedEmail !== existingUser[0].email) {
        const emailExists = await db
          .select()
          .from(users)
          .where(eq(users.email, normalizedEmail))
          .limit(1);

        if (emailExists.length > 0) {
          return NextResponse.json(
            { error: 'Email already exists', code: 'EMAIL_EXISTS' },
            { status: 400 }
          );
        }
      }

      updates.email = normalizedEmail;
    }

    // Validate and add fullName if provided
    if (fullName !== undefined) {
      if (fullName.trim() === '') {
        return NextResponse.json(
          { error: 'Full name cannot be empty', code: 'INVALID_FULL_NAME' },
          { status: 400 }
        );
      }
      updates.fullName = fullName.trim();
    }

    // Validate and add role if provided
    if (role !== undefined) {
      if (role !== 'user' && role !== 'admin') {
        return NextResponse.json(
          { error: 'Role must be either "user" or "admin"', code: 'INVALID_ROLE' },
          { status: 400 }
        );
      }
      updates.role = role;
    }

    // Add avatarUrl if provided
    if (avatarUrl !== undefined) {
      updates.avatarUrl = avatarUrl || null;
    }

    // Update user
    const updatedUser = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json(updatedUser[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { error: 'Email already exists', code: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

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

    // Validate ID
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const userId = parseInt(id);

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        { error: 'User not found', code: 'USER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete user
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    return NextResponse.json(
      {
        message: 'User deleted successfully',
        user: deletedUser[0],
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