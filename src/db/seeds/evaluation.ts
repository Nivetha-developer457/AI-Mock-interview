import { db } from '@/db';
import { evaluations } from '@/db/schema';

async function main() {
    const sampleEvaluations = [
        {
            interviewId: 1,
            userId: 2,
            communicationScore: 85,
            confidenceScore: 82,
            technicalAccuracyScore: 88,
            resumeAlignmentScore: 90,
            personalityFitScore: 87,
            overallScore: 86,
            strengths: ["Strong technical knowledge", "Clear communication", "Problem-solving skills", "Experience with modern frameworks"],
            weaknesses: ["Could elaborate more on system design", "Limited cloud platform experience"],
            improvementSuggestions: ["Practice system design scenarios", "Gain more experience with AWS/Azure", "Work on concise explanations"],
            roleFitRecommendation: "Excellent fit for Software Engineer role. Strong technical foundation and communication skills.",
            evaluationData: {
                detailedAnalysis: {
                    communication: {
                        clarity: "Excellent",
                        articulation: "Clear and concise",
                        examples: "Provided relevant examples from past projects"
                    },
                    technical: {
                        depth: "Strong understanding of core concepts",
                        breadth: "Good coverage of required technologies",
                        problemSolving: "Demonstrated logical approach to challenges"
                    },
                    behavioral: {
                        teamwork: "Collaborative mindset evident",
                        adaptability: "Showed flexibility in approach",
                        leadership: "Emerging leadership qualities"
                    }
                },
                keyHighlights: [
                    "Implemented microservices architecture at previous company",
                    "Strong understanding of React and TypeScript",
                    "Good grasp of database design principles"
                ],
                concernAreas: [
                    "System design experience needs strengthening",
                    "Limited exposure to cloud platforms"
                ]
            },
            createdAt: new Date('2024-01-20T11:30:00Z').toISOString(),
        },
        {
            interviewId: 2,
            userId: 3,
            communicationScore: 90,
            confidenceScore: 88,
            technicalAccuracyScore: 92,
            resumeAlignmentScore: 95,
            personalityFitScore: 89,
            overallScore: 91,
            strengths: ["Exceptional analytical skills", "Deep ML knowledge", "Research-oriented mindset", "Strong statistical foundation"],
            weaknesses: ["Could improve production deployment knowledge", "Limited big data tools experience"],
            improvementSuggestions: ["Learn MLOps practices", "Gain experience with Spark/Hadoop", "Practice business communication"],
            roleFitRecommendation: "Outstanding candidate for Data Scientist role. Excellent technical skills and analytical thinking.",
            evaluationData: {
                detailedAnalysis: {
                    communication: {
                        clarity: "Outstanding",
                        articulation: "Highly articulate with technical concepts",
                        examples: "Used data-driven examples effectively"
                    },
                    technical: {
                        depth: "Deep expertise in machine learning algorithms",
                        breadth: "Comprehensive knowledge of data science stack",
                        problemSolving: "Exceptional analytical problem-solving"
                    },
                    behavioral: {
                        teamwork: "Strong collaborative skills",
                        adaptability: "Quick to adapt to new methodologies",
                        leadership: "Demonstrated thought leadership"
                    }
                },
                keyHighlights: [
                    "Published research in ML conferences",
                    "Built and deployed multiple ML models",
                    "Expert in Python, TensorFlow, and PyTorch",
                    "Strong statistical modeling background"
                ],
                concernAreas: [
                    "Production ML deployment experience is limited",
                    "Could benefit from more big data processing experience"
                ]
            },
            createdAt: new Date('2024-01-22T15:45:00Z').toISOString(),
        },
        {
            interviewId: 3,
            userId: 4,
            communicationScore: 92,
            confidenceScore: 90,
            technicalAccuracyScore: 85,
            resumeAlignmentScore: 93,
            personalityFitScore: 91,
            overallScore: 90,
            strengths: ["User-centered design approach", "Strong portfolio", "Excellent visual design skills", "Collaborative mindset"],
            weaknesses: ["Limited experience with design systems", "Could improve accessibility knowledge"],
            improvementSuggestions: ["Study WCAG guidelines", "Build component libraries", "Practice rapid prototyping"],
            roleFitRecommendation: "Highly qualified for UI/UX Designer role. Strong design thinking and user empathy.",
            evaluationData: {
                detailedAnalysis: {
                    communication: {
                        clarity: "Exceptional",
                        articulation: "Clearly explained design decisions",
                        examples: "Showcased impressive portfolio work"
                    },
                    technical: {
                        depth: "Strong design principles knowledge",
                        breadth: "Proficient in industry-standard tools",
                        problemSolving: "Creative problem-solving approach"
                    },
                    behavioral: {
                        teamwork: "Highly collaborative with cross-functional teams",
                        adaptability: "Flexible to feedback and iteration",
                        leadership: "Takes initiative in design direction"
                    }
                },
                keyHighlights: [
                    "Impressive portfolio with diverse projects",
                    "Strong user research and testing experience",
                    "Proficient in Figma, Adobe XD, and Sketch",
                    "Demonstrated empathy for user needs"
                ],
                concernAreas: [
                    "Design system experience could be expanded",
                    "Accessibility considerations need strengthening"
                ]
            },
            createdAt: new Date('2024-01-25T10:15:00Z').toISOString(),
        },
        {
            interviewId: 4,
            userId: 2,
            communicationScore: 88,
            confidenceScore: 85,
            technicalAccuracyScore: 80,
            resumeAlignmentScore: 78,
            personalityFitScore: 86,
            overallScore: 83,
            strengths: ["Strategic thinking", "Technical background advantage", "Good stakeholder management", "Data-driven approach"],
            weaknesses: ["Limited product management experience", "Could strengthen market analysis skills", "Needs more leadership examples"],
            improvementSuggestions: ["Take product management courses", "Work on customer discovery", "Develop go-to-market strategies"],
            roleFitRecommendation: "Good potential for Product Manager role with some gaps to address. Technical background is a strong asset.",
            evaluationData: {
                detailedAnalysis: {
                    communication: {
                        clarity: "Good",
                        articulation: "Clear but could be more structured",
                        examples: "Provided relevant but limited examples"
                    },
                    technical: {
                        depth: "Strong technical understanding",
                        breadth: "Good grasp of product lifecycle",
                        problemSolving: "Analytical approach to product decisions"
                    },
                    behavioral: {
                        teamwork: "Good cross-functional collaboration",
                        adaptability: "Open to learning and growth",
                        leadership: "Emerging leadership potential"
                    }
                },
                keyHighlights: [
                    "Technical background provides strong foundation",
                    "Strategic thinking evident in responses",
                    "Data-driven decision making approach",
                    "Good understanding of agile methodologies"
                ],
                concernAreas: [
                    "Limited direct product management experience",
                    "Market analysis skills need development",
                    "Could provide more concrete leadership examples"
                ]
            },
            createdAt: new Date('2024-01-28T14:20:00Z').toISOString(),
        },
        {
            interviewId: 5,
            userId: 3,
            communicationScore: 87,
            confidenceScore: 83,
            technicalAccuracyScore: 82,
            resumeAlignmentScore: 75,
            personalityFitScore: 85,
            overallScore: 82,
            strengths: ["Analytical mindset", "Digital marketing knowledge", "Data interpretation skills", "Creative problem solving"],
            weaknesses: ["Limited traditional marketing experience", "Could improve brand strategy knowledge", "Needs more campaign examples"],
            improvementSuggestions: ["Study brand positioning", "Gain experience with marketing automation", "Build portfolio of campaigns"],
            roleFitRecommendation: "Moderate fit for Marketing Manager role. Strong analytical skills but needs more marketing experience.",
            evaluationData: {
                detailedAnalysis: {
                    communication: {
                        clarity: "Good",
                        articulation: "Clear but marketing-specific terminology limited",
                        examples: "Provided some relevant examples"
                    },
                    technical: {
                        depth: "Strong digital marketing fundamentals",
                        breadth: "Good knowledge of analytics tools",
                        problemSolving: "Analytical approach to marketing challenges"
                    },
                    behavioral: {
                        teamwork: "Collaborative mindset",
                        adaptability: "Shows willingness to learn",
                        leadership: "Potential for growth into leadership"
                    }
                },
                keyHighlights: [
                    "Strong analytical and data interpretation skills",
                    "Good understanding of digital marketing channels",
                    "Experience with Google Analytics and SEO",
                    "Creative problem-solving approach"
                ],
                concernAreas: [
                    "Limited experience with full marketing campaigns",
                    "Brand strategy knowledge needs development",
                    "Traditional marketing experience is minimal"
                ]
            },
            createdAt: new Date('2024-02-01T16:00:00Z').toISOString(),
        }
    ];

    await db.insert(evaluations).values(sampleEvaluations);
    
    console.log('✅ Evaluations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});