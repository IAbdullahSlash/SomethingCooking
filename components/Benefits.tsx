import { CheckCircle, Clock, DollarSign, TrendingUp, Users, Zap } from "lucide-react"

const benefits = [
  {
    icon: Clock,
    title: "Save Months of Development Time",
    description: "Avoid building the wrong thing by validating your idea before you start coding."
  },
  {
    icon: DollarSign,
    title: "Reduce Financial Risk",
    description: "Make informed decisions about resource allocation and investment based on realistic assessments."
  },
  {
    icon: TrendingUp,
    title: "Increase Success Probability",
    description: "Address potential challenges early and focus on features that matter most to users."
  },
  {
    icon: Users,
    title: "Better Market Understanding",
    description: "Gain clarity on your target users and market demand before building your product."
  },
  {
    icon: Zap,
    title: "Faster Decision Making",
    description: "Get comprehensive analysis in minutes, not weeks of research and planning."
  },
  {
    icon: CheckCircle,
    title: "Professional Validation",
    description: "Back your decisions with AI-powered analysis that considers real-world constraints."
  }
]

export function Benefits() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Why Validate Your Ideas?
              </h2>
              <p className="text-xl text-muted-foreground">
                Most projects fail not because of bad execution, but because they solve 
                the wrong problem or underestimate the challenges involved.
              </p>
            </div>

            <div className="space-y-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-8 flex items-center justify-center">
              <div className="text-center space-y-6">
                <div className="text-6xl font-bold text-primary">90%</div>
                <div className="text-xl font-semibold">of startups fail</div>
                <div className="text-muted-foreground max-w-sm">
                  due to market problems, not technical issues. 
                  Validate your idea before you build.
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-500/20 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-500/20 rounded-full blur-xl" />
          </div>
        </div>
      </div>
    </section>
  )
}