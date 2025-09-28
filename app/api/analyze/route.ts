import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json()

    // 🚀 1. ENHANCED PROMPT ENGINEERING
    const enhancedPrompt = `
You are a senior technical consultant and project evaluator with 15+ years of experience across software development, startup ventures, and CS education. You have deep expertise in realistic project scoping and understand common pitfalls developers encounter.

PROJECT TO ANALYZE: "${idea}"

ANALYSIS FRAMEWORK:
Your role is to provide brutally honest, realistic assessments based on:
- Current technology landscape and learning curves
- Typical developer constraints (time, resources, experience)
- Market realities and competition
- Common project failure patterns

SCORING METHODOLOGY:

Feasibility Score (1-10):
• 9-10: Simple CRUD apps, basic websites, tutorial-level projects
• 7-8: Standard web/mobile apps with common features
• 5-6: Complex integrations, real-time features, moderate ML
• 3-4: Advanced AI/ML, blockchain, distributed systems
• 1-2: Research-level projects, novel algorithms, enterprise-scale

Success Probability (10-95%):
• Consider market saturation, competition, and execution difficulty
• Factor in user acquisition challenges and monetization
• Account for team size limitations and resource constraints
• Never exceed 95% (nothing is guaranteed)

Timeline Estimation Rules:
• Add 50-100% buffer to initial estimates (projects always take longer)
• Account for learning curve: +2-4 weeks for unfamiliar tech
• Include testing/debugging: +30-40% of development time
• Factor in scope creep and unexpected challenges
• Minimum viable timeline for any substantial project: 4-6 weeks

Domain Detection Keywords:
- Web Development: website, web app, SaaS, API, dashboard
- Mobile Development: mobile app, iOS, Android, React Native
- AI/ML: artificial intelligence, machine learning, neural network, NLP
- Blockchain: cryptocurrency, smart contracts, DeFi, NFT
- Data Science: analytics, visualization, big data, ETL
- Game Development: game, unity, graphics, multiplayer

CRITICAL CONSTRAINTS TO CONSIDER:
✓ Solo developer assumed unless specified
✓ Part-time development (evenings/weekends)
✓ Limited budget for third-party services
✓ Learning curve for new technologies
✓ Integration complexity and API limitations
✓ Deployment and maintenance overhead

IMPORTANT: Respond with ONLY valid JSON. Do not include any explanatory text before or after the JSON.

{
  "feasibilityScore": number (1-10),
  "difficultyLevel": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeframe": "string (conservative estimate with buffer)",
  "successProbability": number (10-95),
  "detectedDomain": "Web Development" | "Mobile App Development" | "Machine Learning/AI" | "Data Science" | "Game Development" | "Blockchain/Crypto" | "IoT/Hardware" | "Cybersecurity" | "DevOps/Cloud" | "Desktop Applications",
  "requiredExperience": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeline": "string (realistic with 50% buffer)",
  "keyStrengths": [
    "Specific project advantages",
    "Learning opportunities", 
    "Market potential"
  ],
  "potentialChallenges": [
    "Realistic technical hurdles",
    "Resource/time constraints",
    "Market/adoption challenges"
  ],
  "techStack": {
    "frontend": ["appropriate for complexity level"],
    "backend": ["scalable, maintainable"],
    "database": ["suitable for data needs"],
    "tools": ["development, deployment, monitoring"]
  },
  "roadmap": {
    "phase1": {
      "title": "Planning & Setup",
      "duration": "realistic timeframe",
      "tasks": ["specific setup tasks", "research requirements", "architecture planning"]
    },
    "phase2": {
      "title": "Core Development",
      "duration": "realistic timeframe", 
      "tasks": ["development milestones", "feature implementation", "testing"]
    },
    "phase3": {
      "title": "Polish & Launch",
      "duration": "realistic timeframe",
      "tasks": ["optimization", "user testing", "deployment"]
    }
  },
  "recommendations": [
    "Specific actionable advice",
    "Risk mitigation strategies",
    "Success optimization tips"
  ],
  "similarProjects": ["real-world examples"]
}

Be conservative with all estimates. Return only the JSON object above with no additional text.`

    // 🚀 2. SIMPLIFIED SINGLE-MODEL APPROACH (to avoid validation errors)
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: enhancedPrompt,
      temperature: 0.2 // ✅ Added maxTokens
    })

    console.log("[DEBUG] Raw AI response:", text.substring(0, 200) + "...")

    // 🚀 3. IMPROVED JSON EXTRACTION
    let analysis
    try {
      // Try to parse the full response first
      analysis = JSON.parse(text.trim())
    } catch (parseError) {
      console.log("[DEBUG] Direcnpt parsing failed, attempting JSON extraction...")
      
      // Extract JSON from the response more aggressively
      const jsonStart = text.indexOf('{')
      const jsonEnd = text.lastIndexOf('}')
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const jsonString = text.substring(jsonStart, jsonEnd + 1)
        console.log("[DEBUG] Extracted JSON:", jsonString.substring(0, 200) + "...")
        
        try {
          analysis = JSON.parse(jsonString)
        } catch (extractError) {
          console.error("[DEBUG] JSON extraction also failed:", extractError)
          
          // 🚀 4. FALLBACK TO BASIC ANALYSIS
          analysis = createFallbackAnalysis(idea)
        }
      } else {
        console.error("[DEBUG] No valid JSON structure found in response")
        analysis = createFallbackAnalysis(idea)
      }
    }

    // 🚀 5. APPLY CONTEXT-AWARE SCORING
    const finalAnalysis = applyContextAwareScoring(analysis, idea)
    
    return NextResponse.json(finalAnalysis)
  } catch (error) {
    console.error("Enhanced AI Analysis Error:", error)
    return NextResponse.json({ error: "Failed to analyze project idea" }, { status: 500 })
  }
}

