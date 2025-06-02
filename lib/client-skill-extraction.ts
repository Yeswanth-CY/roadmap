// Client-side resume parser that extracts skills from actual resume content

// Industry-specific keywords that indicate skills
const SKILL_INDICATORS = [
  "proficient in",
  "skilled in",
  "experience with",
  "knowledge of",
  "expertise in",
  "familiar with",
  "worked with",
  "developed",
  "implemented",
  "built",
  "created",
  "designed",
  "managed",
  "administered",
  "configured",
  "skills:",
  "technical skills:",
  "technologies:",
  "tools:",
  "languages:",
  "frameworks:",
  "platforms:",
  "software:",
  "systems:",
  "environments:",
  "competencies:",
  "proficiencies:",
  "capabilities:",
  "qualifications:",
]

// Categorize skills
const SKILL_CATEGORIES: Record<string, string[]> = {
  programming_languages: [
    "javascript",
    "python",
    "java",
    "c++",
    "c#",
    "ruby",
    "php",
    "swift",
    "kotlin",
    "go",
    "typescript",
    "rust",
    "scala",
    "perl",
    "r",
    "matlab",
    "bash",
    "shell",
    "powershell",
    "dart",
    "groovy",
    "lua",
    "haskell",
    "clojure",
    "erlang",
    "fortran",
    "cobol",
    "assembly",
    "objective-c",
    "vba",
    "julia",
    "lisp",
    "prolog",
    "scheme",
    "f#",
    "abap",
    "apex",
    "crystal",
    "elixir",
    "elm",
    "ocaml",
    "racket",
    "solidity",
    "sql",
    "plsql",
    "tsql",
    "verilog",
    "vhdl",
  ],
  web_development: [
    "html",
    "css",
    "sass",
    "less",
    "bootstrap",
    "tailwind",
    "material-ui",
    "react",
    "angular",
    "vue",
    "svelte",
    "jquery",
    "next.js",
    "gatsby",
    "nuxt.js",
    "express",
    "node.js",
    "deno",
    "django",
    "flask",
    "fastapi",
    "spring",
    "asp.net",
    "laravel",
    "symfony",
    "ruby on rails",
    "graphql",
    "rest api",
    "soap",
    "webpack",
    "babel",
    "vite",
    "parcel",
    "pwa",
    "web components",
    "webrtc",
    "websocket",
    "web assembly",
    "wasm",
    "service workers",
    "progressive web apps",
    "responsive design",
    "web accessibility",
    "wcag",
    "aria",
    "seo",
    "semantic html",
    "css grid",
    "flexbox",
    "css animations",
    "web performance",
    "web security",
    "oauth",
    "jwt",
    "cors",
  ],
  databases: [
    "sql",
    "mysql",
    "postgresql",
    "mongodb",
    "sqlite",
    "oracle",
    "sql server",
    "mariadb",
    "dynamodb",
    "cassandra",
    "redis",
    "neo4j",
    "couchdb",
    "firebase",
    "supabase",
    "elasticsearch",
    "nosql",
    "orm",
    "sequelize",
    "mongoose",
    "prisma",
    "typeorm",
    "database design",
    "er diagrams",
    "database normalization",
    "acid",
    "transactions",
    "indexing",
    "query optimization",
    "data modeling",
    "etl",
    "data warehousing",
    "olap",
    "oltp",
    "database administration",
    "dba",
    "database migration",
    "database replication",
    "database sharding",
    "database backup",
    "database recovery",
    "database security",
  ],
  devops: [
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "terraform",
    "ansible",
    "jenkins",
    "gitlab ci",
    "github actions",
    "circleci",
    "travis ci",
    "nginx",
    "apache",
    "linux",
    "unix",
    "windows server",
    "ci/cd",
    "devops",
    "sre",
    "infrastructure as code",
    "monitoring",
    "logging",
    "prometheus",
    "grafana",
    "elk stack",
    "logstash",
    "kibana",
    "cloud computing",
    "serverless",
    "lambda",
    "microservices",
    "service mesh",
    "istio",
    "envoy",
    "load balancing",
    "auto scaling",
    "high availability",
    "fault tolerance",
    "disaster recovery",
    "configuration management",
    "puppet",
    "chef",
    "salt",
    "vagrant",
    "virtualization",
    "vmware",
    "hypervisor",
    "containers",
    "orchestration",
    "helm",
    "openshift",
    "rancher",
    "cloud native",
  ],
  data_science: [
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "ai",
    "ml",
    "dl",
    "data science",
    "data analysis",
    "data visualization",
    "data mining",
    "data engineering",
    "big data",
    "statistics",
    "pandas",
    "numpy",
    "scipy",
    "matplotlib",
    "seaborn",
    "scikit-learn",
    "tensorflow",
    "pytorch",
    "keras",
    "opencv",
    "nlp",
    "natural language processing",
    "computer vision",
    "neural networks",
    "regression",
    "classification",
    "clustering",
    "reinforcement learning",
    "time series",
    "forecasting",
    "feature engineering",
    "dimensionality reduction",
    "pca",
    "t-sne",
    "data preprocessing",
    "data cleaning",
    "data transformation",
    "data augmentation",
    "transfer learning",
    "ensemble methods",
    "random forest",
    "gradient boosting",
    "xgboost",
    "lightgbm",
    "catboost",
    "decision trees",
    "svm",
    "support vector machines",
    "knn",
    "k-nearest neighbors",
    "naive bayes",
    "logistic regression",
    "linear regression",
    "a/b testing",
    "hypothesis testing",
    "bayesian statistics",
    "markov chains",
    "monte carlo",
    "recommender systems",
    "collaborative filtering",
    "content-based filtering",
    "anomaly detection",
    "sentiment analysis",
    "topic modeling",
    "word embeddings",
    "word2vec",
    "glove",
    "bert",
    "transformers",
    "gpt",
    "llm",
    "large language models",
    "generative ai",
    "gan",
    "generative adversarial networks",
    "autoencoder",
    "vae",
    "variational autoencoder",
    "cnn",
    "convolutional neural networks",
    "rnn",
    "recurrent neural networks",
    "lstm",
    "long short-term memory",
    "gru",
    "gated recurrent units",
    "attention mechanism",
    "transformer architecture",
  ],
  mobile_development: [
    "android",
    "ios",
    "swift",
    "kotlin",
    "react native",
    "flutter",
    "xamarin",
    "ionic",
    "cordova",
    "objective-c",
    "mobile development",
    "app development",
    "pwa",
    "progressive web apps",
    "mobile ui",
    "mobile ux",
    "responsive design",
    "mobile testing",
    "app store optimization",
    "aso",
    "mobile analytics",
    "push notifications",
    "geolocation",
    "offline storage",
    "mobile security",
    "mobile authentication",
    "biometrics",
    "face id",
    "touch id",
    "mobile payments",
    "in-app purchases",
    "mobile ads",
    "admob",
    "mobile backend",
    "firebase",
    "realm",
    "coredata",
    "room database",
    "jetpack compose",
    "swiftui",
    "material design",
    "human interface guidelines",
    "hig",
    "app lifecycle",
    "mobile performance",
    "mobile debugging",
    "mobile testing",
    "ui testing",
    "integration testing",
    "mobile ci/cd",
  ],
  tools: [
    "git",
    "github",
    "gitlab",
    "bitbucket",
    "jira",
    "confluence",
    "trello",
    "slack",
    "notion",
    "figma",
    "sketch",
    "adobe xd",
    "photoshop",
    "illustrator",
    "visual studio",
    "vs code",
    "intellij",
    "pycharm",
    "eclipse",
    "postman",
    "insomnia",
    "swagger",
    "openapi",
    "terminal",
    "command line",
    "bash",
    "powershell",
    "zsh",
    "vim",
    "emacs",
    "sublime text",
    "atom",
    "jupyter",
    "jupyter notebook",
    "jupyter lab",
    "colab",
    "google colab",
    "anaconda",
    "conda",
    "virtualenv",
    "venv",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "heroku",
    "netlify",
    "vercel",
    "digital ocean",
    "linode",
    "vultr",
    "aws s3",
    "aws ec2",
    "aws lambda",
    "aws rds",
    "aws dynamodb",
    "aws sqs",
    "aws sns",
    "azure functions",
    "azure storage",
    "azure cosmos db",
    "gcp cloud functions",
    "gcp cloud storage",
    "gcp bigquery",
    "gcp cloud run",
    "gcp cloud sql",
    "firebase",
    "firebase auth",
    "firebase firestore",
    "firebase realtime database",
    "firebase storage",
    "firebase hosting",
    "firebase functions",
    "supabase",
    "auth0",
    "okta",
    "oauth",
    "openid connect",
    "saml",
    "ldap",
    "active directory",
    "sso",
    "single sign-on",
  ],
  soft_skills: [
    "communication",
    "teamwork",
    "leadership",
    "problem solving",
    "critical thinking",
    "time management",
    "project management",
    "agile",
    "scrum",
    "kanban",
    "waterfall",
    "lean",
    "six sigma",
    "presentation",
    "public speaking",
    "negotiation",
    "conflict resolution",
    "decision making",
    "adaptability",
    "flexibility",
    "creativity",
    "innovation",
    "emotional intelligence",
    "empathy",
    "interpersonal skills",
    "customer service",
    "client management",
    "stakeholder management",
    "mentoring",
    "coaching",
    "training",
    "onboarding",
    "documentation",
    "technical writing",
    "research",
    "analysis",
    "strategic thinking",
    "business acumen",
    "entrepreneurship",
    "self-motivation",
    "initiative",
    "attention to detail",
    "organization",
    "multitasking",
    "prioritization",
    "stress management",
    "resilience",
    "work ethic",
    "professionalism",
    "ethics",
    "integrity",
    "accountability",
    "responsibility",
    "reliability",
    "punctuality",
    "cultural awareness",
    "diversity",
    "inclusion",
    "remote work",
    "virtual collaboration",
    "cross-functional collaboration",
    "interdisciplinary collaboration",
    "continuous learning",
    "growth mindset",
  ],
  cybersecurity: [
    "cybersecurity",
    "information security",
    "network security",
    "application security",
    "cloud security",
    "security architecture",
    "security engineering",
    "security operations",
    "security assessment",
    "penetration testing",
    "vulnerability assessment",
    "threat modeling",
    "risk assessment",
    "security compliance",
    "security governance",
    "security policies",
    "security standards",
    "security frameworks",
    "iso 27001",
    "nist",
    "pci dss",
    "hipaa",
    "gdpr",
    "ccpa",
    "soc 2",
    "security auditing",
    "security monitoring",
    "siem",
    "security information and event management",
    "intrusion detection",
    "intrusion prevention",
    "ids",
    "ips",
    "firewall",
    "waf",
    "web application firewall",
    "endpoint security",
    "antivirus",
    "anti-malware",
    "encryption",
    "cryptography",
    "hashing",
    "digital signatures",
    "pki",
    "public key infrastructure",
    "vpn",
    "virtual private network",
    "ssl",
    "tls",
    "secure sockets layer",
    "transport layer security",
    "authentication",
    "authorization",
    "access control",
    "identity management",
    "iam",
    "single sign-on",
    "sso",
    "multi-factor authentication",
    "mfa",
    "two-factor authentication",
    "2fa",
    "biometrics",
    "security awareness",
    "security training",
    "incident response",
    "digital forensics",
    "malware analysis",
    "reverse engineering",
    "ethical hacking",
    "red team",
    "blue team",
    "purple team",
    "osint",
    "open source intelligence",
    "threat intelligence",
    "security operations center",
    "soc",
    "security architecture",
    "zero trust",
    "devsecops",
  ],
}

