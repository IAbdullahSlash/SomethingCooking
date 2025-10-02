"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Brain,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Code,
  Calendar,
  Download,
  Loader2,
  RefreshCw,
  Zap,
  Edit3,
  TrendingUp,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

interface AnalysisData {
  feasibilityScore: number
  difficultyLevel: string
  estimatedTimeframe: string
  successProbability: number
  keyStrengths: string[]
  potentialChallenges: string[]
  // New fields that AI will determine automatically
  detectedDomain: string
  requiredExperience: string
  estimatedTimeline: string
  techStack: {
    frontend: string[]
    backend: string[]
    database: string[]
    tools: string[]
  }
  roadmap: {
    phase1: { title: string; duration: string; tasks: string[] }
    phase2: { title: string; duration: string; tasks: string[] }
    phase3: { title: string; duration: string; tasks: string[] }
  }
  recommendations: string[]
  similarProjects: string[]
  projectTitle?: string
  projectDescription?: string
  contextAdjustment?: {
    multiplier: string
    reason: string
  }
  validationApplied?: {
    adjustments: string
    confidence: string
  }
}

interface GitHubRepo {
  name: string
  description: string
  stars: number
  forks: number
  language: string
  url: string
  owner: string
}

interface TaskProgress {
  [key: string]: boolean
}

