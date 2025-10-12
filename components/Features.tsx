import { 
  Brain, 
  Clock, 
  Code, 
  Target, 
  Users, 
  TrendingUp,
  Shield,
  Zap,
  CheckCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SelectionTooltip } from "@/components/SelectionTooltip"

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced AI evaluates your idea across multiple dimensions including technical feasibility, market potential, and risk assessment.",
    color: "text-purple-500"
  },
  {
    icon: Clock,
    title: "Realistic Timeline Estimation",
    description: "Get conservative, buffer-included timelines that account for learning curves, testing, and real-world development challenges.",
    color: "text-blue-500"
  },
  {
    icon: Code,
    title: "Smart Tech Stack Recommendations",
    description: "Receive curated technology suggestions based on your project complexity, scalability needs, and development experience.",
    color: "text-green-500"
  },
  {
    icon: Target,
    title: "Honest Reality Check",
    description: "Brutally honest feedback on market competition, uniqueness, and whether your idea solves a real problem worth solving.",
    color: "text-red-500"
  },
  {
    icon: Users,
    title: "Market Fit Analysis",
    description: "Understand your target users, validate market demand, and get strategies for user validation and adoption.",
    color: "text-orange-500"
  },
  {
    icon: TrendingUp,
    title: "Success Probability Scoring",
    description: "Data-driven success probability based on market saturation, technical complexity, and execution challenges.",
    color: "text-pink-500"
  },
  {
    icon: Shield,
    title: "Risk Assessment",
    description: "Identify technical, usability, and market risks before you invest time and resources in development.",
    color: "text-indigo-500"
  },
  {
    icon: Zap,
    title: "Interactive Roadmap",
    description: "Get a detailed, phase-by-phase development roadmap with trackable tasks and progress indicators.",
    color: "text-yellow-500"
  },
  {
    icon: CheckCircle,
    title: "Actionable Recommendations",
    description: "Receive specific, actionable advice on risk mitigation, feature prioritization, and success optimization.",
    color: "text-cyan-500"
  }
]

export function Features() {
  return (
    <SelectionTooltip>
      <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Comprehensive Project Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI doesn't just tell you if your idea is good – it provides deep insights 
            into every aspect of your project's potential success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card 
                key={index} 
                className="card-hover border-0 bg-background/50 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center mb-4 ${feature.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
    </SelectionTooltip>
  )
}