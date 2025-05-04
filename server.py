from flask import Flask, render_template, request, jsonify, session, redirect
import json, uuid
from datetime import datetime, timezone

app = Flask(__name__)
app.secret_key = "quiz_key"


score = 0 

# if we allow for multiple users, we store the score in a hashmap to userID instead
# can update this next week if needed
 
id        = str(uuid.uuid4())[:8]
filename  = f"user{id}_log.json"
chord_names = { ... }                        
def log(msg):
    with open(filename, "a") as f:
        f.write(json.dumps(msg) + "\n")

@app.route('/')
def welcome():
    session.clear()
    return render_template("welcome.html")

@app.route('/quiz/<int:page_num>')
def render_quiz(page_num):
    global score
    total_pages = 5
    return render_template(f"quiz{page_num}.html",
                           page_num=page_num,
                           total_pages=total_pages,
                           score=score)         
@app.route('/update-score', methods=['POST'])
def update_score():
    """
    Body: {"increment": 1}
    Returns: {"score": 1, "status": "ok"}
    """
    global score
    inc = request.get_json().get("increment", 0)
    score += int(inc)
    return jsonify({"score": score, "status": "ok"})

@app.route('/restart-quiz')
def restart_quiz():
    global score
    score = 0               
    session.clear()
    return redirect('/quiz/1')

@app.route('/quiz/1')
def render_quiz_question_one():
    global score
    score = 0               
    session.clear()
    total_pages = 5
    return render_template(f"quiz1.html",
                           page_num=1,
                           total_pages=total_pages,
                           score=score) 

@app.route('/score_page')
def render_results():
    global score
    return render_template("score_page.html", score=score)

@app.route('/learn/<int:page_num>')
def render_tutorial(page_num):
    total_pages = 9
    return render_template(f"learn{page_num}.html", page_num=page_num, total_pages=total_pages)

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


if __name__ == '__main__':
    app.run(debug=True, port=5001)
