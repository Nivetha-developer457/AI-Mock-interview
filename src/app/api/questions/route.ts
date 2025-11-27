import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { questions } from '@/db/schema';
import { eq, asc, isNotNull, isNull, or, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single question fetch
    if (id) {
      if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const question = await db
        .select()
        .from(questions)
        .where(eq(questions.id, parseInt(id)))
        .limit(1);

      if (question.length === 0) {
        return NextResponse.json(
          { error: 'Question not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(question[0], { status: 200 });
    }

    // List questions with filtering and pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const interviewId = searchParams.get('interviewId');
    const answered = searchParams.get('answered');

    let query = db.select().from(questions);

    const conditions = [];

    // Filter by interviewId
    if (interviewId) {
      const parsedInterviewId = parseInt(interviewId);
      if (isNaN(parsedInterviewId) || parsedInterviewId <= 0) {
        return NextResponse.json(
          { error: 'Valid interview ID is required', code: 'INVALID_INTERVIEW_ID' },
          { status: 400 }
        );
      }
      conditions.push(eq(questions.interviewId, parsedInterviewId));
    }

    // Filter by answered status
    if (answered !== null) {
      if (answered === 'true') {
        conditions.push(
          or(
            isNotNull(questions.answerText),
            isNotNull(questions.answerVideoUrl)
          )
        );
      } else if (answered === 'false') {
        conditions.push(
          and(
            isNull(questions.answerText),
            isNull(questions.answerVideoUrl)
          )
        );
      }
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Sort by questionNumber ascending and apply pagination
    const results = await query
      .orderBy(asc(questions.questionNumber))
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
    const {
      interviewId,
      questionText,
      questionNumber,
      answerText,
      answerVideoUrl,
      timeTaken,
      answeredAt,
    } = body;

    // Validate required fields
    if (!interviewId) {
      return NextResponse.json(
        { error: 'Interview ID is required', code: 'MISSING_INTERVIEW_ID' },
        { status: 400 }
      );
    }

    if (typeof interviewId !== 'number' || interviewId <= 0) {
      return NextResponse.json(
        { error: 'Interview ID must be a positive integer', code: 'INVALID_INTERVIEW_ID' },
        { status: 400 }
      );
    }

    if (!questionText) {
      return NextResponse.json(
        { error: 'Question text is required', code: 'MISSING_QUESTION_TEXT' },
        { status: 400 }
      );
    }

    if (typeof questionText !== 'string' || questionText.trim() === '') {
      return NextResponse.json(
        { error: 'Question text must be a non-empty string', code: 'INVALID_QUESTION_TEXT' },
        { status: 400 }
      );
    }

    if (!questionNumber && questionNumber !== 0) {
      return NextResponse.json(
        { error: 'Question number is required', code: 'MISSING_QUESTION_NUMBER' },
        { status: 400 }
      );
    }

    if (typeof questionNumber !== 'number' || questionNumber <= 0) {
      return NextResponse.json(
        { error: 'Question number must be a positive integer', code: 'INVALID_QUESTION_NUMBER' },
        { status: 400 }
      );
    }

    // Validate optional fields
    if (timeTaken !== undefined && timeTaken !== null) {
      if (typeof timeTaken !== 'number' || timeTaken <= 0) {
        return NextResponse.json(
          { error: 'Time taken must be a positive integer', code: 'INVALID_TIME_TAKEN' },
          { status: 400 }
        );
      }
    }

    // Prepare insert data
    const insertData: any = {
      interviewId,
      questionText: questionText.trim(),
      questionNumber,
      askedAt: new Date().toISOString(),
    };

    if (answerText !== undefined && answerText !== null) {
      insertData.answerText = typeof answerText === 'string' ? answerText.trim() : answerText;
    }

    if (answerVideoUrl !== undefined && answerVideoUrl !== null) {
      insertData.answerVideoUrl = typeof answerVideoUrl === 'string' ? answerVideoUrl.trim() : answerVideoUrl;
    }

    if (timeTaken !== undefined && timeTaken !== null) {
      insertData.timeTaken = timeTaken;
    }

    if (answeredAt !== undefined && answeredAt !== null) {
      insertData.answeredAt = answeredAt;
    }

    // Insert into database
    const newQuestion = await db
      .insert(questions)
      .values(insertData)
      .returning();

    return NextResponse.json(newQuestion[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    
    // Handle foreign key constraint errors
    if (error.message && error.message.includes('FOREIGN KEY constraint failed')) {
      return NextResponse.json(
        { error: 'Invalid interview ID - interview does not exist', code: 'INVALID_FOREIGN_KEY' },
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

    const questionId = parseInt(id);

    // Check if question exists
    const existingQuestion = await db
      .select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (existingQuestion.length === 0) {
      return NextResponse.json(
        { error: 'Question not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { answerText, answerVideoUrl, timeTaken, answeredAt } = body;

    // Validate optional fields
    if (timeTaken !== undefined && timeTaken !== null) {
      if (typeof timeTaken !== 'number' || timeTaken <= 0) {
        return NextResponse.json(
          { error: 'Time taken must be a positive integer', code: 'INVALID_TIME_TAKEN' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (answerText !== undefined) {
      updateData.answerText = answerText !== null && typeof answerText === 'string' ? answerText.trim() : answerText;
    }

    if (answerVideoUrl !== undefined) {
      updateData.answerVideoUrl = answerVideoUrl !== null && typeof answerVideoUrl === 'string' ? answerVideoUrl.trim() : answerVideoUrl;
    }

    if (timeTaken !== undefined) {
      updateData.timeTaken = timeTaken;
    }

    if (answeredAt !== undefined) {
      updateData.answeredAt = answeredAt;
    }

    // Auto-set answeredAt if answer provided and answeredAt not already set
    if (
      (answerText !== undefined || answerVideoUrl !== undefined) &&
      !existingQuestion[0].answeredAt &&
      answeredAt === undefined
    ) {
      updateData.answeredAt = new Date().toISOString();
    }

    // Perform update
    const updatedQuestion = await db
      .update(questions)
      .set(updateData)
      .where(eq(questions.id, questionId))
      .returning();

    if (updatedQuestion.length === 0) {
      return NextResponse.json(
        { error: 'Question not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedQuestion[0], { status: 200 });
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

    const questionId = parseInt(id);

    // Delete question
    const deletedQuestion = await db
      .delete(questions)
      .where(eq(questions.id, questionId))
      .returning();

    if (deletedQuestion.length === 0) {
      return NextResponse.json(
        { error: 'Question not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Question deleted successfully',
        question: deletedQuestion[0],
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