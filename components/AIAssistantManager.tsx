"use client"

import { AIAssistantChat } from '@/components/AIAssistantChat'
import { Button } from '@/components/ui/button'
import { MessageCircle } from 'lucide-react'
import { useAIAssistant } from '@/contexts/AIAssistantContext'

export function AIAssistantManager() {
  const { isOpen, openAssistant } = useAIAssistant()

  return (
    <>
      {/* Floating AI Assistant Button */}
      {!isOpen && (
        <Button
          onClick={openAssistant}
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-40 hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}

      {/* AI Assistant Chat */}
      <AIAssistantChat />
    </>
  )
}