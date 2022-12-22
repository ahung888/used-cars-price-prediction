from flask import Flask, render_template, jsonify
from models.xgb_model import XGBmodel
from time import sleep
from random import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', data=XGBmodel.default_value)

@app.route('/data', methods=['POST'])
def data():
    sleep(random() + 0.5)
    model = XGBmodel()
    data = model.get_request_data()
    price = model.predict(data)
    return jsonify({'p':price})
