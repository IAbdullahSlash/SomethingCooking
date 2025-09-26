import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json()

    const prompt = `
You are an expert AI consultant for Computer Science projects. Analyze the following project idea and provide a comprehensive evaluation.

IMPORTANT: Based on the project idea alone, you need to determine:
1. The most suitable domain/category
2. Required experience level for successful completion
3. Realistic timeline estimate
4. Appropriate difficulty assessment

Project Idea: ${idea}

Analyze the project and provide a detailed response in the following JSON format:
{
  "feasibilityScore": number (1-10),
  "difficultyLevel": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeframe": "string (e.g., '2-4 weeks', '2-3 months', '6+ months')",
  "successProbability": number (1-100),
  "detectedDomain": "string (e.g., 'Web Development', 'Mobile App Development', 'Machine Learning/AI', 'Data Science', 'Game Development', 'Blockchain/Crypto', 'IoT/Hardware', 'Cybersecurity', 'DevOps/Cloud', 'Desktop Applications')",
  "requiredExperience": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeline": "string (realistic time estimate like '1-2 weeks', '1-3 months', '6+ months')",
  "keyStrengths": ["strength1", "strength2", "strength3"],
  "potentialChallenges": ["challenge1", "challenge2", "challenge3"],
  "techStack": {
    "frontend": ["tech1", "tech2"],
    "backend": ["tech1", "tech2"],
    "database": ["tech1", "tech2"],
    "tools": ["tool1", "tool2"]
  },
  "roadmap": {
    "phase1": {
      "title": "Research & Planning",
      "duration": "string",
      "tasks": ["task1", "task2", "task3"]
    },
    "phase2": {
      "title": "Implementation",
      "duration": "string", 
      "tasks": ["task1", "task2", "task3"]
    },
    "phase3": {
      "title": "Testing & Deployment",
      "duration": "string",
      "tasks": ["task1", "task2", "task3"]
    }
  },
  "recommendations": ["rec1", "rec2", "rec3"],
  "similarProjects": ["project1", "project2", "project3"]
}

Analysis Guidelines:
- detectedDomain: Choose the most appropriate domain based on the project description
- requiredExperience: Assess minimum skill level needed (Beginner: 0-1 years, Intermediate: 1-3 years, Advanced: 3+ years)
- estimatedTimeline: Realistic time estimate considering project complexity
- feasibilityScore: Rate 1-10 how achievable this project is
- difficultyLevel: Overall project difficulty regardless of developer experience
- techStack: Recommend appropriate technologies for the detected domain and complexity
- roadmap: Create phase-appropriate tasks based on project scope and timeline
- Make timeline estimates realistic - don't underestimate complex projects

Provide only the JSON response, no additional text.`

    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt
    })

    // Parse the JSON response
    const analysis = JSON.parse(text)

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("AI Analysis Error:", error)
    return NextResponse.json({ error: "Failed to analyze project idea" }, { status: 500 })
  }
}