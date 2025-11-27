import { db } from '@/db';
import { users } from '@/db/schema';

async function main() {
    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const fortyFiveDaysAgo = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const sampleUsers = [
        {
            email: 'admin@interview.ai',
            fullName: 'Admin User',
            role: 'admin',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            createdAt: ninetyDaysAgo.toISOString(),
            updatedAt: ninetyDaysAgo.toISOString(),
        },
        {
            email: 'john.smith@example.com',
            fullName: 'John Smith',
            role: 'user',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
            createdAt: sixtyDaysAgo.toISOString(),
            updatedAt: sixtyDaysAgo.toISOString(),
        },
        {
            email: 'sarah.johnson@example.com',
            fullName: 'Sarah Johnson',
            role: 'user',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
            createdAt: fortyFiveDaysAgo.toISOString(),
            updatedAt: fortyFiveDaysAgo.toISOString(),
        },
        {
            email: 'michael.chen@example.com',
            fullName: 'Michael Chen',
            role: 'user',
            avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
            createdAt: thirtyDaysAgo.toISOString(),
            updatedAt: thirtyDaysAgo.toISOString(),
        }
    ];

    await db.insert(users).values(sampleUsers);
    
    console.log('✅ Users seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});