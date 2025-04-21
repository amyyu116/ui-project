from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import json
import re
from datetime import datetime

app = Flask(__name__)

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

    with open("entry_log.json", "a") as f:
        f.write(json.dumps({
            "page": page,
            "timestamp": timestamp
        }) + "\n")

    return jsonify({"status": "success"})


if __name__ == '__main__':
    app.run(debug=True, port=5001)
