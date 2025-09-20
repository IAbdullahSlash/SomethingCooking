"use client"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, Map, Users, ArrowRight } from "lucide-react"
import { useState } from "react"

export default function HomePage() {
  const [projectIdea, setProjectIdea] = useState("")

  const handleGetAnalysis = () => {
    if (projectIdea.trim()) {
      localStorage.setItem("pendingProjectIdea", projectIdea.trim())
      // Navigate to login
      window.location.href = "/login"
    }
  }

  return (
    <div className="min-h-screen bg-background dark">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">The Idea Evaluator</h1>
                <p className="text-sm text-muted-foreground">AI-powered project validation</p>
              </div>
            </div>
            <Badge variant="secondary" className="hidden sm:flex">
              For CS Students & Developers
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section with Simple Input */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
              Validate Your Project Ideas with <span className="text-primary">Idea-Evaluator</span>
            </h2>
            <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto">
              Access in-depth feasibility assessments, strategic project roadmaps, and curated technology stack recommendations. designed to support Computer Science projects, hackathons participants, and independent development initiatives.
            </p>

            <div className="max-w-2xl mx-auto mt-12">
              <Card className="shadow-2xl border-2">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl">Share Your Project Idea</CardTitle>
                  <CardDescription>Describe your project concept and get instant AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Describe your project idea here... (e.g., A mobile app that helps students find study groups, An AI-powered code review tool, A blockchain-based voting system)"
                    className="min-h-32 text-base"
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                  />
                  <Button
                    size="lg"
                    className="w-full text-lg py-6"
                    onClick={handleGetAnalysis}
                    disabled={!projectIdea.trim()}
                  >
                    Get AI Analysis <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-bold mb-4">What You'll Get</h3>
              <p className="text-lg text-muted-foreground">Comprehensive analysis powered by advanced AI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Feasibility Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    AI-driven evaluation of project difficulty, novelty, and success potential
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Map className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Smart Roadmapping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Structured 3-phase breakdown: research, implementation, and evaluation
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-6">
                <CardHeader>
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle>Tech Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Curated technology stack suggestions based on your project domain
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">
              Built By Student, For Students.
            </p>
            <p>The Idea Evaluator. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
