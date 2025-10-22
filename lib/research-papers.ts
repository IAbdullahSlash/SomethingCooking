// Shared utility for fetching research papers from Semantic Scholar and OpenAlex APIs

interface SemanticScholarPaper {
  paperId: string
  title: string
  abstract: string
  url: string
  venue: string
  year: number
  authors: Array<{ name: string }>
  citationCount: number
}

interface OpenAlexWork {
  id: string
  title: string
  abstract_inverted_index?: Record<string, number[]>
  primary_location?: {
    source?: {
      display_name: string
    }
  }
  publication_year: number
  authorships: Array<{
    author: {
      display_name: string
    }
  }>
  cited_by_count: number
  open_access?: {
    oa_url?: string
  }
}

export interface ExpertArticle {
  title: string
  url: string
  source: string
  summary: string
}

// Intelligent keyword extraction with improved domain understanding
function extractKeywords(idea: string): { primary: string[], secondary: string[], domain: string } {
  const commonWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 'in', 'is', 'it',
    'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with', 'would', 'could', 'should',
    'using', 'make', 'create', 'build', 'develop', 'design', 'implement', 'want', 'need', 'help',
    'system', 'platform', 'tool', 'software', 'application', 'project', 'idea', 'solution'
  ])

  // Enhanced domain-specific patterns with priority scoring
  const domainPatterns = {
    'education': {
      priority: [
        'edtech', 'e-learning', 'online learning', 'educational technology', 'learning management',
        'virtual classroom', 'distance learning', 'educational platform', 'learning app',
        'student portal', 'course management', 'educational software', 'academic platform',
        'digital learning', 'smart classroom', 'educational analytics', 'learning outcomes'
      ],
      secondary: [
        'education', 'learning', 'teaching', 'course', 'student', 'teacher', 'instructor',
        'school', 'university', 'college', 'academy', 'curriculum', 'assessment', 'grade',
        'quiz', 'exam', 'homework', 'assignment', 'lecture', 'tutorial', 'study', 'classroom',
        'pedagogy', 'academic', 'educational', 'training', 'skill development', 'knowledge'
      ],
      weight: 3
    },
    'health': {
      priority: [
        'healthtech', 'medical technology', 'healthcare platform', 'telemedicine', 'digital health',
        'health monitoring', 'medical app', 'healthcare analytics', 'patient management',
        'electronic health records', 'medical diagnosis', 'healthcare ai', 'clinical decision'
      ],
      secondary: [
        'health', 'healthcare', 'medical', 'patient', 'doctor', 'hospital', 'clinic',
        'diagnosis', 'treatment', 'therapy', 'medicine', 'pharmaceutical', 'wellness',
        'fitness', 'mental health', 'physical health', 'disease', 'symptom', 'cure'
      ],
      weight: 3
    },
    'ai_ml': {
      priority: [
        'artificial intelligence', 'machine learning', 'deep learning', 'neural network',
        'natural language processing', 'computer vision', 'ai model', 'ml algorithm',
        'predictive analytics', 'recommendation system', 'chatbot', 'voice assistant'
      ],
      secondary: [
        'ai', 'ml', 'algorithm', 'model', 'prediction', 'classification', 'clustering',
        'tensorflow', 'pytorch', 'scikit', 'keras', 'pandas', 'numpy', 'data mining'
      ],
      weight: 2
    },
    'finance': {
      priority: [
        'fintech', 'financial technology', 'digital banking', 'payment platform', 'blockchain finance',
        'cryptocurrency exchange', 'trading platform', 'investment app', 'financial analytics',
        'robo advisor', 'digital wallet', 'peer to peer lending', 'insurtech'
      ],
      secondary: [
        'finance', 'banking', 'payment', 'money', 'investment', 'trading', 'stock',
        'cryptocurrency', 'bitcoin', 'ethereum', 'wallet', 'transaction', 'loan', 'credit'
      ],
      weight: 3
    },
    'ecommerce': {
      priority: [
        'e-commerce platform', 'online marketplace', 'digital store', 'shopping app',
        'retail technology', 'inventory management', 'order management', 'customer analytics',
        'dropshipping platform', 'multi-vendor marketplace', 'social commerce'
      ],
      secondary: [
        'ecommerce', 'shopping', 'retail', 'store', 'marketplace', 'cart', 'checkout',
        'inventory', 'product', 'customer', 'order', 'shipping', 'payment', 'commerce'
      ],
      weight: 2
    },
    'mobile': {
      priority: [
        'mobile app', 'ios app', 'android app', 'react native', 'flutter app',
        'cross platform', 'mobile development', 'app store', 'mobile ui', 'responsive design'
      ],
      secondary: [
        'mobile', 'app', 'ios', 'android', 'swift', 'kotlin', 'react native', 'flutter',
        'xamarin', 'cordova', 'phonegap', 'mobile first', 'responsive'
      ],
      weight: 1
    },
    'web_dev': {
      priority: [
        'web application', 'web platform', 'full stack', 'frontend development', 'backend api',
        'progressive web app', 'single page application', 'web framework', 'rest api'
      ],
      secondary: [
        'web', 'website', 'frontend', 'backend', 'react', 'angular', 'vue', 'nodejs',
        'javascript', 'typescript', 'html', 'css', 'api', 'rest', 'graphql', 'spa', 'pwa'
      ],
      weight: 1
    },
    'iot': {
      priority: [
        'internet of things', 'iot platform', 'smart home', 'connected devices', 'sensor network',
        'edge computing', 'industrial iot', 'smart city', 'wearable technology'
      ],
      secondary: [
        'iot', 'sensor', 'device', 'embedded', 'hardware', 'arduino', 'raspberry pi',
        'smart', 'connected', 'wireless', 'bluetooth', 'wifi', 'zigbee'
      ],
      weight: 2
    },
    'blockchain': {
      priority: [
        'blockchain platform', 'smart contract', 'decentralized application', 'dapp',
        'cryptocurrency platform', 'defi protocol', 'nft marketplace', 'web3 application'
      ],
      secondary: [
        'blockchain', 'crypto', 'cryptocurrency', 'bitcoin', 'ethereum', 'smart contract',
        'defi', 'nft', 'web3', 'solidity', 'decentralized', 'distributed ledger'
      ],
      weight: 3
    },
    'security': {
      priority: [
        'cybersecurity platform', 'security analytics', 'threat detection', 'vulnerability assessment',
        'identity management', 'access control', 'security monitoring', 'fraud detection'
      ],
      secondary: [
        'security', 'cybersecurity', 'encryption', 'authentication', 'authorization',
        'privacy', 'vulnerability', 'threat', 'firewall', 'antivirus', 'malware'
      ],
      weight: 2
    }
  }

  const ideaLower = idea.toLowerCase()
  
  // Advanced domain detection with phrase matching and context scoring
  let detectedDomain = 'general'
  let highestScore = 0
  
  for (const [domain, patterns] of Object.entries(domainPatterns)) {
    let domainScore = 0
    
    // Check priority patterns (high-value phrases)
    for (const pattern of patterns.priority) {
      if (ideaLower.includes(pattern)) {
        domainScore += pattern.split(' ').length * 5 * patterns.weight // Higher weight for priority patterns
      }
    }
    
    // Check secondary patterns (supporting keywords)
    for (const pattern of patterns.secondary) {
      if (ideaLower.includes(pattern)) {
        domainScore += 1 * patterns.weight
      }
    }
    
    if (domainScore > highestScore) {
      highestScore = domainScore
      detectedDomain = domain
    }
  }

  // Extract meaningful keywords based on detected domain
  const words = ideaLower
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.has(word))

  const primaryKeywords: string[] = []
  const secondaryKeywords: string[] = []

  // Add domain-specific keywords that appear in the idea
  if (detectedDomain !== 'general' && domainPatterns[detectedDomain as keyof typeof domainPatterns]) {
    const domainData = domainPatterns[detectedDomain as keyof typeof domainPatterns]
    
    // Add priority patterns found in the idea
    for (const pattern of domainData.priority) {
      if (ideaLower.includes(pattern) && !primaryKeywords.includes(pattern)) {
        primaryKeywords.push(pattern)
      }
    }
    
    // Add secondary patterns found in the idea
    for (const pattern of domainData.secondary) {
      if (ideaLower.includes(pattern)) {
        if (primaryKeywords.length < 5 && !primaryKeywords.includes(pattern)) {
          primaryKeywords.push(pattern)
        } else if (!secondaryKeywords.includes(pattern)) {
          secondaryKeywords.push(pattern)
        }
      }
    }
  }

  // Add important words from the original idea that aren't domain-specific
  for (const word of words) {
    if (word.length > 3 && primaryKeywords.length < 5) {
      if (!primaryKeywords.some(keyword => keyword.includes(word)) && 
          !primaryKeywords.includes(word)) {
        primaryKeywords.push(word)
      }
    } else if (!secondaryKeywords.includes(word) && secondaryKeywords.length < 5) {
      secondaryKeywords.push(word)
    }
  }

  return {
    primary: primaryKeywords.slice(0, 5),
    secondary: secondaryKeywords.slice(0, 3),
    domain: detectedDomain
  }
}