export default function AnalysisPage() {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [loading, setLoading] = useState(false)
  const [taskProgress, setTaskProgress] = useState<TaskProgress>({})
  const [showRefinementTools, setShowRefinementTools] = useState(false)
  const [refinementLoading, setRefinementLoading] = useState(false)
  const [refinementSuggestions, setRefinementSuggestions] = useState<string[]>([])
  const [exportLoading, setExportLoading] = useState(false)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [githubLoading, setGithubLoading] = useState(false)
  const [projectModifications, setProjectModifications] = useState({
    title: "",
    description: "",
  })

  // Simplified form data - only idea description needed
  const [formData, setFormData] = useState({
    idea: ""
  })
  const [analyzing, setAnalyzing] = useState(false)

  // 🔧 ALTERNATIVE QUICK FIX - Data Validation Helper
  const validateAnalysisData = (analysisData: any): AnalysisData => {
    // Add this safety check at the top of your component
    if (analysisData && (
      !analysisData.keyStrengths || 
      !analysisData.potentialChallenges || 
      !analysisData.techStack || 
      !analysisData.roadmap ||
      !analysisData.recommendations ||
      !analysisData.similarProjects
    )) {
      console.warn("Analysis data incomplete, some fields may be missing - applying fallbacks")
    }

    return {
      ...analysisData,
      keyStrengths: analysisData.keyStrengths || [],
      potentialChallenges: analysisData.potentialChallenges || [],
      recommendations: analysisData.recommendations || [],
      similarProjects: analysisData.similarProjects || [],
      techStack: {
        frontend: analysisData.techStack?.frontend || [],
        backend: analysisData.techStack?.backend || [],
        database: analysisData.techStack?.database || [],
        tools: analysisData.techStack?.tools || []
      },
      roadmap: {
        phase1: {
          title: analysisData.roadmap?.phase1?.title || "Phase 1",
          duration: analysisData.roadmap?.phase1?.duration || "TBD",
          tasks: analysisData.roadmap?.phase1?.tasks || []
        },
        phase2: {
          title: analysisData.roadmap?.phase2?.title || "Phase 2", 
          duration: analysisData.roadmap?.phase2?.duration || "TBD",
          tasks: analysisData.roadmap?.phase2?.tasks || []
        },
        phase3: {
          title: analysisData.roadmap?.phase3?.title || "Phase 3",
          duration: analysisData.roadmap?.phase3?.duration || "TBD", 
          tasks: analysisData.roadmap?.phase3?.tasks || []
        }
      }
    }
  }

  const fetchGitHubRepos = async (searchQuery: string) => {
    setGithubLoading(true)
    try {
      const response = await fetch("/api/github-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      })

      if (response.ok) {
        const data = await response.json()
        setGithubRepos(data.repositories || [])
      }
    } catch (error) {
      console.error("Failed to fetch GitHub repositories:", error)
    } finally {
      setGithubLoading(false)
    }
  }

  // Updated function to handle form submission with only idea description
  const handleAnalyzeIdea = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    
    if (!formData.idea.trim()) return

    setAnalyzing(true)
    try {
      console.log("[Analysis] Making API call to /api/analyze...")
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: formData.idea }),
      })

      console.log("[Analysis] API response status:", response.status)

      if (response.ok) {
        const rawAnalysisData = await response.json()
        console.log("[Analysis] Analysis data received successfully")
        
        // 🔧 Apply validation and fallbacks
        const validatedAnalysisData = validateAnalysisData(rawAnalysisData)
        
        const enhancedAnalysis = {
          ...validatedAnalysisData,
          projectTitle: `Project: ${formData.idea.substring(0, 50)}${formData.idea.length > 50 ? "..." : ""}`,
          projectDescription: formData.idea,
        }

        setAnalysis(enhancedAnalysis)
        localStorage.setItem("projectAnalysis", JSON.stringify(enhancedAnalysis))
        
        setProjectModifications({
          title: enhancedAnalysis.projectTitle || "",
          description: enhancedAnalysis.projectDescription || "",
        })
        
        fetchGitHubRepos(formData.idea)
      } else {
        const errorText = await response.text()
        console.error("[Analysis] API call failed:", errorText)
        alert(`Failed to generate analysis. Status: ${response.status}`)
      }
    } catch (error) {
      console.error("[Analysis] Error:", error)
      alert(`Network error occurred: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    // Only load cached analysis and task progress on mount
    const loadCachedData = () => {
      const storedAnalysis = localStorage.getItem("projectAnalysis")
      if (storedAnalysis) {
        const parsedAnalysis = JSON.parse(storedAnalysis)
        // 🔧 Apply validation to cached data too
        const validatedAnalysis = validateAnalysisData(parsedAnalysis)
        setAnalysis(validatedAnalysis)
        setProjectModifications({
          title: validatedAnalysis.projectTitle || "",
          description: validatedAnalysis.projectDescription || "",
        })
        if (validatedAnalysis.projectTitle) {
          fetchGitHubRepos(validatedAnalysis.projectTitle)
        }
      }

      const storedProgress = localStorage.getItem("taskProgress")
      if (storedProgress) {
        setTaskProgress(JSON.parse(storedProgress))
      }
    }

    loadCachedData()
  }, [])

  const exportToPDF = async () => {
    if (!analysis) return

    setExportLoading(true)
    try {
      const response = await fetch("/api/export-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysis,
          taskProgress,
          overallProgress: getOverallProgress(),
        }),
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${analysis.projectTitle || "Project"}_Analysis_Report.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        throw new Error("Export failed")
      }
    } catch (error) {
      console.error("PDF export failed:", error)
      alert("Failed to export PDF. Please try again.")
    } finally {
      setExportLoading(false)
    }
  }

  const generateRefinementSuggestions = async () => {
    if (!analysis) return

    setRefinementLoading(true)
    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentAnalysis: analysis,
          projectTitle: analysis.projectTitle,
          projectDescription: analysis.projectDescription,
        }),
      })

      if (response.ok) {
        const suggestions = await response.json()
        setRefinementSuggestions(suggestions.suggestions || [])
      }
    } catch (error) {
      console.error("Failed to generate refinement suggestions:", error)
    } finally {
      setRefinementLoading(false)
    }
  }

  const reAnalyzeProject = async () => {
    setRefinementLoading(true)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: `${projectModifications.title}: ${projectModifications.description}`,
        }),
      })

      if (response.ok) {
        const rawNewAnalysis = await response.json()
        // 🔧 Apply validation to re-analyzed data
        const validatedNewAnalysis = validateAnalysisData(rawNewAnalysis)
        
        const updatedAnalysis = {
          ...validatedNewAnalysis,
          projectTitle: projectModifications.title,
          projectDescription: projectModifications.description,
        }

        setAnalysis(updatedAnalysis)
        localStorage.setItem("projectAnalysis", JSON.stringify(updatedAnalysis))
        setShowRefinementTools(false)
        fetchGitHubRepos(projectModifications.title)
      }
    } catch (error) {
      console.error("Re-analysis failed:", error)
    } finally {
      setRefinementLoading(false)
    }
  }

  const handleTaskToggle = (taskId: string) => {
    const newProgress = { ...taskProgress, [taskId]: !taskProgress[taskId] }
    setTaskProgress(newProgress)
    localStorage.setItem("taskProgress", JSON.stringify(newProgress))
  }

  // 🔧 PROTECTED HELPER FUNCTIONS
  const getPhaseProgress = (phaseTasks: string[], phaseKey: string) => {
    if (!phaseTasks || phaseTasks.length === 0) return 0
    const completedTasks = phaseTasks.filter((_, index) => taskProgress[`${phaseKey}-${index}`]).length
    return (completedTasks / phaseTasks.length) * 100
  }

  const getOverallProgress = () => {
    if (!analysis || !analysis.roadmap) return 0
    
    const phase1Tasks = analysis.roadmap.phase1?.tasks || []
    const phase2Tasks = analysis.roadmap.phase2?.tasks || []
    const phase3Tasks = analysis.roadmap.phase3?.tasks || []
    
    const allTasks = [...phase1Tasks, ...phase2Tasks, ...phase3Tasks]
    
    if (allTasks.length === 0) return 0
    
    const completedTasks = allTasks.filter((_, globalIndex) => {
      const phase1Length = phase1Tasks.length
      const phase2Length = phase2Tasks.length

      if (globalIndex < phase1Length) {
        return taskProgress[`phase1-${globalIndex}`]
      } else if (globalIndex < phase1Length + phase2Length) {
        return taskProgress[`phase2-${globalIndex - phase1Length}`]
      } else {
        return taskProgress[`phase3-${globalIndex - phase1Length - phase2Length}`]
      }
    }).length
    
    return (completedTasks / allTasks.length) * 100
  }

  const getFeasibilityColor = (score: number) => {
    if (score >= 8) return "text-green-500"
    if (score >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getFeasibilityBadge = (score: number) => {
    if (score >= 8) return { variant: "default" as const, text: "Highly Feasible" }
    if (score >= 6) return { variant: "secondary" as const, text: "Feasible" }
    return { variant: "destructive" as const, text: "Challenging" }
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">The Idea Evaluator</h1>
                <p className="text-sm text-muted-foreground">AI-powered project validation</p>
              </div>
            </Link>
            
            {analysis && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowRefinementTools(!showRefinementTools)}
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Refine Project
                </Button>
                <Button
                  variant="outline"
                  onClick={exportToPDF}
                  disabled={exportLoading}
                  className="flex items-center gap-2 bg-transparent"
                >
                  {exportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Export PDF
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Simplified Idea Input Section */}
          <Card className="shadow-2xl border-2">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl">Analyze Your Project Idea</CardTitle>
              <CardDescription>
                {analysis 
                  ? "Analyze a new project idea or modify your current one" 
                  : "Describe your project concept - our AI will automatically assess difficulty, timeline, and tech requirements"
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleAnalyzeIdea} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-idea">Project Idea</Label>
                  <Textarea
                    id="project-idea"
                    placeholder="Describe your project idea in detail... (e.g., A mobile app that helps students find study groups with location-based matching and real-time chat features, An AI-powered code review tool that integrates with GitHub and provides suggestions for optimization, A blockchain-based voting system for university elections with enhanced security)"
                    className="min-h-32 text-base"
                    value={formData.idea}
                    onChange={(e) => setFormData(prev => ({ ...prev, idea: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    💡 Tip: Be specific about features, target users, and any technical requirements for better analysis
                  </p>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full text-lg py-6"
                  disabled={!formData.idea.trim() || analyzing}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Analyzing Your Idea...
                    </>
                  ) : (
                    <>
                      {analysis ? "Analyze New Idea" : "Get AI Analysis"}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <>
              {/* Project Overview with AI Assessments */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl">{analysis.projectTitle || "Your Project"}</CardTitle>
                      <CardDescription className="text-lg mt-2">
                        {analysis.projectDescription || "AI-powered project analysis"}
                      </CardDescription>
                      
                      {/* AI-Detected Project Attributes */}
                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge variant="outline" className="text-sm">
                          <Code className="w-3 h-3 mr-1" />
                          {analysis.detectedDomain || "Web Development"}
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          <Brain className="w-3 h-3 mr-1" />
                          {analysis.requiredExperience || "Intermediate"} Level
                        </Badge>
                        <Badge variant="outline" className="text-sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {analysis.estimatedTimeline || analysis.estimatedTimeframe || "2-4 months"}
                        </Badge>
                      </div>
                    </div>
                    <Badge {...getFeasibilityBadge(analysis.feasibilityScore)} className="text-lg px-4 py-2">
                      {getFeasibilityBadge(analysis.feasibilityScore).text}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>

              {/* Project Refinement Tools Section */}
              {showRefinementTools && (
                <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-6 h-6 text-purple-500" />
                      Project Refinement Tools
                    </CardTitle>
                    <CardDescription>
                      Improve your project with AI-powered suggestions and iterative refinement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* AI Suggestions */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-purple-500" />
                          AI Improvement Suggestions
                        </h4>
                        <Button
                          onClick={generateRefinementSuggestions}
                          disabled={refinementLoading}
                          size="sm"
                          variant="outline"
                        >
                          {refinementLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          )}
                          Generate Suggestions
                        </Button>
                      </div>

                      {refinementSuggestions.length > 0 && (
                        <div className="bg-purple-500/5 p-4 rounded-lg border border-purple-500/20">
                          <ul className="space-y-2">
                            {refinementSuggestions.map((suggestion, index) => (
                              <li key={index} className="flex items-start gap-2 text-sm">
                                <Lightbulb className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" />
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Simplified Project Modification Form */}
                    <div className="space-y-4">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Edit3 className="w-5 h-5 text-purple-500" />
                        Modify Project Details
                      </h4>

                      <div className="space-y-2">
                        <Label htmlFor="refine-title">Project Title</Label>
                        <input
                          id="refine-title"
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                          value={projectModifications.title}
                          onChange={(e) => setProjectModifications((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Updated project title"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="refine-description">Project Description</Label>
                        <Textarea
                          id="refine-description"
                          value={projectModifications.description}
                          onChange={(e) => setProjectModifications((prev) => ({ ...prev, description: e.target.value }))}
                          placeholder="Updated project description with improvements..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={reAnalyzeProject}
                          disabled={refinementLoading || !projectModifications.title || !projectModifications.description}
                          className="flex items-center gap-2"
                        >
                          {refinementLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          Re-Analyze Project
                        </Button>
                        <Button variant="outline" onClick={() => setShowRefinementTools(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Feasibility Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    Feasibility Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${getFeasibilityColor(analysis.feasibilityScore)}`}>
                        {analysis.feasibilityScore}/10
                      </div>
                      <p className="text-sm text-muted-foreground">Feasibility Score</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-500 mb-2">{analysis.successProbability}%</div>
                      <p className="text-sm text-muted-foreground">Success Probability</p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-500 mb-2">{analysis.difficultyLevel}</div>
                      <p className="text-sm text-muted-foreground">Difficulty Level</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-green-500">Key Strengths</h4>
                      <ul className="space-y-1">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.keyStrengths || []).map((strength, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-yellow-500">Potential Challenges</h4>
                      <ul className="space-y-1">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.potentialChallenges || []).map((challenge, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tech Stack Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6" />
                    Recommended Tech Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-3">Frontend</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.techStack?.frontend || []).map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Backend</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.techStack?.backend || []).map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Database</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.techStack?.database || []).map((tech, index) => (
                          <Badge key={index} variant="outline">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3">Tools & Services</h4>
                      <div className="flex flex-wrap gap-2">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.techStack?.tools || []).map((tool, index) => (
                          <Badge key={index} variant="outline">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Interactive Development Roadmap */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-6 h-6" />
                    Interactive Development Roadmap
                  </CardTitle>
                  <CardDescription>Track your progress through each development phase</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-6">
                    {/* Phase 1 */}
                    <div className="border-l-4 border-blue-500 pl-4 bg-blue-500/5 p-4 rounded-r-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-blue-500">
                          {analysis.roadmap?.phase1?.title || "Phase 1"} ({analysis.roadmap?.phase1?.duration || "TBD"})
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.round(getPhaseProgress(analysis.roadmap?.phase1?.tasks || [], "phase1"))}%
                          </span>
                          <Progress
                            value={getPhaseProgress(analysis.roadmap?.phase1?.tasks || [], "phase1")}
                            className="w-20 h-2"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.roadmap?.phase1?.tasks || []).map((task, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Checkbox
                              id={`phase1-${index}`}
                              checked={taskProgress[`phase1-${index}`] || false}
                              onCheckedChange={() => handleTaskToggle(`phase1-${index}`)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={`phase1-${index}`}
                              className={`text-sm cursor-pointer ${
                                taskProgress[`phase1-${index}`] ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {task}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="border-l-4 border-yellow-500 pl-4 bg-yellow-500/5 p-4 rounded-r-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-yellow-500">
                          {analysis.roadmap?.phase2?.title || "Phase 2"} ({analysis.roadmap?.phase2?.duration || "TBD"})
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.round(getPhaseProgress(analysis.roadmap?.phase2?.tasks || [], "phase2"))}%
                          </span>
                          <Progress
                            value={getPhaseProgress(analysis.roadmap?.phase2?.tasks || [], "phase2")}
                            className="w-20 h-2"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.roadmap?.phase2?.tasks || []).map((task, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Checkbox
                              id={`phase2-${index}`}
                              checked={taskProgress[`phase2-${index}`] || false}
                              onCheckedChange={() => handleTaskToggle(`phase2-${index}`)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={`phase2-${index}`}
                              className={`text-sm cursor-pointer ${
                                taskProgress[`phase2-${index}`] ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {task}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="border-l-4 border-green-500 pl-4 bg-green-500/5 p-4 rounded-r-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-green-500">
                          {analysis.roadmap?.phase3?.title || "Phase 3"} ({analysis.roadmap?.phase3?.duration || "TBD"})
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {Math.round(getPhaseProgress(analysis.roadmap?.phase3?.tasks || [], "phase3"))}%
                          </span>
                          <Progress
                            value={getPhaseProgress(analysis.roadmap?.phase3?.tasks || [], "phase3")}
                            className="w-20 h-2"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        {/* 🔧 PROTECTED MAP OPERATION */}
                        {(analysis.roadmap?.phase3?.tasks || []).map((task, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <Checkbox
                              id={`phase3-${index}`}
                              checked={taskProgress[`phase3-${index}`] || false}
                              onCheckedChange={() => handleTaskToggle(`phase3-${index}`)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={`phase3-${index}`}
                              className={`text-sm cursor-pointer ${
                                taskProgress[`phase3-${index}`] ? "line-through text-muted-foreground" : "text-foreground"
                              }`}
                            >
                              {task}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress */}
                  <div className="bg-muted/30 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Overall Progress</h4>
                      <span className="text-sm font-medium">{Math.round(getOverallProgress())}%</span>
                    </div>
                    <Progress value={getOverallProgress()} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              {/* GitHub Repositories */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="w-6 h-6 text-blue-500" />
                    Similar Projects & Repositories
                  </CardTitle>
                  <CardDescription>Explore existing GitHub repositories related to your project idea</CardDescription>
                </CardHeader>
                <CardContent>
                  {githubLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" />
                      <span className="text-muted-foreground">Searching GitHub repositories...</span>
                    </div>
                  ) : githubRepos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {githubRepos.map((repo, index) => (
                        <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-sm">
                              <a
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                              >
                                {repo.owner}/{repo.name}
                              </a>
                            </h4>
                            <Badge variant="outline" className="text-xs">
                              {repo.language}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{repo.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">⭐ {repo.stars.toLocaleString()}</span>
                            <span className="flex items-center gap-1">🍴 {repo.forks.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No similar repositories found</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    AI Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {/* 🔧 PROTECTED MAP OPERATION */}
                    {(analysis.recommendations || []).map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="w-6 h-6 bg-yellow-500/10 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                          <span className="text-yellow-600 font-semibold text-xs">{index + 1}</span>
                        </div>
                        {recommendation}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Similar Projects */}
              {(analysis.similarProjects || []).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Similar Projects for Reference</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {/* 🔧 PROTECTED MAP OPERATION */}
                      {(analysis.similarProjects || []).map((project, index) => (
                        <Badge key={index} variant="secondary">
                          {project}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-8">
                <Button 
                  size="lg" 
                  onClick={exportToPDF} 
                  disabled={exportLoading} 
                  className="flex items-center gap-2"
                >
                  {exportLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                  Download Full Report
                </Button>
              </div>
            </>
          )}

          {/* No Analysis State */}
          {!analysis && !loading && !analyzing && (
            <Card className="text-center py-12">
              <CardContent>
                <Brain className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <CardTitle className="mb-2">Ready to Analyze Your Project Idea</CardTitle>
                <CardDescription>
                  Our AI will automatically assess difficulty, timeline, domain, and provide tailored recommendations
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}