// 🚀 FALLBACK ANALYSIS FUNCTION
function createFallbackAnalysis(idea: string): any {
  const ideaLower = idea.toLowerCase()
  
  // Basic complexity detection
  let feasibilityScore = 7
  let difficultyLevel = "Intermediate"
  let detectedDomain = "Web Development"
  
  if (ideaLower.includes('ai') || ideaLower.includes('machine learning')) {
    feasibilityScore = 4
    difficultyLevel = "Advanced"
    detectedDomain = "Machine Learning/AI"
  } else if (ideaLower.includes('blockchain') || ideaLower.includes('crypto')) {
    feasibilityScore = 3
    difficultyLevel = "Advanced"
    detectedDomain = "Blockchain/Crypto"
  } else if (ideaLower.includes('mobile') || ideaLower.includes('app')) {
    feasibilityScore = 6
    detectedDomain = "Mobile App Development"
  } else if (ideaLower.includes('game')) {
    feasibilityScore = 5
    detectedDomain = "Game Development"
  }

  return {
    feasibilityScore,
    difficultyLevel,
    estimatedTimeframe: "2-4 months",
    successProbability: 65,
    detectedDomain,
    requiredExperience: difficultyLevel,
    estimatedTimeline: "2-4 months with buffer",
    keyStrengths: [
      "Clear project concept",
      "Learning opportunity",
      "Portfolio value"
    ],
    potentialChallenges: [
      "Technical complexity",
      "Time management",
      "Resource constraints"
    ],
    techStack: {
      frontend: ["React", "TypeScript"],
      backend: ["Node.js", "Express"],
      database: ["PostgreSQL"],
      tools: ["Git", "Docker", "Vercel"]
    },
    roadmap: {
      phase1: {
        title: "Planning & Setup",
        duration: "2-3 weeks",
        tasks: ["Project setup", "Research requirements", "Design mockups"]
      },
      phase2: {
        title: "Core Development",
        duration: "6-8 weeks",
        tasks: ["Feature development", "API integration", "Testing"]
      },
      phase3: {
        title: "Polish & Launch",
        duration: "2-3 weeks",
        tasks: ["Bug fixes", "Performance optimization", "Deployment"]
      }
    },
    recommendations: [
      "Start with MVP approach",
      "Focus on core features first",
      "Plan for iterative development"
    ],
    similarProjects: ["Similar web applications", "Open source alternatives"]
  }
}

// 🚀 3. CONTEXT-AWARE SCORING FUNCTION (unchanged but simplified)
function applyContextAwareScoring(analysis: any, originalIdea: string) {
  const ideaLower = originalIdea.toLowerCase()
  
  const complexityFactors = {
    'artificial intelligence': 0.6,
    'machine learning': 0.7,
    'blockchain': 0.6,
    'cryptocurrency': 0.5,
    'real-time': 0.8,
    'distributed': 0.7,
    'microservices': 0.8,
    'scalable': 0.9,
    'enterprise': 0.7,
    'database': 0.9,
    'api integration': 0.9,
    'user authentication': 0.95,
    'crud': 1.2,
    'simple': 1.3,
    'basic': 1.2,
    'static website': 1.4,
    'portfolio': 1.3
  }

  let complexityMultiplier = 1.0
  
  Object.entries(complexityFactors).forEach(([keyword, factor]) => {
    if (ideaLower.includes(keyword)) {
      complexityMultiplier *= factor
    }
  })

  const adjustedFeasibility = Math.max(1, Math.min(10, 
    Math.round(analysis.feasibilityScore * complexityMultiplier)
  ))

  const adjustedSuccess = Math.max(15, Math.min(90, 
    Math.round(analysis.successProbability * complexityMultiplier)
  ))

  return {
    ...analysis,
    feasibilityScore: adjustedFeasibility,
    successProbability: adjustedSuccess,
    contextAdjustment: {
      multiplier: complexityMultiplier.toFixed(2),
      reason: complexityMultiplier < 1 ? 'Reduced for complexity' : 'Standard assessment'
    }
  }
}