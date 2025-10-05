import { ArrowRight, PenTool, Brain, BarChart3, Rocket } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const steps = [
  {
    step: 1,
    icon: PenTool,
    title: "Describe Your Idea",
    description: "Simply write a detailed description of your project concept. Include features, target users, and any technical requirements you have in mind.",
    color: "text-blue-500"
  },
  {
    step: 2,
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI evaluates your idea across 5 key dimensions: honest feedback, strengths, challenges, requirements, and market fit.",
    color: "text-purple-500"
  },
  {
    step: 3,
    icon: BarChart3,
    title: "Review Results",
    description: "Get comprehensive analysis including feasibility scores, timeline estimates, tech stack recommendations, and interactive development roadmap.",
    color: "text-green-500"
  },
  {
    step: 4,
    icon: Rocket,
    title: "Take Action",
    description: "Use the insights to refine your idea, plan development phases, and make informed decisions about moving forward with your project.",
    color: "text-orange-500"
  }
]

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get professional-grade project analysis in just 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="relative">
                <Card className="card-hover h-full">
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center mx-auto mb-4 ${step.color}`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">
                      Step {step.step}
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>

                {/* Arrow connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}