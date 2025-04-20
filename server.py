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
def render_restaurant(id=None):
    return render_template()

@app.route('/quiz/<page_num>')
def render_edit(id=None):
    return render_template()