"use client"

import React, { createContext, useContext, useState } from 'react'

interface AIAssistantContextType {
  isOpen: boolean
  selectedText: string
  projectContext?: string
  openWithText: (text: string, context?: string) => void
  openAssistant: () => void
  closeAssistant: () => void
  setProjectContext: (context?: string) => void
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined)

export const useAIAssistant = () => {
  const context = useContext(AIAssistantContext)
  if (!context) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider')
  }
  return context
}

interface AIAssistantProviderProps {
  children: React.ReactNode
}

export const AIAssistantProvider: React.FC<AIAssistantProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedText, setSelectedText] = useState("")
  const [projectContext, setProjectContext] = useState<string | undefined>()

  const openWithText = (text: string, context?: string) => {
    setSelectedText(text)
    if (context) setProjectContext(context)
    setIsOpen(true)
  }

  const openAssistant = () => {
    setIsOpen(true)
  }

  const closeAssistant = () => {
    setIsOpen(false)
    // Don't clear selectedText immediately to allow for smooth transitions
    setTimeout(() => setSelectedText(""), 300)
  }

  const handleSetProjectContext = (context?: string) => {
    setProjectContext(context)
  }

  return (
    <AIAssistantContext.Provider
      value={{
        isOpen,
        selectedText,
        projectContext,
        openWithText,
        openAssistant,
        closeAssistant,
        setProjectContext: handleSetProjectContext,
      }}
    >
      {children}
    </AIAssistantContext.Provider>
  )
}