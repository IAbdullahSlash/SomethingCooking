import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AIAssistantProvider } from "@/contexts/AIAssistantContext"
import { AIAssistantManager } from "@/components/AIAssistantManager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Idea Evaluator - AI-Powered Project Analysis",
  description: "Transform your project ideas into actionable plans with AI-powered feasibility analysis, timeline estimation, and tech stack recommendations.",
  keywords: ["AI", "project analysis", "feasibility study", "tech stack", "project planning"],
  authors: [{ name: "The Idea Evaluator Team" }],
  openGraph: {
    title: "The Idea Evaluator - AI-Powered Project Analysis",
    description: "Transform your project ideas into actionable plans with AI-powered analysis.",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AIAssistantProvider>
            {children}
            <AIAssistantManager />
          </AIAssistantProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
