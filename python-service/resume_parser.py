import re
import nltk
import spacy
import os
import json
import logging
from nltk.corpus import stopwords
from pdfminer.high_level import extract_text as extract_text_pdf
import docx2txt
from io import BytesIO
import textract
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
import string

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Download necessary NLTK data
try:
    nltk.download('punkt', quiet=True)
    nltk.download('stopwords', quiet=True)
    nltk.download('averaged_perceptron_tagger', quiet=True)
    nltk.download('maxent_ne_chunker', quiet=True)
    nltk.download('words', quiet=True)
except Exception as e:
    logger.warning(f"NLTK download error: {e}")

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except:
    # If model not found, download it
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Define a comprehensive list of technical skills
TECHNICAL_SKILLS = {
    "programming_languages": [
        "python", "java", "javascript", "typescript", "c++", "c#", "ruby", "php", "swift", 
        "kotlin", "go", "rust", "scala", "perl", "r", "matlab", "bash", "shell", "powershell",
        "dart", "groovy", "lua", "haskell", "clojure", "erlang", "fortran", "cobol", "assembly",
        "objective-c", "vba", "julia", "lisp", "prolog", "scheme", "f#", "abap", "apex", "crystal",
        "elixir", "elm", "ocaml", "racket", "solidity", "sql", "plsql", "tsql", "verilog", "vhdl"
    ],
    "web_development": [
        "html", "css", "sass", "less", "bootstrap", "tailwind", "material-ui", "react", "angular", 
        "vue", "svelte", "jquery", "next.js", "gatsby", "nuxt.js", "express", "node.js", "deno",
        "django", "flask", "fastapi", "spring", "asp.net", "laravel", "symfony", "ruby on rails",
        "graphql", "rest api", "soap", "webpack", "babel", "vite", "parcel", "pwa", "web components",
        "webrtc", "websocket", "web assembly", "wasm", "service workers", "progressive web apps",
        "responsive design", "web accessibility", "wcag", "aria", "seo", "semantic html", "css grid",
        "flexbox", "css animations", "web performance", "web security", "oauth", "jwt", "cors"
    ],
    "databases": [
        "sql", "mysql", "postgresql", "mongodb", "sqlite", "oracle", "sql server", "mariadb",
        "dynamodb", "cassandra", "redis", "neo4j", "couchdb", "firebase", "supabase", "elasticsearch",
        "nosql", "orm", "sequelize", "mongoose", "prisma", "typeorm", "database design", "er diagrams",
        "database normalization", "acid", "transactions", "indexing", "query optimization", "data modeling",
        "etl", "data warehousing", "olap", "oltp", "database administration", "dba", "database migration",
        "database replication", "database sharding", "database backup", "database recovery", "database security"
    ],
    "devops": [
        "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ansible", "jenkins", "gitlab ci",
        "github actions", "circleci", "travis ci", "nginx", "apache", "linux", "unix", "windows server",
        "ci/cd", "devops", "sre", "infrastructure as code", "monitoring", "logging", "prometheus", "grafana",
        "elk stack", "logstash", "kibana", "cloud computing", "serverless", "lambda", "microservices",
        "service mesh", "istio", "envoy", "load balancing", "auto scaling", "high availability", "fault tolerance",
        "disaster recovery", "configuration management", "puppet", "chef", "salt", "vagrant", "virtualization",
        "vmware", "hypervisor", "containers", "orchestration", "helm", "openshift", "rancher", "cloud native"
    ],
    "data_science": [
        "machine learning", "deep learning", "artificial intelligence", "ai", "ml", "dl", "data science",
        "data analysis", "data visualization", "data mining", "data engineering", "big data", "statistics",
        "pandas", "numpy", "scipy", "matplotlib", "seaborn", "scikit-learn", "tensorflow", "pytorch", "keras",
        "opencv", "nlp", "natural language processing", "computer vision", "neural networks", "regression",
        "classification", "clustering", "reinforcement learning", "time series", "forecasting", "feature engineering",
        "dimensionality reduction", "pca", "t-sne", "data preprocessing", "data cleaning", "data transformation",
        "data augmentation", "transfer learning", "ensemble methods", "random forest", "gradient boosting",
        "xgboost", "lightgbm", "catboost", "decision trees", "svm", "support vector machines", "knn", "k-nearest neighbors",
        "naive bayes", "logistic regression", "linear regression", "a/b testing", "hypothesis testing", "bayesian statistics",
        "markov chains", "monte carlo", "recommender systems", "collaborative filtering", "content-based filtering",
        "anomaly detection", "sentiment analysis", "topic modeling", "word embeddings", "word2vec", "glove", "bert",
        "transformers", "gpt", "llm", "large language models", "generative ai", "gan", "generative adversarial networks",
        "autoencoder", "vae", "variational autoencoder", "cnn", "convolutional neural networks", "rnn", "recurrent neural networks",
        "lstm", "long short-term memory", "gru", "gated recurrent units", "attention mechanism", "transformer architecture"
    ],
    "mobile_development": [
        "android", "ios", "swift", "kotlin", "react native", "flutter", "xamarin", "ionic", "cordova",
        "objective-c", "mobile development", "app development", "pwa", "progressive web apps", "mobile ui",
        "mobile ux", "responsive design", "mobile testing", "app store optimization", "aso", "mobile analytics",
        "push notifications", "geolocation", "offline storage", "mobile security", "mobile authentication",
        "biometrics", "face id", "touch id", "mobile payments", "in-app purchases", "mobile ads", "admob",
        "mobile backend", "firebase", "realm", "coredata", "room database", "jetpack compose", "swiftui",
        "material design", "human interface guidelines", "hig", "app lifecycle", "mobile performance",
        "mobile debugging", "mobile testing", "ui testing", "integration testing", "mobile ci/cd"
    ],
    "tools": [
        "git", "github", "gitlab", "bitbucket", "jira", "confluence", "trello", "slack", "notion",
        "figma", "sketch", "adobe xd", "photoshop", "illustrator", "visual studio", "vs code",
        "intellij", "pycharm", "eclipse", "postman", "insomnia", "swagger", "openapi", "terminal",
        "command line", "bash", "powershell", "zsh", "vim", "emacs", "sublime text", "atom", "jupyter",
        "jupyter notebook", "jupyter lab", "colab", "google colab", "anaconda", "conda", "virtualenv",
        "venv", "docker", "kubernetes", "aws", "azure", "gcp", "heroku", "netlify", "vercel", "digital ocean",
        "linode", "vultr", "aws s3", "aws ec2", "aws lambda", "aws rds", "aws dynamodb", "aws sqs", "aws sns",
        "azure functions", "azure storage", "azure cosmos db", "gcp cloud functions", "gcp cloud storage",
        "gcp bigquery", "gcp cloud run", "gcp cloud sql", "firebase", "firebase auth", "firebase firestore",
        "firebase realtime database", "firebase storage", "firebase hosting", "firebase functions", "supabase",
        "auth0", "okta", "oauth", "openid connect", "saml", "ldap", "active directory", "sso", "single sign-on"
    ],
    "soft_skills": [
        "communication", "teamwork", "leadership", "problem solving", "critical thinking",
        "time management", "project management", "agile", "scrum", "kanban", "waterfall", "lean",
        "six sigma", "presentation", "public speaking", "negotiation", "conflict resolution",
        "decision making", "adaptability", "flexibility", "creativity", "innovation", "emotional intelligence",
        "empathy", "interpersonal skills", "customer service", "client management", "stakeholder management",
        "mentoring", "coaching", "training", "onboarding", "documentation", "technical writing", "research",
        "analysis", "strategic thinking", "business acumen", "entrepreneurship", "self-motivation", "initiative",
        "attention to detail", "organization", "multitasking", "prioritization", "stress management", "resilience",
        "work ethic", "professionalism", "ethics", "integrity", "accountability", "responsibility", "reliability",
        "punctuality", "cultural awareness", "diversity", "inclusion", "remote work", "virtual collaboration",
        "cross-functional collaboration", "interdisciplinary collaboration", "continuous learning", "growth mindset"
    ],
    "cybersecurity": [
        "cybersecurity", "information security", "network security", "application security", "cloud security",
        "security architecture", "security engineering", "security operations", "security assessment", "penetration testing",
        "vulnerability assessment", "threat modeling", "risk assessment", "security compliance", "security governance",
        "security policies", "security standards", "security frameworks", "iso 27001", "nist", "pci dss", "hipaa", "gdpr",
        "ccpa", "soc 2", "security auditing", "security monitoring", "siem", "security information and event management",
        "intrusion detection", "intrusion prevention", "ids", "ips", "firewall", "waf", "web application firewall",
        "endpoint security", "antivirus", "anti-malware", "encryption", "cryptography", "hashing", "digital signatures",
        "pki", "public key infrastructure", "vpn", "virtual private network", "ssl", "tls", "secure sockets layer",
        "transport layer security", "authentication", "authorization", "access control", "identity management", "iam",
        "single sign-on", "sso", "multi-factor authentication", "mfa", "two-factor authentication", "2fa", "biometrics",
        "security awareness", "security training", "incident response", "digital forensics", "malware analysis",
        "reverse engineering", "ethical hacking", "red team", "blue team", "purple team", "osint", "open source intelligence",
        "threat intelligence", "security operations center", "soc", "security architecture", "zero trust", "devsecops"
    ]
}

