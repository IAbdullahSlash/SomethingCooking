
import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { idea, experience, timeline, domain } = await request.json()

    const prompt = `
You are an expert AI consultant for Computer Science projects. Analyze the following project idea and provide a comprehensive evaluation:

Project Idea: ${idea}
Developer Experience: ${experience}
Timeline: ${timeline}
Domain: ${domain}

Please provide a detailed analysis in the following JSON format:
{
  "feasibilityScore": number (1-10),
  "difficultyLevel": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeframe": "string",
  "successProbability": number (1-100),
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
