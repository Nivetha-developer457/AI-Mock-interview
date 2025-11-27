import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { interviews, resumes, questions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import OpenAI from 'openai';

// Fallback question templates by role
const fallbackQuestions: Record<string, string[]> = {
  'Software Engineer': [
    'Tell me about yourself and your experience in software development.',
    'Describe a challenging technical problem you solved and your approach.',
    'How do you ensure code quality and maintainability in your projects?',
    'Walk me through your experience with version control and collaborative development.',
    'Explain your process for debugging complex issues in production.',
    'How do you stay updated with new technologies and best practices?',
    'Describe a time when you had to optimize application performance.'
  ],
  'Data Scientist': [
    'Tell me about your background in data science and analytics.',
    'Describe a complex data analysis project you worked on.',
    'How do you approach feature engineering and model selection?',
    'Explain how you validate and evaluate machine learning models.',
    'Walk me through your experience with data visualization and storytelling.',
    'Describe a time when your analysis led to actionable business insights.',
    'How do you handle missing or inconsistent data in your datasets?'
  ],
  'Product Manager': [
    'Tell me about your experience in product management.',
    'How do you prioritize features and manage product roadmaps?',
    'Describe a time when you launched a successful product or feature.',
    'How do you gather and incorporate user feedback into product decisions?',
    'Explain your process for working with cross-functional teams.',
    'Walk me through how you define and measure product success.',
    'Describe a time when you had to make a difficult trade-off decision.'
  ],
  'UI/UX Designer': [
    'Tell me about your design background and philosophy.',
    'Walk me through your design process from concept to completion.',
    'How do you balance user needs with business requirements?',
    'Describe a project where you significantly improved user experience.',
    'How do you conduct user research and testing?',
    'Explain how you collaborate with developers and product managers.',
    'Describe a time when you had to advocate for design decisions.'
  ],
  'Marketing Manager': [
    'Tell me about your experience in marketing and campaign management.',
    'Describe a successful marketing campaign you led and its results.',
    'How do you measure marketing ROI and track campaign performance?',
    'Walk me through your approach to market research and audience targeting.',
    'How do you stay current with marketing trends and best practices?',
    'Describe a time when you had to adapt your strategy based on data.',
    'How do you manage marketing budgets and allocate resources?'
  ],
  'default': [
    'Tell me about yourself and your professional background.',
    'What are your key strengths and how do they relate to this role?',
    'Describe a challenging situation you faced at work and how you handled it.',
    'How do you prioritize tasks when managing multiple projects?',
    'Tell me about a time when you worked effectively in a team.',
    'What motivates you in your professional career?',
    'Where do you see yourself in the next 3-5 years?'
  ]
};

function generateFallbackQuestions(role: string, count: number, resumeData?: any): any[] {
  // Get questions for the specific role or default
  let questionBank = fallbackQuestions[role] || fallbackQuestions['default'];
  
  // If we have resume data, try to personalize the first question
  if (resumeData?.parsedData) {
    try {
      const parsed = typeof resumeData.parsedData === 'string' 
        ? JSON.parse(resumeData.parsedData) 
        : resumeData.parsedData;
      
      if (parsed.skills || parsed.experience) {
        questionBank = [...questionBank];
        questionBank[0] = `Tell me about yourself and your experience, particularly with ${parsed.skills?.[0] || 'your expertise'}.`;
      }
    } catch (error) {
      console.log('Could not personalize question:', error);
    }
  }
  
  // Return the requested number of questions
  const selectedQuestions = questionBank.slice(0, Math.min(count, questionBank.length));
  
  return selectedQuestions.map((text, index) => ({
    questionText: text,
    questionNumber: index + 1
  }));
}

export async function POST(request: NextRequest) {
  try {
    // Extract interview ID from URL path
    const pathname = request.nextUrl.pathname;
    const idMatch = pathname.match(/\/api\/interviews\/(\d+)\/generate-questions/);
    
    if (!idMatch || !idMatch[1]) {
      return NextResponse.json(
        { error: 'Interview ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    const interviewId = parseInt(idMatch[1]);

    if (isNaN(interviewId) || interviewId <= 0) {
      return NextResponse.json(
        { error: 'Valid interview ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Fetch interview details
    const interview = await db
      .select({
        id: interviews.id,
        role: interviews.role,
        timePerQuestion: interviews.timePerQuestion,
        totalDuration: interviews.totalDuration,
        resumeId: interviews.resumeId,
        userId: interviews.userId,
        status: interviews.status,
      })
      .from(interviews)
      .where(eq(interviews.id, interviewId))
      .limit(1);

    if (interview.length === 0) {
      return NextResponse.json(
        { error: 'Interview not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const interviewData = interview[0];

    if (interviewData.status !== 'in_progress') {
      return NextResponse.json(
        { 
          error: 'Interview must be in progress to generate questions', 
          code: 'INTERVIEW_NOT_IN_PROGRESS' 
        },
        { status: 400 }
      );
    }

    // Check if questions already exist
    const existingQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.interviewId, interviewId))
      .limit(1);

    if (existingQuestions.length > 0) {
      return NextResponse.json(
        { 
          error: 'Questions have already been generated for this interview', 
          code: 'QUESTIONS_ALREADY_GENERATED' 
        },
        { status: 400 }
      );
    }

    // Fetch resume details if resumeId exists
    let resumeData = null;
    if (interviewData.resumeId) {
      const resume = await db
        .select({
          id: resumes.id,
          parsedData: resumes.parsedData,
        })
        .from(resumes)
        .where(eq(resumes.id, interviewData.resumeId))
        .limit(1);

      if (resume.length > 0) {
        resumeData = resume[0];
      }
    }

    // Calculate number of questions (5-7 range)
    const calculatedQuestions = Math.floor(
      interviewData.totalDuration / interviewData.timePerQuestion
    );
    const numberOfQuestions = Math.min(Math.max(calculatedQuestions, 5), 7);

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY;
    let generatedQuestions;
    
    if (!apiKey) {
      // Use fallback questions if no API key
      console.log('No OpenAI API key found, using fallback questions');
      generatedQuestions = generateFallbackQuestions(interviewData.role, numberOfQuestions, resumeData);
    } else {
      // Try OpenAI, fallback to mock if it fails
      try {
        const openai = new OpenAI({ apiKey });

        const systemPrompt = 
          'You are an expert interviewer generating behavioral and technical questions for job interviews. ' +
          'Generate questions that are realistic, role-specific, and vary in difficulty from introductory to advanced.';

        let userPrompt = `Target role: ${interviewData.role}\n`;
        userPrompt += `Number of questions to generate: ${numberOfQuestions}\n\n`;

        if (resumeData?.parsedData) {
          try {
            const parsed = typeof resumeData.parsedData === 'string' 
              ? JSON.parse(resumeData.parsedData) 
              : resumeData.parsedData;
            
            userPrompt += 'Candidate background:\n';
            if (parsed.skills) {
              userPrompt += `Skills: ${Array.isArray(parsed.skills) ? parsed.skills.join(', ') : parsed.skills}\n`;
            }
            if (parsed.experience) {
              userPrompt += `Experience: ${typeof parsed.experience === 'string' ? parsed.experience : JSON.stringify(parsed.experience)}\n`;
            }
            if (parsed.summary) {
              userPrompt += `Summary: ${parsed.summary}\n`;
            }
            userPrompt += '\n';
          } catch (parseError) {
            console.error('Error parsing resume data:', parseError);
          }
        }

        userPrompt += 
          'Return a JSON array of objects with "questionText" and "questionNumber" fields. ' +
          'Questions should be specific to the role and progressively increase in complexity. ' +
          'Format your response as: {"questions": [{"questionText": "...", "questionNumber": 1}, ...]}';

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.8,
        });

        const responseContent = completion.choices[0]?.message?.content;
        if (!responseContent) {
          throw new Error('Empty response from OpenAI');
        }

        const parsed = JSON.parse(responseContent);
        generatedQuestions = parsed.questions;

        if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
          throw new Error('Invalid questions array in response');
        }

        for (const q of generatedQuestions) {
          if (!q.questionText || typeof q.questionText !== 'string') {
            throw new Error('Invalid question structure');
          }
        }
      } catch (openaiError: any) {
        console.error('OpenAI API error, using fallback:', openaiError.message);
        generatedQuestions = generateFallbackQuestions(interviewData.role, numberOfQuestions, resumeData);
      }
    }

    // Prepare questions for database insertion
    const currentTimestamp = new Date().toISOString();
    const questionsToInsert = generatedQuestions.slice(0, numberOfQuestions).map((q, index) => ({
      interviewId: interviewId,
      questionText: q.questionText,
      questionNumber: index + 1,
      askedAt: currentTimestamp,
      answerText: null,
      answerVideoUrl: null,
      timeTaken: null,
      answeredAt: null,
    }));

    // Insert questions into database
    const createdQuestions = await db
      .insert(questions)
      .values(questionsToInsert)
      .returning();

    return NextResponse.json(
      {
        questions: createdQuestions,
        count: createdQuestions.length,
        source: apiKey ? 'ai' : 'fallback'
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { 
        error: `Internal server error: ${error.message || error}`,
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}