# Flatten the skills list for easier matching
ALL_SKILLS = []
for category in TECHNICAL_SKILLS.values():
    ALL_SKILLS.extend(category)

# Remove duplicates
ALL_SKILLS = list(set(ALL_SKILLS))

def extract_text_from_pdf(pdf_path_or_bytes):
    """Extract text from PDF file or bytes"""
    try:
        if isinstance(pdf_path_or_bytes, bytes):
            # If input is bytes, use BytesIO
            from io import BytesIO
            return extract_text_pdf(BytesIO(pdf_path_or_bytes))
        else:
            # If input is a file path
            return extract_text_pdf(pdf_path_or_bytes)
    except Exception as e:
        logger.error(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(docx_path_or_bytes):
    """Extract text from DOCX file or bytes"""
    try:
        if isinstance(docx_path_or_bytes, bytes):
            # If input is bytes, use BytesIO
            from io import BytesIO
            return docx2txt.process(BytesIO(docx_path_or_bytes))
        else:
            # If input is a file path
            return docx2txt.process(docx_path_or_bytes)
    except Exception as e:
        logger.error(f"Error extracting text from DOCX: {e}")
        return ""

def extract_text_from_other(file_path_or_bytes, file_extension):
    """Extract text from other file types using textract"""
    try:
        if isinstance(file_path_or_bytes, bytes):
            # If input is bytes, save to a temporary file first
            import tempfile
            with tempfile.NamedTemporaryFile(suffix=f".{file_extension}", delete=False) as temp_file:
                temp_file.write(file_path_or_bytes)
                temp_file_path = temp_file.name
            
            # Extract text from the temporary file
            text = textract.process(temp_file_path).decode('utf-8', errors='ignore')
            
            # Clean up the temporary file
            os.remove(temp_file_path)
            return text
        else:
            # If input is a file path
            return textract.process(file_path_or_bytes).decode('utf-8', errors='ignore')
    except Exception as e:
        logger.error(f"Error extracting text from {file_extension} file: {e}")
        return ""

def extract_text_from_resume(file_path_or_bytes, file_extension=None):
    """Extract text from resume file based on file extension"""
    if file_extension is None and isinstance(file_path_or_bytes, str):
        file_extension = file_path_or_bytes.split('.')[-1].lower()
    
    if file_extension == 'pdf':
        return extract_text_from_pdf(file_path_or_bytes)
    elif file_extension in ['docx', 'doc']:
        return extract_text_from_docx(file_path_or_bytes)
    elif file_extension in ['txt', 'text']:
        if isinstance(file_path_or_bytes, bytes):
            return file_path_or_bytes.decode('utf-8', errors='ignore')
        else:
            with open(file_path_or_bytes, 'r', encoding='utf-8', errors='ignore') as f:
                return f.read()
    else:
        # Try to use textract for other file types
        return extract_text_from_other(file_path_or_bytes, file_extension)

def preprocess_text(text):
    """Preprocess text for better skill extraction"""
    # Convert to lowercase
    text = text.lower()
    
    # Replace newlines and tabs with spaces
    text = re.sub(r'[\n\t]', ' ', text)
    
    # Replace multiple spaces with a single space
    text = re.sub(r' +', ' ', text)
    
    # Remove punctuation except for hyphens and periods (important for tech terms)
    punctuation_to_remove = string.punctuation.replace('-', '').replace('.', '')
    translator = str.maketrans('', '', punctuation_to_remove)
    text = text.translate(translator)
    
    return text

def extract_skills(text):
    """Extract skills from text using NLP techniques"""
    # Preprocess text
    processed_text = preprocess_text(text)
    
    # Process with spaCy
    doc = nlp(processed_text)
    
    # Extract potential skills
    extracted_skills = set()
    
    # Method 1: Direct matching with our skills list
    for skill in ALL_SKILLS:
        # Use word boundary regex to match whole words
        if re.search(r'\b' + re.escape(skill) + r'\b', processed_text):
            extracted_skills.add(skill)
    
    # Method 2: Extract noun phrases as potential skills
    for chunk in doc.noun_chunks:
        chunk_text = chunk.text.lower()
        # Check if any skill is in the noun chunk
        for skill in ALL_SKILLS:
            if skill in chunk_text:
                extracted_skills.add(skill)
    
    # Method 3: Look for skills in entity recognition
    for ent in doc.ents:
        if ent.label_ in ["ORG", "PRODUCT"]:
            ent_text = ent.text.lower()
            # Check if any skill matches this entity
            for skill in ALL_SKILLS:
                if skill in ent_text:
                    extracted_skills.add(skill)
    
    # Method 4: Use n-grams to catch multi-word skills
    # Create bigrams and trigrams
    tokens = [token.text.lower() for token in doc if not token.is_stop and not token.is_punct]
    bigrams = [' '.join(tokens[i:i+2]) for i in range(len(tokens)-1)]
    trigrams = [' '.join(tokens[i:i+3]) for i in range(len(tokens)-2)]
    
    # Check if any of these n-grams match our skills
    for ngram in bigrams + trigrams:
        if ngram in ALL_SKILLS:
            extracted_skills.add(ngram)
    
    # Convert skills to title case for better display
    formatted_skills = [skill.title() for skill in extracted_skills]
    
    # Categorize skills
    categorized_skills = {}
    for skill in extracted_skills:
        for category, skills_list in TECHNICAL_SKILLS.items():
            if skill in skills_list:
                if category not in categorized_skills:
                    categorized_skills[category] = []
                categorized_skills[category].append(skill.title())
    
    return {
        "skills": sorted(formatted_skills),
        "categorized_skills": categorized_skills
    }

def extract_education(text):
    """Extract education information from resume"""
    education = []
    
    # Common education degree keywords
    degree_keywords = [
        "bachelor", "master", "phd", "doctorate", "bs", "ms", "ba", "ma", "mba", "btech", "mtech",
        "b.tech", "m.tech", "b.e.", "m.e.", "b.s.", "m.s.", "b.a.", "m.a.", "ph.d", "associate",
        "diploma", "certification", "certificate", "degree"
    ]
    
    # Common education institution keywords
    institution_keywords = ["university", "college", "institute", "school", "academy"]
    
    # Process with spaCy
    doc = nlp(text.lower())
    
    # Extract sentences that might contain education information
    education_sentences = []
    for sent in doc.sents:
        sent_text = sent.text.lower()
        if any(keyword in sent_text for keyword in degree_keywords + institution_keywords):
            education_sentences.append(sent_text)
    
    # Extract education details from these sentences
    for sent in education_sentences:
        # Try to extract degree
        degree = None
        for keyword in degree_keywords:
            match = re.search(r'\b' + re.escape(keyword) + r'[s]?\b.*?(?=\bin\b|\bat\b|$)', sent)
            if match:
                degree = match.group(0).strip()
                break
        
        # Try to extract institution
        institution = None
        for keyword in institution_keywords:
            match = re.search(r'\b' + re.escape(keyword) + r'[s]?\b.*?(?=\,|\.|$)', sent)
            if match:
                institution = match.group(0).strip()
                break
        
        # Try to extract year
        year_match = re.search(r'\b(19|20)\d{2}\b', sent)
        year = year_match.group(0) if year_match else None
        
        if degree or institution:
            education.append({
                "degree": degree,
                "institution": institution,
                "year": year
            })
    
    return education

def extract_experience(text):
    """Extract work experience information from resume"""
    experience = []
    
    # Common job title keywords
    job_title_keywords = [
        "engineer", "developer", "manager", "director", "analyst", "specialist", "consultant",
        "coordinator", "administrator", "assistant", "associate", "lead", "senior", "junior",
        "intern", "architect", "designer", "technician", "officer", "head", "chief"
    ]
    
    # Process with spaCy
    doc = nlp(text.lower())
    
    # Extract sentences that might contain experience information
    experience_sentences = []
    for sent in doc.sents:
        sent_text = sent.text.lower()
        if any(keyword in sent_text for keyword in job_title_keywords):
            experience_sentences.append(sent_text)
    
    # Extract experience details from these sentences
    for sent in experience_sentences:
        # Try to extract job title
        job_title = None
        for keyword in job_title_keywords:
            match = re.search(r'\b' + re.escape(keyword) + r'[s]?\b.*?(?=\bat\b|\bin\b|$)', sent)
            if match:
                job_title = match.group(0).strip()
                break
        
        # Try to extract company
        company_match = re.search(r'\bat\b\s+(.*?)(?=\bfrom\b|\bin\b|\,|\.|$)', sent)
        company = company_match.group(1).strip() if company_match else None
        
        # Try to extract years
        years_match = re.search(r'\b(19|20)\d{2}\b\s*[-–—]\s*\b(19|20)\d{2}\b|\b(19|20)\d{2}\b\s*[-–—]\s*present\b', sent)
        years = years_match.group(0) if years_match else None
        
        if job_title or company:
            experience.append({
                "job_title": job_title,
                "company": company,
                "years": years
            })
    
    return experience

def parse_resume(file_path_or_bytes, file_extension=None):
    """Parse resume and extract relevant information"""
    try:
        # Extract text from resume
        text = extract_text_from_resume(file_path_or_bytes, file_extension)
        
        if not text or len(text.strip()) < 100:
            return {
                "success": False,
                "error": "Could not extract sufficient text from the resume"
            }
        
        # Extract skills from text
        skills_data = extract_skills(text)
        
        # Extract education information
        education_data = extract_education(text)
        
        # Extract experience information
        experience_data = extract_experience(text)
        
        return {
            "success": True,
            "skills": skills_data["skills"],
            "categorized_skills": skills_data["categorized_skills"],
            "education": education_data,
            "experience": experience_data
        }
    except Exception as e:
        logger.error(f"Error parsing resume: {e}", exc_info=True)
        return {
            "success": False,
            "error": str(e)
        }

# Example usage
if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        file_path = sys.argv[1]
        result = parse_resume(file_path)
        print(json.dumps(result, indent=2))
    else:
        print("Please provide a resume file path")
