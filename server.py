from flask import Flask, render_template, request, jsonify, session, redirect
import json, uuid
from datetime import datetime, timezone

import json


app = Flask(__name__)
app.secret_key = "quiz_key"

# ---------- helper data ----------
score = 0
id_ = str(uuid.uuid4())[:8]
filename = f"user{id_}_log.json"

with open('quiz.json', 'r') as f:
    questions = json.load(f)

with open('learn.json', 'r') as f:
    tutorials = json.load(f)

chord_names = {
    "i_chord":   "C Major",
    "ii_chord":  "d minor",
    "iii_chord": "e minor",
    "iv_chord":  "F Major",
    "v_chord":   "G Major",
    "vi_chord":  "a minor",
    "vii_chord": "b diminished",
}


TOTAL_TUTORIAL_PAGES = 6
TOTAL_QUIZ_PAGES      = 5   # update if quiz length changes


# ---------- utility ----------
def log(msg):
    with open(filename, "a") as f:
        f.write(json.dumps(msg) + "\n")


def reset_quiz_state():
    """Clear quiz-only keys without touching tutorial progress flags."""
    for key in ("answers", "accPoints"):
        session.pop(key, None)


# ---------- routes ----------
@app.route("/")
def welcome():
    session.clear()                       # fresh start = clear everything
    return render_template("welcome.html")


@app.route("/learn/<int:page_num>")
def render_tutorial(page_num):
    """
    Renders a tutorial page and updates progress synchronously so the
    lock disappears as soon as the user reaches page 6.
    """
    total_pages = TOTAL_TUTORIAL_PAGES          # == 6

    # ----- 1. mark THIS page as visited right away -----
    visited_pages = session.get("visited_pages", [])
    if page_num not in visited_pages:
        visited_pages.append(page_num)
        session["visited_pages"] = visited_pages   # save back
        session.modified = True

    # ----- 2. compute / persist tutorial_complete -----
    tutorial_complete = session.get("tutorial_complete", False)
    if not tutorial_complete and sorted(visited_pages) == list(range(1, total_pages + 1)):
        session["tutorial_complete"] = True
        tutorial_complete = True
    
    # ----- 3. retrieve data -----
    data = tutorials.get(str(page_num))
    type = data["type"]
    context = {
        "page_num": page_num,
        "total_pages": total_pages,
        "tutorial_complete": tutorial_complete,
        "page_title": data["title"],
        "page_heading": data["heading"],
        "page_type": type,
        "next_url": data.get("next_url"),
        "prev_url": data.get("prev_url")
    }

    # ----- 4. render -----
    if type == "image_text":
        context["media_image"] = data["image"]
        context["paragraph"] = data["paragraph"]
    elif type == "traits_media":
        context["traits"] = data["traits"]
        context["songs"] = data["songs"]
        context["videos"] = data["videos"]

    if type == "custom":
        return render_template(f"learn{page_num}.html", **context)
    return render_template("learn_template.html", **context)



# track page visits (called from JS on every page load)
@app.route("/log-entry-time", methods=["POST"])
def log_entry_time():
    data = request.get_json()
    page = data.get("page")
    timestamp = data.get("timestamp")

    if page.startswith("/learn/"):
        page_num = int(page.split("/")[2])
        session.setdefault("visited_pages", [])
        if page_num not in session["visited_pages"]:
            session["visited_pages"].append(page_num)
            session.modified = True

    print(f"User entered {page} at {timestamp}")
    log({"page": page, "timestamp": timestamp})
    return jsonify({"status": "success"})


# ----- Quiz -----
@app.route("/quiz/<int:page_num>")
def render_quiz(page_num):
    global score
    question = questions[str(page_num)]
    template = f"quiz_{question['type']}.html"

    tutorial_complete = session.get("tutorial_complete", False)
    return render_template(
        template,
        page_num=page_num,
        total_pages=TOTAL_QUIZ_PAGES,
        question = question,
        score=score,
        tutorial_complete=tutorial_complete,
    )

@app.route("/restart-quiz")
def restart_quiz():
    global score
    score = 0
    reset_quiz_state()
    return redirect("/quiz/1")


@app.route("/update-score", methods=["POST"])
def update_score():
    global score
    inc = int(request.get_json().get("increment", 0))
    score += inc
    return jsonify({"score": score, "status": "ok"})


@app.route("/score_page")
def render_results():
    global score
    tutorial_complete = session.get("tutorial_complete", False)
    return render_template("score_page.html", score=score, tutorial_complete=tutorial_complete)


# ----- Misc logging endpoints -----
@app.route("/log_chord", methods=["POST"])
def log_chord():
    data = request.get_json()
    chord = data.get("chord")
    timestamp = data.get("timestamp")

    print(f"User sampled {chord_names[chord]} ({chord}) at {timestamp}")
    log({"chord": f"{chord_names[chord]} ({chord})", "timestamp": timestamp})
    return jsonify({"status": "success"})


@app.route("/save-response", methods=["POST"])
def save_response():
    data = request.get_json()
    page = str(data.get("page"))
    answers = data.get("answers")
    accPoints = data.get("accPoints")

    session.setdefault("answers", {})[page] = answers
    if accPoints is not None:
        session["accPoints"] = accPoints
    session.modified = True

    log({
        "page": page,
        "answers": answers,
        "accPoints": accPoints,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })
    return jsonify({"status": "success"})


# ---------- main ----------
if __name__ == "__main__":
    app.run(debug=True, port=5001)
