from flask import Flask, request, jsonify, send_from_directory, render_template, make_response
from flask_cors import CORS
from waitress import serve
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import json
import os
import sys
from pathlib import Path
import base64
from PIL import Image
import io

app = Flask(__name__, static_folder='../static', template_folder='../templates')

if getattr(sys, 'frozen', False):
    base_path = Path(sys._MEIPASS).parent
else:
    base_path = Path(__file__).parent.parent

# Configure upload settings
UPLOAD_FOLDER = f'{str(base_path)}\\static\\images\\Products_Images'
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff', 'tif'}

# Configure CORS with specific settings
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:5000", "http://127.0.0.1:5000"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

DATA_DIR = '../data'

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/upload-image', methods=['POST'])
def upload_image():
    try:
        product_id = request.form.get('productId')
        if not product_id:
            return jsonify({'error': 'No product ID provided'}), 400

        filename = f"{product_id}.png"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        if 'file' not in request.files and 'image' in request.form:
            image_data = request.form['image']
            if 'base64,' in image_data:
                image_data = image_data.split('base64,')[1]
            image_bytes = base64.b64decode(image_data)

            # Konwertuj na PNG
            img = Image.open(io.BytesIO(image_bytes))
            img.convert("RGBA").save(filepath, format="PNG")

            return jsonify({
                'success': True,
                'filename': filename,
                'url': f'../static/images/Products_Images/{filename}'
            })

        if 'file' not in request.files or request.files['file'].filename == '':
            return jsonify({'error': 'No selected file'}), 400

        file = request.files['file']
        img = Image.open(file)
        img.convert("RGBA").save(filepath, format="PNG")

        return jsonify({
            'success': True,
            'filename': filename,
            'url': f'../static/images/Products_Images/{filename}'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

@app.route('/products')
def products():
    return render_template('products.html')

@app.route('/payment')
def payment():
    return render_template('payment.html')

@app.route('/about_us')
def about_us():
    return render_template('about_us.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/contact_form')
def contact_form():
    return render_template('contact_form.html')

# API Routes for announcements
@app.route('/api/announcements', methods=['GET'])
def get_announcements():
    return json.loads(GetFile("announcements", "{}"))

@app.route('/api/announcements', methods=['POST'])
def save_announcements():
    data = request.get_json()
    SetFile(json.dumps(data), "announcements")
    return jsonify({"message": "Announcements saved successfully"})

# API Routes for hero slides
@app.route('/api/hero-slides', methods=['GET'])
def get_hero_slides():
    return json.loads(GetFile("hero_slides", "{}"))

@app.route('/api/hero-slides', methods=['POST'])
def save_hero_slides():
    data = request.get_json()
    SetFile(json.dumps(data), "hero_slides")
    return jsonify({"message": "Hero slides saved successfully"})

# API Routes for products
@app.route('/api/products', methods=['GET'])
def get_products():
    return json.loads(GetFile("products", "{}"))

@app.route('/api/products', methods=['POST'])
def save_products():
    data = request.get_json()
    SetFile(json.dumps(data), "products")
    return jsonify({"message": "Products saved successfully"})

# API Routes for main products
@app.route('/api/main-products', methods=['GET'])
def get_main_products():
    return json.loads(GetFile("main_products", '{"selectedIDs": []}'))

@app.route('/api/main-products', methods=['POST'])
def save_main_products():
    data = request.get_json()
    if len(data.get('selectedIDs', [])) > 6:
        return jsonify({"error": "Cannot select more than 6 products"}), 400
    SetFile(json.dumps(data), "main_products")
    return jsonify({"message": "Main products saved successfully"})

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

my_email = GetFile('my_email', '{"main_email": {"email": "", "password": ""}}')

def send_email(serwer_email, reciepent, subject, body):
    if serwer_email['email'] == "" or serwer_email['password'] == "":
        print("Nie skonfigurowano adresu e-mail.")
        return
    msg = MIMEMultipart()
    msg['From'] = serwer_email["email"]
    msg['To'] = reciepent
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP('smtp.poczta.onet.pl', 587)
        server.starttls()
        server.login(serwer_email["email"], serwer_email["password"])
        text = msg.as_string()
        server.sendmail(serwer_email["email"], reciepent, text)
        server.quit()
        print("E-mail wysłany pomyślnie")
    except Exception as e:
        print(f"Błąd podczas wysyłania e-maila: {e}")

if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=5000, threads=4)
