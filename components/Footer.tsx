import { Brain, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <a href="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl">The Idea Evaluator</span>
            </a>
            <p className="text-muted-foreground text-sm">
              AI-powered project analysis to help you build better products and make informed decisions.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="font-semibold">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/analysis" className="text-muted-foreground hover:text-foreground transition-colors">
                  Analysis Tool
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Examples
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
          <div className="mb-6 space-y-3">
            <p className="font-semibold">Made By:</p>
            <div className="flex justify-center items-center space-x-3">
              <span className="text-muted-foreground">Abdullah</span>
              <a 
                href="https://twitter.com/contributor1" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1DA1F2] transition-colors"
                aria-label="Abdullah Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/IAbdullahSlash" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Abdullah GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/abdullah-azmi-492120359/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                aria-label="Abdullah LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
            <div className="flex justify-center items-center space-x-3">
              <span className="text-muted-foreground">Darakhshan</span>
              <a 
                href="https://twitter.com/contributor2" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#1DA1F2] transition-colors"
                aria-label="Darakhshan Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://github.com/Darakhshan-dev" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Darakhshan GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/darakhshan-ifraque-6287a1320/" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-[#0A66C2] transition-colors"
                aria-label="Darakhshan LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  )
}