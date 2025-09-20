import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    const searchUrl = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=stars&order=desc&per_page=6`

    const response = await fetch(searchUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "Idea-Evaluator-App",
      },
    })

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const data = await response.json()

    const repositories = data.items.map((repo: any) => ({
      name: repo.name,
      description: repo.description || "No description available",
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language || "Not specified",
      url: repo.html_url,
      owner: repo.owner.login,
    }))

    return NextResponse.json({ repositories })
  } catch (error) {
    console.error("GitHub API error:", error)
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 })
  }
}
