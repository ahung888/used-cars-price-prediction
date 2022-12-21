from flask import Flask, render_template, jsonify
from models.xgb_model import XGBmodel

app = Flask(__name__)
models = {
    'xgb_model': XGBmodel(),
}

@app.route('/')
def index():
    data = models['xgb_model'].default_value()
    return render_template('index.html', data=data)

@app.route('/data')
def data():
    model = models['xgb_model']
    data = model.get_request_data()
    price = model.predict(data)
    return jsonify({'p':price})
