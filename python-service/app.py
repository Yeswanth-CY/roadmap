from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import json
import logging
import time
from resume_parser import parse_resume
from werkzeug.utils import secure_filename
import spacy
import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
from googleapiclient.discovery import build
import nltk
from nltk.corpus import stopwords

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Download NLTK resources
try:
    nltk.download('stopwords', quiet=True)
    nltk.download('punkt', quiet=True)
except Exception as e:
    logger.warning(f"NLTK download error: {e}")

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load spaCy model
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    logger.warning(f"Error loading spaCy model: {e}")
    # If model not found, download it
    os.system("python -m spacy download en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

# Create a data directory for storing parsed resume data
os.makedirs('data', exist_ok=True)

@app.route('/parse-resume', methods=['POST'])
def parse_resume_api():
    """Parse a resume file and extract skills and other information"""
    start_time = time.time()
    logger.info("Received resume parsing request")
    
    if 'file' not in request.files:
        logger.warning("No file provided in request")
        return jsonify({"success": False, "error": "No file provided"}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        logger.warning("Empty filename provided")
        return jsonify({"success": False, "error": "No file selected"}), 400
    
    # Get file extension
    file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else None
    
    if file_extension not in ['pdf', 'docx', 'doc', 'txt', 'rtf']:
        logger.warning(f"Unsupported file format: {file_extension}")
        return jsonify({"success": False, "error": "Unsupported file format. Please upload PDF, DOCX, DOC, TXT, or RTF"}), 400
    
    try:
        # Read file content
        file_content = file.read()
        
        # Parse the resume
        result = parse_resume(file_content, file_extension)
        
        # Log processing time
        processing_time = time.time() - start_time
        logger.info(f"Resume parsed in {processing_time:.2f} seconds")
        
        # Save parsed data for analytics (optional)
        user_id = request.form.get('user_id', 'anonymous')
        save_path = os.path.join('data', f"{user_id}_{int(time.time())}_parsed_resume.json")
        
        with open(save_path, 'w') as f:
            json.dump(result, f, indent=2)
        
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error processing resume: {e}", exc_info=True)
        return jsonify({"success": False, "error": f"Failed to process resume: {str(e)}"}), 500

@app.route('/update-skill-levels', methods=['POST'])
def update_skill_levels():
    """Update skill levels based on assessment"""
    data = request.json
    user_id = data.get('user_id', 'anonymous')
    skill_levels = data.get('skill_levels', {})
    
    # Save skill levels to a file
    os.makedirs('data', exist_ok=True)
    file_path = f'data/{user_id}_skill_levels.json'
    
    with open(file_path, 'w') as f:
        json.dump({"skill_levels": skill_levels}, f)
    
    return jsonify({"success": True})

@app.route('/generate-roadmap', methods=['POST'])
def generate_roadmap():
    """Generate a personalized learning roadmap"""
    data = request.json
    user_id = data.get('user_id', 'anonymous')
    skill_levels = data.get('skill_levels', {})
    
    # Get resources for each skill
    roadmap = {"skills": []}
    
    for skill, level in skill_levels.items():
        # Get resources from APIs
        youtube_resources = get_youtube_resources(skill, level)
        search_resources = get_search_resources(skill, level)
        practice_resources = get_practice_resources(skill, level)
        
        # Combine and rank resources
        all_resources = youtube_resources + search_resources + practice_resources
        ranked_resources = rank_resources(all_resources, skill, level)
        
        roadmap["skills"].append({
            "name": skill,
            "level": level,
            "resources": ranked_resources
        })
    
    # Save roadmap to a file
    os.makedirs('data', exist_ok=True)
    file_path = f'data/{user_id}_roadmap.json'
    
    with open(file_path, 'w') as f:
        json.dump(roadmap, f)
    
    return jsonify(roadmap)

def get_youtube_resources(skill, level):
    """Get YouTube resources for a skill and level"""
    api_key = os.environ.get('YOUTUBE_API_KEY')
    
    if not api_key:
        logger.warning("YouTube API key not found, returning mock data")
        return [
            {
                "type": "video",
                "title": f"Learn {skill} - Complete Tutorial",
                "url": f"https://youtube.com/watch?v=example",
                "platform": "YouTube",
                "difficulty": level,
                "popularity": 0.9
            },
            {
                "type": "video",
                "title": f"{skill} for {level.title()} Developers",
                "url": f"https://youtube.com/watch?v=example2",
                "platform": "YouTube",
                "difficulty": level,
                "popularity": 0.8
            }
        ]
    
    try:
        youtube = build('youtube', 'v3', developerKey=api_key)
        
        # Customize query based on skill level
        query = f"{skill} tutorial"
        if level == "beginner":
            query = f"{skill} tutorial for beginners"
        elif level == "intermediate":
            query = f"{skill} intermediate tutorial"
        elif level == "advanced":
            query = f"{skill} advanced tutorial"
        
        # Call the search.list method to retrieve results
        search_response = youtube.search().list(
            q=query,
            part='snippet',
            maxResults=5,
            type='video',
            relevanceLanguage='en',
            order='relevance'
        ).execute()
        
        videos = []
        for item in search_response.get('items', []):
            videos.append({
                "type": "video",
                "title": item['snippet']['title'],
                "description": item['snippet']['description'],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "thumbnail": item['snippet']['thumbnails']['medium']['url'],
                "channelTitle": item['snippet']['channelTitle'],
                "publishedAt": item['snippet']['publishedAt'],
                "platform": "YouTube",
                "difficulty": level,
                "popularity": 0.9  # Mock popularity score
            })
        
        return videos
    except Exception as e:
        logger.error(f"Error fetching YouTube resources: {e}", exc_info=True)
        return [
            {
                "type": "video",
                "title": f"Learn {skill} - Complete Tutorial",
                "url": f"https://youtube.com/results?search_query={skill}+tutorial",
                "platform": "YouTube",
                "difficulty": level,
                "popularity": 0.9
            }
        ]

def get_search_resources(skill, level):
    """Get web resources using Google Custom Search API"""
    api_key = os.environ.get('GOOGLE_API_KEY')
    search_engine_id = os.environ.get('SEARCH_ENGINE_ID')
    
    if not api_key or not search_engine_id:
        logger.warning("Google API key or Search Engine ID not found, returning mock data")
        return [
            {
                "type": "course",
                "title": f"{skill} Masterclass",
                "url": f"https://example.com/course",
                "platform": "Udemy",
                "difficulty": level,
                "popularity": 0.85
            },
            {
                "type": "course",
                "title": f"Complete {skill} Bootcamp",
                "url": f"https://example.com/bootcamp",
                "platform": "Coursera",
                "difficulty": level,
                "popularity": 0.75
            }
        ]
    
    try:
        # Customize query based on skill level
        query = f"best website to learn {skill}"
        if level == "beginner":
            query = f"best website to learn {skill} for beginners"
        elif level == "intermediate":
            query = f"best {skill} intermediate tutorials"
        elif level == "advanced":
            query = f"advanced {skill} tutorials"
        
        # Call the Custom Search API
        url = "https://www.googleapis.com/customsearch/v1"
        params = {
            'q': query,
            'key': api_key,
            'cx': search_engine_id,
            'num': 5
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if 'items' not in data:
            logger.warning(f"No search results found for {skill}")
            return []
        
        websites = []
        for item in data['items']:
            websites.append({
                "type": "website",
                "title": item['title'],
                "description": item['snippet'],
                "url": item['link'],
                "displayLink": item['displayLink'],
                "platform": item['displayLink'].split('.')[0].capitalize(),
                "difficulty": level,
                "popularity": 0.8  # Mock popularity score
            })
        
        return websites
    except Exception as e:
        logger.error(f"Error fetching search resources: {e}", exc_info=True)
        return [
            {
                "type": "course",
                "title": f"{skill} Tutorials",
                "url": f"https://www.google.com/search?q={skill}+tutorials",
                "platform": "Google",
                "difficulty": level,
                "popularity": 0.85
            }
        ]

def get_practice_resources(skill, level):
    """Get practice resources for a skill"""
    # Define practice platforms for different skills and levels
    practice_platforms = {
        "python": {
            "beginner": {
                "title": "Python Basics on HackerRank",
                "url": "https://www.hackerrank.com/domains/python",
                "platform": "HackerRank"
            },
            "intermediate": {
                "title": "Python Challenges on Codewars",
                "url": "https://www.codewars.com/collections/python-intermediate",
                "platform": "Codewars"
            },
            "advanced": {
                "title": "Python Problems on LeetCode",
                "url": "https://leetcode.com/problemset/all/?topicSlugs=python",
                "platform": "LeetCode"
            }
        },
        "javascript": {
            "beginner": {
                "title": "JavaScript Basics on freeCodeCamp",
                "url": "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
                "platform": "freeCodeCamp"
            },
            "intermediate": {
                "title": "JavaScript 30 - 30 Day Challenge",
                "url": "https://javascript30.com/",
                "platform": "JavaScript30"
            },
            "advanced": {
                "title": "JavaScript Algorithms and Data Structures",
                "url": "https://github.com/trekhleb/javascript-algorithms",
                "platform": "GitHub"
            }
        }
    }
    
    # Default practice platforms for skills not in our database
    default_platforms = {
        "beginner": {
            "title": "Practice on freeCodeCamp",
            "url": "https://www.freecodecamp.org/",
            "platform": "freeCodeCamp"
        },
        "intermediate": {
            "title": "Practice on Exercism",
            "url": "https://exercism.org/",
            "platform": "Exercism"
        },
        "advanced": {
            "title": "Practice on Codewars",
            "url": "https://www.codewars.com/",
            "platform": "Codewars"
        }
    }
    
    # Normalize skill name for lookup
    skill_lower = skill.lower()
    
    # Get practice platform for this skill and level
    if skill_lower in practice_platforms and level in practice_platforms[skill_lower]:
        platform_info = practice_platforms[skill_lower][level]
    else:
        platform_info = default_platforms[level]
    
    return [{
        "type": "practice",
        "title": platform_info["title"],
        "url": platform_info["url"],
        "platform": platform_info["platform"],
        "difficulty": level,
        "popularity": 0.7  # Mock popularity score
    }]

def rank_resources(resources, skill, level):
    """Rank resources using TF-IDF and cosine similarity"""
    if not resources:
        return []
    
    # Create a corpus of resource titles
    corpus = [resource["title"] for resource in resources]
    
    # Create a query based on skill and level
    query = f"{skill} {level} tutorial course"
    
    # Add the query to the corpus
    corpus.append(query)
    
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(corpus)
    
    # Calculate cosine similarity between query and resources
    cosine_similarities = cosine_similarity(tfidf_matrix[-1:], tfidf_matrix[:-1])[0]
    
    # Add relevance scores to resources
    for i, resource in enumerate(resources):
        resource["relevance"] = float(cosine_similarities[i])
    
    # Rank resources by a combination of relevance and popularity
    for resource in resources:
        resource["score"] = 0.7 * resource["relevance"] + 0.3 * resource.get("popularity", 0)
    
    # Sort by score
    ranked_resources = sorted(resources, key=lambda x: x["score"], reverse=True)
    
    # Remove scoring fields before returning
    for resource in ranked_resources:
        resource.pop("relevance", None)
        resource.pop("popularity", None)
        resource.pop("score", None)
    
    return ranked_resources[:5]  # Return top 5 resources

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "version": "1.0.0"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)