// Flatten the skills list for easier matching
const ALL_SKILLS: string[] = []
for (const category in SKILL_CATEGORIES) {
  ALL_SKILLS.push(...SKILL_CATEGORIES[category])
}

// Simple text extraction from a plain text file
async function extractTextFromTXT(file: File): Promise<string> {
  try {
    return await file.text()
  } catch (error) {
    console.error("Error extracting text from TXT:", error)
    return ""
  }
}

// Extract skills from text using simple pattern matching
function extractSkillsFromText(text: string): {
  skills: string[]
  categorized_skills: Record<string, string[]>
} {
  // Convert text to lowercase for case-insensitive matching
  const lowerText = text.toLowerCase()

  // Split text into sentences and words
  const sentences = lowerText.split(/[.!?]+/)
  const words = lowerText.split(/\s+/)

  // Find potential skill sections
  const skillSections: string[] = []

  // Look for sections that might contain skills
  for (const sentence of sentences) {
    if (SKILL_INDICATORS.some((indicator) => sentence.includes(indicator))) {
      skillSections.push(sentence)
    }
  }

  // If no skill sections found, use the entire text
  const textToSearch = skillSections.length > 0 ? skillSections.join(" ") : lowerText

  // Find skills in the text
  const foundSkills = new Set<string>()

  // First pass: Look for exact matches
  for (const skill of ALL_SKILLS) {
    // Use word boundary to match whole words
    const regex = new RegExp(`\\b${skill}\\b`, "i")
    if (regex.test(textToSearch)) {
      foundSkills.add(skill)
    }
  }

  // Second pass: Look for skills in n-grams (for multi-word skills)
  const ngrams: string[] = []

  // Generate bigrams and trigrams
  for (let i = 0; i < words.length - 1; i++) {
    ngrams.push(`${words[i]} ${words[i + 1]}`)
    if (i < words.length - 2) {
      ngrams.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
    }
  }

  // Check ngrams against skills
  for (const ngram of ngrams) {
    if (ALL_SKILLS.includes(ngram)) {
      foundSkills.add(ngram)
    }
  }

  // Format skills with proper capitalization
  const formattedSkills = Array.from(foundSkills).map((skill) =>
    skill
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
  )

  // Categorize skills
  const categorizedSkills: Record<string, string[]> = {}

  for (const skill of foundSkills) {
    for (const [category, skills] of Object.entries(SKILL_CATEGORIES)) {
      if (skills.includes(skill)) {
        if (!categorizedSkills[category]) {
          categorizedSkills[category] = []
        }

        // Format the skill with proper capitalization
        const formattedSkill = skill
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        categorizedSkills[category].push(formattedSkill)
        break
      }
    }
  }

  return {
    skills: formattedSkills,
    categorized_skills: categorizedSkills,
  }
}

