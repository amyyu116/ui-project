from flask import Flask
from flask import render_template
from flask import Response, request, jsonify, session, redirect, url_for
import json
import re
from datetime import datetime, timezone
import uuid

app = Flask(__name__)
app.secret_key = "quiz_key"
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
    session.clear()
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

@app.route('/save-response', methods=['POST'])
def save_response():
    data = request.get_json()
    page = str(data.get("page"))
    answers = data.get("answers")
    accPoints = data.get("accPoints")

    if "answers" not in session:
        session["answers"] = {}
    session["answers"][page] = answers
    
    if accPoints is not None:
       session["accPoints"] = accPoints

    session.modified = True
    log_per_question = {
            "page": page,
            "answers": answers,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "accPoints" : accPoints
        }

    log(log_per_question)
    
    return jsonify({"status": "success"})

@app.route('/restart-quiz', methods=['GET'])
def restart_quiz():
    session.clear()
    return redirect('/quiz/1')

@app.route('/quiz/11')
def render_results():
    score = session.get("accPoints")
    # if score is None:
    #     return redirect(url_for('render_quiz', page_num=1))
    return render_template("quiz11.html", score=score)

if __name__ == '__main__':
    app.run(debug=True, port=5001)
