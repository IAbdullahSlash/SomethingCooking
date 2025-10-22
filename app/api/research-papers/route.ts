import { NextRequest, NextResponse } from 'next/server'
import { fetchResearchPapers } from '@/lib/research-papers'

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json()

    if (!idea) {
      return NextResponse.json(
        { error: 'Project idea is required' },
        { status: 400 }
      )
    }

    const articles = await fetchResearchPapers(idea)

    return NextResponse.json({ 
      articles,
      source: 'api'
    })

  } catch (error) {
    console.error('Research papers API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch research papers' },
      { status: 500 }
    )
  }
}