'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

export default function TestPage() {
  const [idea, setIdea] = useState('AI tutor mobile application for senior indian school students')
  const [stage, setStage] = useState<'stage1' | 'stage2'>('stage1')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testStage = async () => {
    setLoading(true)
    try {
      console.log(`[TEST] Testing ${stage} with idea:`, idea)
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, stage })
      })
      
      console.log(`[TEST] Response status:`, response.status)
      
      const data = await response.json()
      console.log(`[TEST] ${stage} Response data:`, data)
      console.log(`[TEST] honestAiFeedback field:`, data.honestAiFeedback)
      
      setResult(data)
    } catch (error) {
      console.error('[TEST] Test failed:', error)
      setResult({ error: 'Test failed: ' + error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🧪 Stage Testing Interface</h1>
      
      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Project Idea:</label>
            <Textarea
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              placeholder="Enter your project idea..."
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Stage to Test:</label>
            <div className="flex gap-2">
              <Button
                variant={stage === 'stage1' ? 'default' : 'outline'}
                onClick={() => setStage('stage1')}
              >
                Stage 1 (Quick Snapshot)
              </Button>
              <Button
                variant={stage === 'stage2' ? 'default' : 'outline'}
                onClick={() => setStage('stage2')}
              >
                Stage 2 (Executive Summary)
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={testStage} 
            disabled={loading || !idea.trim()}
            className="w-full"
          >
            {loading ? 'Testing...' : `🚀 Test ${stage.toUpperCase()}`}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Stage: {stage}</Badge>
              {result.error ? (
                <Badge variant="destructive">Error</Badge>
              ) : (
                <Badge variant="secondary">Success</Badge>
              )}
              {result.honestAiFeedback && (
                <Badge variant="default">Has honestAiFeedback</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Key Field Check */}
            {stage === 'stage2' && (
              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🔍 Stage 2 Field Check:
                </h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>honestAiFeedback:</strong> {
                      result.honestAiFeedback ? 
                      `✅ Present (${result.honestAiFeedback.length} chars)` : 
                      '❌ Missing or empty'
                    }
                  </div>
                  <div>
                    <strong>keyStrengths:</strong> {
                      result.keyStrengths ? '✅ Present' : '❌ Missing'
                    }
                  </div>
                  <div>
                    <strong>potentialChallenges:</strong> {
                      result.potentialChallenges ? '✅ Present' : '❌ Missing'
                    }
                  </div>
                  <div>
                    <strong>techStack:</strong> {
                      result.techStack ? '✅ Present' : '❌ Missing'
                    }
                  </div>
                </div>
              </div>
            )}
            
            {/* Raw JSON */}
            <div className="bg-muted p-4 rounded-lg overflow-auto text-sm max-h-96">
              <pre>{JSON.stringify(result, null, 2)}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}