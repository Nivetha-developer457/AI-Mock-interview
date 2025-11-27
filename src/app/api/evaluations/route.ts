import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { evaluations } from '@/db/schema';
import { eq, desc, gte, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single evaluation by ID
    if (id) {
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const evaluation = await db
        .select()
        .from(evaluations)
        .where(eq(evaluations.id, parseInt(id)))
        .limit(1);

      if (evaluation.length === 0) {
        return NextResponse.json(
          { error: 'Evaluation not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(evaluation[0], { status: 200 });
    }

    // List evaluations with filters and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('userId');
    const interviewId = searchParams.get('interviewId');
    const minScore = searchParams.get('minScore');

    let query = db.select().from(evaluations);

    // Build filter conditions
    const conditions = [];

    if (userId) {
      const userIdInt = parseInt(userId);
      if (isNaN(userIdInt) || userIdInt <= 0) {
        return NextResponse.json(
          { error: 'Valid userId is required', code: 'INVALID_USER_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(evaluations.userId, userIdInt));
    }

    if (interviewId) {
      const interviewIdInt = parseInt(interviewId);
      if (isNaN(interviewIdInt) || interviewIdInt <= 0) {
        return NextResponse.json(
          { error: 'Valid interviewId is required', code: 'INVALID_INTERVIEW_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(evaluations.interviewId, interviewIdInt));
    }

    if (minScore) {
      const minScoreInt = parseInt(minScore);
      if (isNaN(minScoreInt) || minScoreInt < 0 || minScoreInt > 100) {
        return NextResponse.json(
          { error: 'minScore must be between 0 and 100', code: 'INVALID_MIN_SCORE' },
          { status: 400 }
        );
      }
      conditions.push(gte(evaluations.overallScore, minScoreInt));
    }

    // Apply filters if any
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting and pagination
    const results = await query
      .orderBy(desc(evaluations.createdAt))
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

    // Validate required fields
    if (!body.interviewId || typeof body.interviewId !== 'number' || body.interviewId <= 0) {
      return NextResponse.json(
        { error: 'Valid interviewId is required', code: 'MISSING_INTERVIEW_ID' },
        { status: 400 }
      );
    }

    if (!body.userId || typeof body.userId !== 'number' || body.userId <= 0) {
      return NextResponse.json(
        { error: 'Valid userId is required', code: 'MISSING_USER_ID' },
        { status: 400 }
      );
    }

    // Validate score fields
    const scoreFields = [
      'communicationScore',
      'confidenceScore',
      'technicalAccuracyScore',
      'resumeAlignmentScore',
      'personalityFitScore',
      'overallScore'
    ];

    for (const field of scoreFields) {
      if (body[field] === undefined || body[field] === null) {
        return NextResponse.json(
          { error: `${field} is required`, code: 'MISSING_SCORE_FIELD' },
          { status: 400 }
        );
      }

      const score = parseInt(body[field]);
      if (isNaN(score) || score < 0 || score > 100) {
        return NextResponse.json(
          { error: `${field} must be between 0 and 100`, code: 'INVALID_SCORE' },
          { status: 400 }
        );
      }
    }

    // Validate JSON fields if provided
    if (body.strengths !== undefined && body.strengths !== null) {
      if (!Array.isArray(body.strengths)) {
        return NextResponse.json(
          { error: 'strengths must be an array', code: 'INVALID_STRENGTHS' },
          { status: 400 }
        );
      }
    }

    if (body.weaknesses !== undefined && body.weaknesses !== null) {
      if (!Array.isArray(body.weaknesses)) {
        return NextResponse.json(
          { error: 'weaknesses must be an array', code: 'INVALID_WEAKNESSES' },
          { status: 400 }
        );
      }
    }

    if (body.improvementSuggestions !== undefined && body.improvementSuggestions !== null) {
      if (!Array.isArray(body.improvementSuggestions)) {
        return NextResponse.json(
          { error: 'improvementSuggestions must be an array', code: 'INVALID_IMPROVEMENT_SUGGESTIONS' },
          { status: 400 }
        );
      }
    }

    if (body.evaluationData !== undefined && body.evaluationData !== null) {
      if (typeof body.evaluationData !== 'object' || Array.isArray(body.evaluationData)) {
        return NextResponse.json(
          { error: 'evaluationData must be an object', code: 'INVALID_EVALUATION_DATA' },
          { status: 400 }
        );
      }
    }

    // Prepare insert data
    const insertData: any = {
      interviewId: body.interviewId,
      userId: body.userId,
      communicationScore: parseInt(body.communicationScore),
      confidenceScore: parseInt(body.confidenceScore),
      technicalAccuracyScore: parseInt(body.technicalAccuracyScore),
      resumeAlignmentScore: parseInt(body.resumeAlignmentScore),
      personalityFitScore: parseInt(body.personalityFitScore),
      overallScore: parseInt(body.overallScore),
      createdAt: new Date().toISOString()
    };

    // Add optional fields if provided
    if (body.strengths !== undefined && body.strengths !== null) {
      insertData.strengths = body.strengths;
    }

    if (body.weaknesses !== undefined && body.weaknesses !== null) {
      insertData.weaknesses = body.weaknesses;
    }

    if (body.improvementSuggestions !== undefined && body.improvementSuggestions !== null) {
      insertData.improvementSuggestions = body.improvementSuggestions;
    }

    if (body.roleFitRecommendation !== undefined && body.roleFitRecommendation !== null) {
      insertData.roleFitRecommendation = body.roleFitRecommendation;
    }

    if (body.evaluationData !== undefined && body.evaluationData !== null) {
      insertData.evaluationData = body.evaluationData;
    }

    // Insert into database
    const newEvaluation = await db
      .insert(evaluations)
      .values(insertData)
      .returning();

    return NextResponse.json(newEvaluation[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    
    // Handle foreign key constraint violations
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
      return NextResponse.json(
        { error: 'Invalid interviewId or userId reference', code: 'FOREIGN_KEY_VIOLATION' },
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

    const body = await request.json();

    // Check if evaluation exists
    const existing = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Evaluation not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Validate score fields if provided
    const scoreFields = [
      'communicationScore',
      'confidenceScore',
      'technicalAccuracyScore',
      'resumeAlignmentScore',
      'personalityFitScore',
      'overallScore'
    ];

    const updates: any = {};

    for (const field of scoreFields) {
      if (body[field] !== undefined && body[field] !== null) {
        const score = parseInt(body[field]);
        if (isNaN(score) || score < 0 || score > 100) {
          return NextResponse.json(
            { error: `${field} must be between 0 and 100`, code: 'INVALID_SCORE' },
            { status: 400 }
          );
        }
        updates[field] = score;
      }
    }

    // Validate JSON fields if provided
    if (body.strengths !== undefined && body.strengths !== null) {
      if (!Array.isArray(body.strengths)) {
        return NextResponse.json(
          { error: 'strengths must be an array', code: 'INVALID_STRENGTHS' },
          { status: 400 }
        );
      }
      updates.strengths = body.strengths;
    }

    if (body.weaknesses !== undefined && body.weaknesses !== null) {
      if (!Array.isArray(body.weaknesses)) {
        return NextResponse.json(
          { error: 'weaknesses must be an array', code: 'INVALID_WEAKNESSES' },
          { status: 400 }
        );
      }
      updates.weaknesses = body.weaknesses;
    }

    if (body.improvementSuggestions !== undefined && body.improvementSuggestions !== null) {
      if (!Array.isArray(body.improvementSuggestions)) {
        return NextResponse.json(
          { error: 'improvementSuggestions must be an array', code: 'INVALID_IMPROVEMENT_SUGGESTIONS' },
          { status: 400 }
        );
      }
      updates.improvementSuggestions = body.improvementSuggestions;
    }

    if (body.roleFitRecommendation !== undefined && body.roleFitRecommendation !== null) {
      updates.roleFitRecommendation = body.roleFitRecommendation;
    }

    if (body.evaluationData !== undefined && body.evaluationData !== null) {
      if (typeof body.evaluationData !== 'object' || Array.isArray(body.evaluationData)) {
        return NextResponse.json(
          { error: 'evaluationData must be an object', code: 'INVALID_EVALUATION_DATA' },
          { status: 400 }
        );
      }
      updates.evaluationData = body.evaluationData;
    }

    // Check if there are any fields to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update', code: 'NO_UPDATE_FIELDS' },
        { status: 400 }
      );
    }

    // Update evaluation
    const updated = await db
      .update(evaluations)
      .set(updates)
      .where(eq(evaluations.id, parseInt(id)))
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

    // Check if evaluation exists
    const existing = await db
      .select()
      .from(evaluations)
      .where(eq(evaluations.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: 'Evaluation not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    // Delete evaluation
    const deleted = await db
      .delete(evaluations)
      .where(eq(evaluations.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Evaluation deleted successfully',
        evaluation: deleted[0]
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