// Convert OpenAlex abstract to readable text
function convertAbstractToText(abstractInvertedIndex: Record<string, number[]>): string {
  if (!abstractInvertedIndex) return ''
  
  const words: Array<{ word: string, positions: number[] }> = []
  
  for (const [word, positions] of Object.entries(abstractInvertedIndex)) {
    words.push({ word, positions })
  }
  
  // Sort by first position
  words.sort((a, b) => Math.min(...a.positions) - Math.min(...b.positions))
  
  return words.map(w => w.word).join(' ').substring(0, 200) + '...'
}

export async function fetchResearchPapers(idea: string): Promise<ExpertArticle[]> {
  const keywordData = extractKeywords(idea)
  const { primary, secondary, domain } = keywordData
  
  console.log('Searching for papers with semantic analysis:', {
    primaryKeywords: primary,
    secondaryKeywords: secondary,
    detectedDomain: domain,
    originalIdea: idea
  })

  const articles: ExpertArticle[] = []

  // Create multiple search queries for better results
  const searchQueries = [
    primary.join(' '), // Primary keywords
    `${primary.slice(0, 3).join(' ')} ${secondary.slice(0, 2).join(' ')}`, // Mixed keywords
    idea.replace(/[^\w\s]/g, ' ').trim() // Original idea cleaned
  ].filter(query => query.length > 3)

  // 1. Search Semantic Scholar API with multiple queries
  for (const searchQuery of searchQueries.slice(0, 2)) {
    try {
      const semanticUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(searchQuery)}&limit=4&fields=title,abstract,url,venue,year,authors,citationCount&sort=relevance`
      
      const semanticResponse = await fetch(semanticUrl, {
        headers: {
          'Accept': 'application/json',
        }
      })

      if (semanticResponse.ok) {
        const semanticData = await semanticResponse.json()
        
        if (semanticData.data && Array.isArray(semanticData.data)) {
          for (const paper of semanticData.data.slice(0, 2)) {
            // Skip if we already have this paper
            if (articles.some(article => article.title === paper.title)) continue
            
            const paperUrl = paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`
            
            articles.push({
              title: paper.title || 'Research Paper',
              url: paperUrl,
              source: `${paper.venue || 'Semantic Scholar'} (${paper.year || 'Recent'})`,
              summary: paper.abstract 
                ? (paper.abstract.length > 200 
                  ? paper.abstract.substring(0, 200) + '...' 
                  : paper.abstract)
                : `Research paper with ${paper.citationCount || 0} citations exploring ${primary.slice(0, 2).join(' and ')} methodologies and applications.`
            })
          }
        }
      }
    } catch (error) {
      console.error('Semantic Scholar API error:', error)
    }
    
    // Break if we have enough articles
    if (articles.length >= 6) break
  }

  // 2. Search OpenAlex API with semantic queries
  for (const searchQuery of searchQueries.slice(0, 2)) {
    try {
      const openAlexUrl = `https://api.openalex.org/works?search=${encodeURIComponent(searchQuery)}&per-page=4&sort=cited_by_count:desc&filter=publication_year:>2020`
      
      const openAlexResponse = await fetch(openAlexUrl, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'idea-evaluator-app (contact@example.com)'
        }
      })

      if (openAlexResponse.ok) {
        const openAlexData = await openAlexResponse.json()
        
        if (openAlexData.results && Array.isArray(openAlexData.results)) {
          for (const work of openAlexData.results.slice(0, 2)) {
            // Skip if we already have this paper
            if (articles.some(article => article.title === work.title)) continue
            
            const paperUrl = work.open_access?.oa_url || `https://openalex.org/${work.id.replace('https://openalex.org/', '')}`
            const abstract = work.abstract_inverted_index 
              ? convertAbstractToText(work.abstract_inverted_index)
              : `Research work with ${work.cited_by_count || 0} citations providing insights into ${primary.slice(0, 2).join(' and ')} applications.`

            articles.push({
              title: work.title || 'Academic Research',
              url: paperUrl,
              source: `${work.primary_location?.source?.display_name || 'OpenAlex'} (${work.publication_year || 'Recent'})`,
              summary: abstract.length > 200 ? abstract.substring(0, 200) + '...' : abstract
            })
          }
        }
      }
    } catch (error) {
      console.error('OpenAlex API error:', error)
    }
    
    // Break if we have enough articles
    if (articles.length >= 6) break
  }

  // 3. If still not enough articles, search with domain-specific terms
  if (articles.length < 4) {
    const domainSearchTerms = getDomainSearchTerms(domain, primary)
    
    for (const searchTerm of domainSearchTerms) {
      try {
        const semanticUrl = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(searchTerm)}&limit=3&fields=title,abstract,url,venue,year,citationCount&sort=relevance`
        
        const response = await fetch(semanticUrl)
        if (response.ok) {
          const data = await response.json()
          
          if (data.data && Array.isArray(data.data)) {
            for (const paper of data.data.slice(0, 2)) {
              if (articles.some(article => article.title === paper.title)) continue
              if (articles.length >= 6) break
              
              const paperUrl = paper.url || `https://www.semanticscholar.org/paper/${paper.paperId}`
              
              articles.push({
                title: paper.title || 'Research Paper',
                url: paperUrl,
                source: `${paper.venue || 'Semantic Scholar'} (${paper.year || 'Recent'})`,
                summary: paper.abstract 
                  ? (paper.abstract.length > 200 
                    ? paper.abstract.substring(0, 200) + '...' 
                    : paper.abstract)
                  : `Research exploring ${searchTerm} with focus on ${primary.slice(0, 2).join(' and ')} applications.`
              })
            }
          }
        }
      } catch (error) {
        console.error('Domain-specific search error:', error)
      }
      
      if (articles.length >= 4) break
    }
  }

  // 4. Final fallback - only if APIs completely fail
  if (articles.length === 0) {
    console.warn('All API searches failed, using minimal fallback')
    articles.push({
      title: `Research Opportunities in ${primary.slice(0, 2).join(' and ').toUpperCase()}`,
      url: "https://scholar.google.com/scholar?q=" + encodeURIComponent(primary.join(' ')),
      source: "Academic Search (2024)",
      summary: `Comprehensive research opportunities exist in ${primary.join(', ')} with significant potential for innovation and development in the ${domain.replace('_', ' ')} domain.`
    })
  }

  // Remove duplicates and limit to 4 articles
  const uniqueArticles = articles.filter((article, index, self) => 
    index === self.findIndex(a => a.title === article.title)
  )
  
  return uniqueArticles.slice(0, 4)
}

