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
   return render_template()   

@app.route('/learn/<page_num>')
def render_restaurant(page_num=None):
    return render_template(f"p{page_num}.html")

@app.route('/quiz/<page_num>')
def render_edit(id=None):
    return render_template()

if __name__ == '__main__':
   app.run(debug = True, port=5001)
