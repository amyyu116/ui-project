from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import json
import re
from datetime import datetime
import uuid

app = Flask(__name__)
id = str(uuid.uuid4())[:8]
filename = f"user{id}_log.json"
chord_names = {
    "i_chord": "C Major",
    "ii_chord": "d minor",
    "iii_chord": "e minor",
    "iv_chord": "F Major",
    "v_chord": "G Major",
    "vi_chord": "a minor",
    "vii_chord": "b diminished"
}

def log(message):
    global filename
    with open(filename, "a") as f:
        f.write(json.dumps(message) + "\n")
        
# ROUTES
@app.route('/')
def welcome():
    return render_template("welcome.html")   

@app.route('/learn/<int:page_num>')
def render_tutorial(page_num):
    total_pages = 10
    return render_template(f"learn{page_num}.html", page_num=page_num, total_pages=total_pages)

@app.route('/quiz/<int:page_num>')
def render_quiz(page_num):
    total_pages = 10
    return render_template(f"quiz{page_num}.html", page_num=page_num, total_pages=total_pages)

@app.route('/log-entry-time', methods=['POST'])
def log_entry_time():
    data = request.get_json()
    page = data.get("page")
    timestamp = data.get("timestamp")

    print(f"User entered {page} at {timestamp}")
    log(f"page: {page}, timestamp: {timestamp}")

    return jsonify({"status": "success"})

@app.route('/log_chord', methods=['POST'])
def log_chord():
    global chord_names
    data = request.get_json()
    chord = data.get("chord")
    timestamp = data.get("timestamp")
    
    print(f"User sampled {chord_names[chord]} ({chord}) at {timestamp}")
    log(f"chord: {chord_names[chord]} ({chord}), timestamp: {timestamp}")

    return jsonify({"status": "success"})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
