import { db } from '@/db';
import { interviews } from '@/db/schema';

async function main() {
    const now = new Date();
    
    // Helper function to get date N days ago
    const getDaysAgo = (days: number): Date => {
        const date = new Date(now);
        date.setDate(date.getDate() - days);
        return date;
    };
    
    // Helper function to add seconds to a date
    const addSeconds = (date: Date, seconds: number): Date => {
        const newDate = new Date(date);
        newDate.setSeconds(newDate.getSeconds() + seconds);
        return newDate;
    };
    
    // Interview 1: John Smith - Software Engineer (20 days ago)
    const interview1StartedAt = getDaysAgo(20);
    const interview1CompletedAt = addSeconds(interview1StartedAt, 850);
    
    // Interview 2: Sarah Johnson - Data Scientist (15 days ago)
    const interview2StartedAt = getDaysAgo(15);
    const interview2CompletedAt = addSeconds(interview2StartedAt, 1150);
    
    // Interview 3: Michael Chen - UI/UX Designer (12 days ago)
    const interview3StartedAt = getDaysAgo(12);
    const interview3CompletedAt = addSeconds(interview3StartedAt, 880);
    
    // Interview 4: John Smith - Product Manager (8 days ago)
    const interview4StartedAt = getDaysAgo(8);
    const interview4CompletedAt = addSeconds(interview4StartedAt, 1180);
    
    // Interview 5: Sarah Johnson - Marketing Manager (5 days ago)
    const interview5StartedAt = getDaysAgo(5);
    const interview5CompletedAt = addSeconds(interview5StartedAt, 920);
    
    const sampleInterviews = [
        {
            userId: 2,
            resumeId: 1,
            role: 'Software Engineer',
            timePerQuestion: 180,
            totalDuration: 900,
            actualDuration: 850,
            status: 'completed',
            startedAt: interview1StartedAt.toISOString(),
            completedAt: interview1CompletedAt.toISOString(),
            createdAt: interview1StartedAt.toISOString(),
        },
        {
            userId: 3,
            resumeId: 2,
            role: 'Data Scientist',
            timePerQuestion: 240,
            totalDuration: 1200,
            actualDuration: 1150,
            status: 'completed',
            startedAt: interview2StartedAt.toISOString(),
            completedAt: interview2CompletedAt.toISOString(),
            createdAt: interview2StartedAt.toISOString(),
        },
        {
            userId: 4,
            resumeId: 3,
            role: 'UI/UX Designer',
            timePerQuestion: 180,
            totalDuration: 900,
            actualDuration: 880,
            status: 'completed',
            startedAt: interview3StartedAt.toISOString(),
            completedAt: interview3CompletedAt.toISOString(),
            createdAt: interview3StartedAt.toISOString(),
        },
        {
            userId: 2,
            resumeId: 1,
            role: 'Product Manager',
            timePerQuestion: 240,
            totalDuration: 1200,
            actualDuration: 1180,
            status: 'completed',
            startedAt: interview4StartedAt.toISOString(),
            completedAt: interview4CompletedAt.toISOString(),
            createdAt: interview4StartedAt.toISOString(),
        },
        {
            userId: 3,
            resumeId: 2,
            role: 'Marketing Manager',
            timePerQuestion: 180,
            totalDuration: 900,
            actualDuration: 920,
            status: 'completed',
            startedAt: interview5StartedAt.toISOString(),
            completedAt: interview5CompletedAt.toISOString(),
            createdAt: interview5StartedAt.toISOString(),
        },
    ];

    await db.insert(interviews).values(sampleInterviews);
    
    console.log('✅ Interviews seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});