// Extract skills from a resume file
export async function extractSkillsFromResume(file: File): Promise<{
  success: boolean
  skills: string[]
  categorized_skills: Record<string, string[]>
  error?: string
}> {
  try {
    let text = ""

    // For simplicity, we'll only support text files in this version
    if (file.type === "text/plain") {
      text = await extractTextFromTXT(file)
    } else {
      // For unsupported types, return an error
      return {
        success: false,
        skills: [],
        categorized_skills: {},
        error: `For this demo, only text (.txt) files are supported. You provided: ${file.type}`,
      }
    }

    // Check if we got any text
    if (!text || text.trim().length < 50) {
      console.warn("Extracted text is too short or empty:", text)
      return {
        success: false,
        skills: [],
        categorized_skills: {},
        error: "Could not extract sufficient text from the resume",
      }
    }

    // Extract skills from the text
    const { skills, categorized_skills } = extractSkillsFromText(text)

    // If no skills found, return an error
    if (skills.length === 0) {
      return {
        success: false,
        skills: [],
        categorized_skills: {},
        error: "No skills found in the resume",
      }
    }

    return {
      success: true,
      skills,
      categorized_skills,
    }
  } catch (error) {
    console.error("Error in client-side skill extraction:", error)
    return {
      success: false,
      skills: [],
      categorized_skills: {},
      error: "Failed to extract skills from resume",
    }
  }
}

