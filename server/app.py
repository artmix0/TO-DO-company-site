from flask import Flask, request, jsonify, send_from_directory, render_template, make_response
from flask_cors import CORS
import json
import os
import sys
from pathlib import Path

app = Flask(__name__, static_folder='../static', template_folder='../templates')

# Configure CORS with specific settings
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

# Add CORS headers to all responses
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:5000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

DATA_DIR = '../data'

# Ensure data directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

# Routes for serving static files
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/admin')
def admin():
   return render_template('admin_panel.html')

# API Routes for announcements
@app.route('/api/announcements', methods=['GET', 'OPTIONS'])
def get_announcements():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    return json.loads(GetFile("announcements", "{}"))

@app.route('/api/announcements', methods=['POST', 'OPTIONS'])
def save_announcements():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    data = request.get_json()
    SetFile(json.dumps(data), "announcements")
    return jsonify({"message": "Announcements saved successfully"})

# API Routes for hero slides
@app.route('/api/hero-slides', methods=['GET', 'OPTIONS'])
def get_hero_slides():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    return json.loads(GetFile("hero_slides", "{}"))

@app.route('/api/hero-slides', methods=['POST', 'OPTIONS'])
def save_hero_slides():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    data = request.get_json()
    SetFile(json.dumps(data), "hero_slides")
    return jsonify({"message": "Hero slides saved successfully"})

# API Routes for products
@app.route('/api/products', methods=['GET', 'OPTIONS'])
def get_products():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    return json.loads(GetFile("products", "{}"))

@app.route('/api/products', methods=['POST', 'OPTIONS'])
def save_products():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    data = request.get_json()
    SetFile(json.dumps(data), "products")
    return jsonify({"message": "Products saved successfully"})

# API Routes for main products
@app.route('/api/main-products', methods=['GET', 'OPTIONS'])
def get_main_products():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    return json.loads(GetFile("main_products", '{"selectedIDs": []}'))

@app.route('/api/main-products', methods=['POST', 'OPTIONS'])
def save_main_products():
    if request.method == 'OPTIONS':
        return make_response('', 200)
    data = request.get_json()
    if len(data.get('selectedIDs', [])) > 6:
        return jsonify({"error": "Cannot select more than 6 products"}), 400
    SetFile(json.dumps(data), "main_products")
    return jsonify({"message": "Main products saved successfully"})

if getattr(sys, 'frozen', False):
    # Jeśli aplikacja jest skompilowana przez PyInstaller
    base_path = Path(sys._MEIPASS).parent
else:
    # Jeśli aplikacja działa jako zwykły skrypt Pythona
    base_path = Path(__file__).parent.parent

def GetFile(File, NoFile):
    try:
        with open(f'{str(base_path)}\\data\\{File}.json', 'r') as f:
            content = f.read()
            return str(content)
    except FileNotFoundError:
        with open(f'{str(base_path)}\\data\\{File}.json', 'w') as f:
            print("NIE MA")
            f.write(str(NoFile))
            return str(NoFile)
    except json.JSONDecodeError:
        print(f"Błąd dekodowania JSON w pliku: {File}.json")
        return str(NoFile)

def SetFile(SetFile, File):
    path = f'{str(base_path)}\\data\\{File}.json'
    with open(path, 'w') as f:
        f.write(str(SetFile))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
