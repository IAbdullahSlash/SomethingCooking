"use client"

import { SelectionTooltip } from "@/components/SelectionTooltip"

export default function TestSelectionPage() {
  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-8">Text Selection Test Page</h1>
      
      <SelectionTooltip>
        <div className="space-y-6 max-w-4xl">
          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Test Section 1</h2>
            <p className="text-lg leading-relaxed">
              This is a test paragraph. Try selecting this text to see if the "Ask AI Assistant" 
              tooltip appears. The feature should work when you highlight any text in this section. 
              Make sure to select at least 4 characters for the tooltip to appear.
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Test Section 2</h2>
            <p className="text-lg leading-relaxed">
              Another test paragraph with different content. You can select any part of this text 
              to test the selection functionality. The tooltip should appear above the selected text 
              with a "Ask AI Assistant" button that has a sparkles icon.
            </p>
            <ul className="mt-4 space-y-2">
              <li>• Test bullet point one - select this text</li>
              <li>• Test bullet point two - or this text</li>
              <li>• Test bullet point three - or even this text</li>
            </ul>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
            <p className="text-sm text-muted-foreground">
              Open your browser's developer console (F12) to see debug logs when selecting text.
              You should see logs like "Selection detected:" followed by the selected text.
            </p>
          </div>
        </div>
      </SelectionTooltip>
    </div>
  )
}