// Generate a roadmap based on skills and levels
export async function generateRoadmap(skills: string[], skillLevels: Record<string, string>): Promise<any> {
  // Create a roadmap response
  const roadmap: Record<string, any> = {}

  for (const skill of skills) {
    const level = skillLevels[skill] || "beginner"

    roadmap[skill] = {
      "Skill Level": level,
      "Learning Path": getLearningPath(skill, level),
      "Top YouTube Tutorials": getYouTubeResources(skill, level),
      "Best Learning Websites": getLearningWebsites(skill, level),
      "Practice Platform": getPracticePlatform(skill, level),
      "Recommended Books": getRecommendedBooks(skill, level),
    }
  }

  return roadmap
}

// Helper functions for generating roadmap content
function getLearningPath(skill: string, level: string): string[] {
  const paths = {
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
  }

  return paths[level as keyof typeof paths] || paths.beginner
}

function getYouTubeResources(skill: string, level: string): any[] {
  return [
    {
      title: `Learn ${skill} - Complete ${level.charAt(0).toUpperCase() + level.slice(1)} Tutorial`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+${level}+tutorial`,
      description: `Comprehensive ${skill} tutorial for ${level} learners`,
      platform: "YouTube",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      channelTitle: "Programming Tutorials",
      publishedAt: "2023-01-15",
    },
    {
      title: `${skill} Projects for ${level.charAt(0).toUpperCase() + level.slice(1)}s`,
      url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill)}+${level}+projects`,
      description: `Build real-world ${skill} projects`,
      platform: "YouTube",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg",
      channelTitle: "Coding Projects",
      publishedAt: "2023-02-20",
    },
  ]
}

