import { generateText } from "ai"
import { createGroq } from "@ai-sdk/groq"
import { type NextRequest, NextResponse } from "next/server"

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { idea, stage = 'stage1' } = await request.json()

    // 🚀 1. STAGE-SPECIFIC PROMPT ENGINEERING
    const stagePrompts = {
      stage1: `
You are a senior technical consultant providing an honest reality check for a project idea.

PROJECT TO ANALYZE: "${idea}"

You must provide a concise but comprehensive assessment focusing on three key areas:

1. HONEST REALITY CHECK:
- Is this idea actually feasible with current technology?
- What are the real-world challenges and obstacles?
- How complex is this really to build and maintain?

3. AI VERDICT:
- Overall feasibility score (1-10) with clear reasoning
- Success probability percentage with justification
- Recommended approach (build, modify, or abandon)
- Key next steps if proceeding

IMPORTANT: 
- Be brutally honest and realistic
- Focus on practical implementation challenges
- Consider market realities and competition
- Keep total response under 250 words
- Use clear, direct language without fluff

Respond with ONLY valid JSON:
{
  "feasibilityScore": number (1-10),
  "difficultyLevel": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeframe": "realistic estimate with buffer",
  "successProbability": number (10-95),
  "detectedDomain": "domain category",
  "requiredExperience": "Beginner" | "Intermediate" | "Advanced",
  "honestRealityCheck": "Direct assessment of feasibility and real challenges",
  "detailedOverview": "Market, technical, and resource analysis",
  "aiVerdict": "Overall recommendation with clear next steps"
}`,

      stage2: `
You are a senior technical consultant providing detailed executive analysis for a validated project idea.

PROJECT TO ANALYZE: "${idea}"

Create an elaborate, structured analysis with exactly these sections up to 300 words:

**## Market Reality Assessment**
- Evaluate if the idea solves a real, clear problem (2-3 sentences)
- Judge market saturation and competition level (2-3 sentences)

**## Technical Feasibility Analysis**
- Assess development complexity and required skills (2-3 sentences)
- Identify key technical risks and challenges (2-3 sentences)

**## Success Probability Factors**
- List 2-3 key strengths using bullet points with **bold labels**:
  - **Strength 1**: Description
  - **Strength 2**: Description
- List 2-3 major challenges using bullet points with **bold labels**:
  - **Challenge 1**: Description
  - **Challenge 2**: Description

**## Final Verdict**
- Provide 2-3 sentences with honest recommendation

Format as markdown with proper headings and bullet points.

Respond with ONLY valid JSON:
{
  "feasibilityScore": number (1-10),
  "difficultyLevel": "Beginner" | "Intermediate" | "Advanced",
  "estimatedTimeframe": "conservative estimate with buffer",
  "successProbability": number (10-95),
  "detectedDomain": "detailed domain classification",
  "requiredExperience": "Beginner" | "Intermediate" | "Advanced",
  "honestAiFeedback": "The detailed markdown formatted analysis as specified above",
  "keyStrengths": {
    "valueProposition": "unique advantages",
    "marketFit": "target audience pain points"
  },
  "potentialChallenges": {
    "technicalRisks": "technology challenges",
    "usabilityIssues": "user adoption barriers", 
    "marketRisks": "competition and acquisition challenges"
  },
  "techStack": {
    "frontend": ["appropriate technologies"],
    "backend": ["scalable solutions"],
    "database": ["suitable database"],
    "tools": ["development tools"]
  }
}`
    }

    // Select the appropriate prompt based on stage
    const selectedPrompt = stagePrompts[stage as keyof typeof stagePrompts] || stagePrompts.stage1

    // 🚀 2. ENHANCED SINGLE-MODEL APPROACH with better JSON reliability
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: selectedPrompt,
      temperature: 0.1, // Lower temperature for more consistent JSON output
    })

    console.log("[DEBUG] Raw AI response:", text.substring(0, 200) + "...")

    // 🚀 3. IMPROVED JSON EXTRACTION
    let analysis
    try {
      // Try to parse the full response first
      analysis = JSON.parse(text.trim())
    } catch (parseError) {
      console.log("[DEBUG] Direct parsing failed, attempting JSON extraction...")
      
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
          
          // 🚀 4. RETURN ERROR - NO FALLBACK
          return NextResponse.json({ 
            error: "AI analysis failed to generate valid response. Please try again." 
          }, { status: 500 })
        }
      } else {
        console.error("[DEBUG] No valid JSON structure found in response")
        return NextResponse.json({ 
          error: "AI analysis failed to generate valid response. Please try again." 
        }, { status: 500 })
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

// 🚀 3. CONTEXT-AWARE SCORING FUNCTION
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