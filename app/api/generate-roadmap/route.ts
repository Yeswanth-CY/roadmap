import { type NextRequest, NextResponse } from "next/server"

// Function to fetch Top YouTube Tutorials with level-specific queries
async function getTopYoutubeVideos(skill: string, level: string) {
  const searchUrl = "https://www.googleapis.com/youtube/v3/search"

  // Customize query based on skill level
  let query = `${skill} tutorial`
  if (level === "beginner") {
    query = `${skill} tutorial for beginners`
  } else if (level === "intermediate") {
    query = `${skill} intermediate tutorial`
  } else if (level === "advanced") {
    query = `${skill} advanced tutorial`
  }

  const params = new URLSearchParams({
    part: "snippet",
    q: query,
    type: "video",
    maxResults: "3",
    order: "relevance", // Using relevance instead of viewCount for better quality
    key: process.env.YOUTUBE_API_KEY || "",
  })

  try {
    const response = await fetch(`${searchUrl}?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      console.error("YouTube API error:", data)
      return []
    }

    // Extract video details
    return data.items.map((item: any) => ({
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
    }))
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return []
  }
}

// Function to fetch Best Learning Websites with level-specific queries
async function getTopLearningWebsites(skill: string, level: string) {
  const searchUrl = "https://www.googleapis.com/customsearch/v1"

  // Customize query based on skill level
  let query = `best website to learn ${skill}`
  if (level === "beginner") {
    query = `best website to learn ${skill} for beginners`
  } else if (level === "intermediate") {
    query = `best ${skill} intermediate tutorials`
  } else if (level === "advanced") {
    query = `advanced ${skill} tutorials`
  }

  const params = new URLSearchParams({
    q: query,
    key: process.env.GOOGLE_API_KEY || "",
    cx: process.env.SEARCH_ENGINE_ID || "",
    num: "3",
  })

  try {
    const response = await fetch(`${searchUrl}?${params.toString()}`)
    const data = await response.json()

    if (!response.ok) {
      console.error("Google Custom Search API error:", data)
      return []
    }

    // Extract website details
    return data.items.map((item: any) => ({
      url: item.link,
      title: item.title,
      description: item.snippet,
      displayLink: item.displayLink,
    }))
  } catch (error) {
    console.error("Error fetching learning websites:", error)
    return []
  }
}

// Enhanced practice platforms with level-specific recommendations
const practicePlatforms: Record<string, Record<string, any>> = {
  // Programming Languages
  Python: {
    beginner: {
      url: "https://www.hackerrank.com/domains/python",
      title: "HackerRank Python Basics",
      description: "Learn Python fundamentals through interactive challenges",
    },
    intermediate: {
      url: "https://www.codewars.com/collections/python-intermediate",
      title: "Codewars Python Intermediate Challenges",
      description: "Improve your Python skills with intermediate katas",
    },
    advanced: {
      url: "https://leetcode.com/problemset/all/?topicSlugs=python",
      title: "LeetCode Python Problems",
      description: "Solve complex algorithmic problems using Python",
    },
  },
  JavaScript: {
    beginner: {
      url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
      title: "freeCodeCamp JavaScript Basics",
      description: "Learn JavaScript fundamentals through interactive lessons",
    },
    intermediate: {
      url: "https://javascript30.com/",
      title: "JavaScript30 - 30 Day Challenge",
      description: "Build 30 things in 30 days with vanilla JavaScript",
    },
    advanced: {
      url: "https://github.com/trekhleb/javascript-algorithms",
      title: "JavaScript Algorithms and Data Structures",
      description: "Implement advanced algorithms and data structures in JavaScript",
    },
  },
  Java: {
    beginner: {
      url: "https://www.hackerrank.com/domains/java",
      title: "HackerRank Java Basics",
      description: "Learn Java fundamentals through interactive challenges",
    },
    intermediate: {
      url: "https://www.codegym.cc/",
      title: "CodeGym Java Course",
      description: "Practice-oriented Java programming course",
    },
    advanced: {
      url: "https://www.baeldung.com/java-tutorials",
      title: "Baeldung Java Guides",
      description: "In-depth tutorials on advanced Java topics",
    },
  },

  // Web Development
  React: {
    beginner: {
      url: "https://react-tutorial.app/",
      title: "React Tutorial App",
      description: "Interactive React tutorial for beginners",
    },
    intermediate: {
      url: "https://www.frontendmentor.io/challenges?technologies=React",
      title: "Frontend Mentor React Challenges",
      description: "Real-world React projects to improve your skills",
    },
    advanced: {
      url: "https://github.com/alan2207/bulletproof-react",
      title: "Bulletproof React",
      description: "A simple, scalable, and powerful architecture for building production-ready React applications",
    },
  },
  "Node.js": {
    beginner: {
      url: "https://nodeschool.io/",
      title: "NodeSchool Tutorials",
      description: "Self-guided workshops to learn Node.js",
    },
    intermediate: {
      url: "https://www.freecodecamp.org/learn/back-end-development-and-apis/",
      title: "freeCodeCamp Back End Development",
      description: "Build APIs and microservices with Node.js",
    },
    advanced: {
      url: "https://github.com/goldbergyoni/nodebestpractices",
      title: "Node.js Best Practices",
      description: "Summary of the most important Node.js security best practices",
    },
  },

  // Databases
  SQL: {
    beginner: {
      url: "https://www.hackerrank.com/domains/sql",
      title: "HackerRank SQL Challenges",
      description: "Practice SQL queries with increasing difficulty",
    },
    intermediate: {
      url: "https://mode.com/sql-tutorial/",
      title: "Mode SQL Tutorial",
      description: "Comprehensive SQL tutorial with real-world examples",
    },
    advanced: {
      url: "https://use-the-index-luke.com/",
      title: "Use The Index, Luke!",
      description: "A guide to database performance for developers",
    },
  },

  // Data Science
  "Machine Learning": {
    beginner: {
      url: "https://www.kaggle.com/learn/intro-to-machine-learning",
      title: "Kaggle Intro to Machine Learning",
      description: "Hands-on introduction to machine learning concepts",
    },
    intermediate: {
      url: "https://www.kaggle.com/competitions",
      title: "Kaggle Competitions",
      description: "Apply your skills to real-world machine learning problems",
    },
    advanced: {
      url: "https://paperswithcode.com/",
      title: "Papers With Code",
      description: "Implement cutting-edge machine learning research papers",
    },
  },
  "Data Analysis": {
    beginner: {
      url: "https://www.kaggle.com/learn/pandas",
      title: "Kaggle Pandas Tutorial",
      description: "Learn data manipulation with Pandas",
    },
    intermediate: {
      url: "https://www.datacamp.com/tracks/data-analyst-with-python",
      title: "DataCamp Data Analyst Track",
      description: "Comprehensive data analysis course with Python",
    },
    advanced: {
      url: "https://www.analyticsvidhya.com/blog/2018/08/comprehensive-guide-to-data-visualization-in-python/",
      title: "Advanced Data Visualization Guide",
      description: "Master complex data visualization techniques",
    },
  },
}

// Default practice platforms for skills not in our database
const defaultPracticePlatforms: Record<string, any> = {
  beginner: {
    url: "https://www.freecodecamp.org/",
    title: "freeCodeCamp",
    description: "Learn to code with free interactive challenges",
  },
  intermediate: {
    url: "https://exercism.org/",
    title: "Exercism",
    description: "Improve your coding skills with practice problems and mentorship",
  },
  advanced: {
    url: "https://www.codewars.com/",
    title: "Codewars",
    description: "Challenge yourself with coding katas",
  },
}

function getPracticeLinks(skill: string, level: string) {
  // Check if we have specific practice platforms for this skill
  if (practicePlatforms[skill] && practicePlatforms[skill][level]) {
    return practicePlatforms[skill][level]
  }

  // Return default practice platform for this level
  return defaultPracticePlatforms[level]
}

// Function to get learning path based on skill and level
function getLearningPath(skill: string, level: string, category?: string) {
  // Define learning paths for different skill levels
  const learningPaths: Record<string, any> = {
    // Default learning path structure
    default: {
      beginner: [
        "Learn the fundamentals and basic concepts",
        "Complete introductory tutorials and exercises",
        "Build simple projects to apply what you've learned",
        "Join communities and forums to ask questions",
      ],
      intermediate: [
        "Deepen your understanding of advanced concepts",
        "Work on more complex projects",
        "Learn best practices and optimization techniques",
        "Contribute to open source or collaborate with others",
      ],
      advanced: [
        "Master specialized topics and techniques",
        "Build production-ready applications",
        "Teach others and contribute to the community",
        "Stay updated with the latest developments",
      ],
    },

    // Programming languages learning path
    programming_languages: {
      beginner: [
        "Learn syntax and basic data structures",
        "Understand control flow (loops, conditionals)",
        "Practice with simple coding exercises",
        "Build small command-line applications",
      ],
      intermediate: [
        "Learn object-oriented programming principles",
        "Understand algorithms and data structures",
        "Work with libraries and frameworks",
        "Build more complex applications",
      ],
      advanced: [
        "Master advanced language features",
        "Optimize code for performance",
        "Understand memory management",
        "Contribute to language libraries or tools",
      ],
    },

    // Web development learning path
    web_development: {
      beginner: [
        "Learn HTML, CSS, and basic JavaScript",
        "Understand responsive design principles",
        "Build static websites",
        "Learn to use developer tools",
      ],
      intermediate: [
        "Master JavaScript and frameworks",
        "Learn backend development and databases",
        "Build full-stack web applications",
        "Implement authentication and API integration",
      ],
      advanced: [
        "Optimize for performance and accessibility",
        "Implement advanced state management",
        "Master serverless and microservices architecture",
        "Build scalable, production-ready applications",
      ],
    },

    // Data science learning path
    data_science: {
      beginner: [
        "Learn Python or R programming basics",
        "Understand data manipulation and cleaning",
        "Master basic statistics and visualization",
        "Complete guided data analysis projects",
      ],
      intermediate: [
        "Learn machine learning algorithms",
        "Understand feature engineering",
        "Work with larger datasets",
        "Participate in data science competitions",
      ],
      advanced: [
        "Master deep learning and neural networks",
        "Implement complex models from research papers",
        "Deploy models to production",
        "Contribute to cutting-edge research",
      ],
    },
  }

  // Get the appropriate learning path based on category
  const pathTemplate = category && learningPaths[category] ? learningPaths[category] : learningPaths.default

  // Return the learning path for the specified level
  return pathTemplate[level] || learningPaths.default[level]
}

// Function to get recommended books based on skill and level
function getRecommendedBooks(skill: string, level: string) {
  // This would ideally come from a database or API
  // For now, we'll use a static mapping
  const bookRecommendations: Record<string, Record<string, any[]>> = {
    Python: {
      beginner: [
        { title: "Python Crash Course", author: "Eric Matthes", url: "https://nostarch.com/pythoncrashcourse2e" },
        {
          title: "Automate the Boring Stuff with Python",
          author: "Al Sweigart",
          url: "https://automatetheboringstuff.com/",
        },
      ],
      intermediate: [
        {
          title: "Fluent Python",
          author: "Luciano Ramalho",
          url: "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
        },
        {
          title: "Python Cookbook",
          author: "David Beazley & Brian K. Jones",
          url: "https://www.oreilly.com/library/view/python-cookbook-3rd/9781449357337/",
        },
      ],
      advanced: [
        { title: "Effective Python", author: "Brett Slatkin", url: "https://effectivepython.com/" },
        {
          title: "High Performance Python",
          author: "Micha Gorelick & Ian Ozsvald",
          url: "https://www.oreilly.com/library/view/high-performance-python/9781492055013/",
        },
      ],
    },
    JavaScript: {
      beginner: [
        { title: "Eloquent JavaScript", author: "Marijn Haverbeke", url: "https://eloquentjavascript.net/" },
        {
          title: "JavaScript: The Good Parts",
          author: "Douglas Crockford",
          url: "https://www.oreilly.com/library/view/javascript-the-good/9780596517748/",
        },
      ],
      intermediate: [
        { title: "You Don't Know JS", author: "Kyle Simpson", url: "https://github.com/getify/You-Dont-Know-JS" },
        {
          title: "JavaScript Patterns",
          author: "Stoyan Stefanov",
          url: "https://www.oreilly.com/library/view/javascript-patterns/9781449399115/",
        },
      ],
      advanced: [
        {
          title: "Secrets of the JavaScript Ninja",
          author: "John Resig & Bear Bibeault",
          url: "https://www.manning.com/books/secrets-of-the-javascript-ninja-second-edition",
        },
        {
          title: "Functional-Light JavaScript",
          author: "Kyle Simpson",
          url: "https://github.com/getify/Functional-Light-JS",
        },
      ],
    },
    React: {
      beginner: [
        { title: "React Explained", author: "Zac Gordon", url: "https://www.ostraining.com/books/react/" },
        {
          title: "Learning React",
          author: "Alex Banks & Eve Porcello",
          url: "https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/",
        },
      ],
      intermediate: [
        {
          title: "React Design Patterns and Best Practices",
          author: "Michele Bertoli",
          url: "https://www.packtpub.com/product/react-design-patterns-and-best-practices-second-edition/9781800560444",
        },
        { title: "Pro React 16", author: "Adam Freeman", url: "https://www.apress.com/gp/book/9781484244500" },
      ],
      advanced: [
        {
          title: "React Cookbook",
          author: "David Griffiths & Dawn Griffiths",
          url: "https://www.oreilly.com/library/view/react-cookbook/9781492085836/",
        },
        {
          title: "Testing React Applications",
          author: "Jeff Valore",
          url: "https://www.manning.com/books/testing-react-applications",
        },
      ],
    },
    "Machine Learning": {
      beginner: [
        {
          title: "Hands-On Machine Learning with Scikit-Learn, Keras, and TensorFlow",
          author: "Aurélien Géron",
          url: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781492032632/",
        },
        {
          title: "Python Machine Learning",
          author: "Sebastian Raschka & Vahid Mirjalili",
          url: "https://www.packtpub.com/product/python-machine-learning-third-edition/9781789955750",
        },
      ],
      intermediate: [
        {
          title: "Pattern Recognition and Machine Learning",
          author: "Christopher Bishop",
          url: "https://www.microsoft.com/en-us/research/people/cmbishop/prml-book/",
        },
        {
          title: "Deep Learning",
          author: "Ian Goodfellow, Yoshua Bengio & Aaron Courville",
          url: "https://www.deeplearningbook.org/",
        },
      ],
      advanced: [
        {
          title: "Reinforcement Learning: An Introduction",
          author: "Richard S. Sutton & Andrew G. Barto",
          url: "http://incompleteideas.net/book/the-book-2nd.html",
        },
        {
          title: "Machine Learning: A Probabilistic Perspective",
          author: "Kevin P. Murphy",
          url: "https://mitpress.mit.edu/books/machine-learning-1",
        },
      ],
    },
  }

  // Return book recommendations for the specified skill and level
  if (bookRecommendations[skill] && bookRecommendations[skill][level]) {
    return bookRecommendations[skill][level]
  }

  // Return empty array if no specific recommendations
  return []
}

// Generate a roadmap based on quiz scores
async function generateScoreBasedRoadmap(skills: string[], skillLevels: Record<string, string>) {
  const roadmap: Record<string, any> = {}

  for (const skill of skills) {
    const level = skillLevels[skill] || "beginner"

    // Get YouTube resources
    const youtubeResources = await getTopYoutubeVideos(skill, level)

    // Get learning websites
    const learningWebsites = await getTopLearningWebsites(skill, level)

    // Get practice platform
    const practicePlatform = getPracticeLinks(skill, level)

    // Get recommended books
    const recommendedBooks = getRecommendedBooks(skill, level)

    // Get learning path
    const learningPath = getLearningPath(skill, level)

    // Add to roadmap
    roadmap[skill] = {
      "Skill Level": level,
      "Learning Path": learningPath,
      "Top YouTube Tutorials": youtubeResources,
      "Best Learning Websites": learningWebsites,
      "Practice Platform": practicePlatform,
      "Recommended Books": recommendedBooks,
    }
  }

  return roadmap
}

export async function POST(request: NextRequest) {
  try {
    const { skills, skillLevels } = await request.json()

    if (!skills || !skillLevels) {
      return NextResponse.json({ error: "Skills and skill levels are required" }, { status: 400 })
    }

    // Generate the roadmap
    const roadmap = await generateScoreBasedRoadmap(skills, skillLevels)
    return NextResponse.json(roadmap)
  } catch (error) {
    console.error("Error generating roadmap:", error)
    return NextResponse.json({ error: "Failed to generate roadmap" }, { status: 500 })
  }
}