function getLearningWebsites(skill: string, level: string): any[] {
  return [
    {
      title: `${skill} Documentation and Tutorials`,
      url: `https://www.google.com/search?q=${encodeURIComponent(skill)}+documentation+tutorial`,
      description: `Official documentation and tutorials for ${skill}`,
      platform: "Various",
      displayLink: "docs.example.com",
    },
    {
      title: `${skill} Courses for ${level.charAt(0).toUpperCase() + level.slice(1)}s`,
      url: `https://www.udemy.com/courses/search/?q=${encodeURIComponent(skill)}&instructional_level=${level}`,
      description: `Online courses to master ${skill} at ${level} level`,
      platform: "Udemy",
      displayLink: "udemy.com",
    },
  ]
}

function getPracticePlatform(skill: string, level: string): any {
  const platforms = {
    beginner: {
      title: `${skill} Practice for Beginners`,
      url: "https://www.freecodecamp.org/",
      description: "Interactive coding challenges for beginners",
      platform: "freeCodeCamp",
    },
    intermediate: {
      title: `${skill} Practice for Intermediate Developers`,
      url: "https://exercism.org/",
      description: "Skill-focused programming challenges with mentorship",
      platform: "Exercism",
    },
    advanced: {
      title: `${skill} Practice for Advanced Developers`,
      url: "https://www.codewars.com/",
      description: "Complex coding challenges to test your skills",
      platform: "Codewars",
    },
  }

  return platforms[level as keyof typeof platforms] || platforms.beginner
}

function getRecommendedBooks(skill: string, level: string): any[] {
  return [
    {
      title: `${skill}: The Definitive Guide`,
      author: "Jane Smith",
      url: `https://www.amazon.com/s?k=${encodeURIComponent(skill)}+programming+book`,
    },
    {
      title: `Advanced ${skill} Programming`,
      author: "John Doe",
      url: `https://www.amazon.com/s?k=advanced+${encodeURIComponent(skill)}+programming`,
    },
  ]
}
