from flask import Flask, render_template, jsonify
from models.xgb_model import XGBmodel

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', data=XGBmodel.default_value)

@app.route('/data')
def data():
    model = XGBmodel()
    data = model.get_request_data()
    price = model.predict(data)
    return jsonify({'p':price})