// Generate domain-specific search terms for better API results
function getDomainSearchTerms(domain: string, primaryKeywords: string[]): string[] {
  const domainTerms: Record<string, string[]> = {
    'education': [
      'educational technology research', 'e-learning effectiveness', 'digital learning platforms', 
      'learning management systems', 'educational software development', 'online education research',
      'computer-assisted learning', 'educational data mining', 'learning analytics', 'educational innovation'
    ],
    'health': [
      'healthcare technology', 'medical informatics research', 'digital health solutions', 
      'telemedicine systems', 'health monitoring technology', 'clinical decision support',
      'electronic health records', 'medical device innovation', 'healthcare analytics'
    ],
    'ai_ml': [
      'machine learning applications', 'artificial intelligence research', 'deep learning systems', 
      'neural network architectures', 'natural language processing', 'computer vision research',
      'predictive modeling', 'recommendation systems', 'intelligent systems'
    ],
    'finance': [
      'financial technology research', 'fintech innovation', 'digital banking systems', 
      'payment technology', 'blockchain finance', 'financial analytics', 'algorithmic trading',
      'risk management systems', 'financial inclusion technology'
    ],
    'ecommerce': [
      'e-commerce technology', 'digital marketplace research', 'online retail systems', 
      'customer experience optimization', 'supply chain technology', 'payment processing',
      'inventory management systems', 'social commerce platforms'
    ],
    'mobile': [
      'mobile application development', 'cross-platform development', 'mobile user experience', 
      'app performance optimization', 'mobile security research', 'responsive design',
      'mobile commerce', 'location-based services'
    ],
    'web_dev': [
      'web application development', 'frontend frameworks research', 'backend systems design', 
      'web performance optimization', 'progressive web apps', 'web accessibility',
      'single page applications', 'web security research'
    ],
    'iot': [
      'internet of things research', 'embedded systems development', 'sensor networks', 
      'edge computing applications', 'smart city technology', 'industrial IoT',
      'wearable technology research', 'connected device security'
    ],
    'blockchain': [
      'blockchain technology research', 'distributed ledger systems', 'smart contract development', 
      'decentralized applications', 'cryptocurrency research', 'consensus mechanisms',
      'blockchain security', 'distributed systems research'
    ],
    'security': [
      'cybersecurity research', 'information security systems', 'threat detection technology', 
      'security analytics', 'privacy-preserving technology', 'authentication systems',
      'vulnerability assessment', 'network security research'
    ],
    'general': [
      'software engineering research', 'system design patterns', 'technology innovation', 
      'digital transformation', 'human-computer interaction', 'software architecture',
      'user experience research', 'technology adoption'
    ]
  }

  const terms = domainTerms[domain] || domainTerms['general']
  
  // Create more targeted search combinations
  const combinedTerms = [
    ...terms.slice(0, 2), // Top domain-specific terms
    ...primaryKeywords.filter(k => k.length > 3).slice(0, 2).map(keyword => `${keyword} technology research`),
    ...primaryKeywords.filter(k => k.length > 3).slice(0, 1).map(keyword => `${keyword} system development`)
  ]

  return combinedTerms.slice(0, 4)
}