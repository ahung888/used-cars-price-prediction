from flask import Flask, render_template, jsonify
from models.xgb_model import XGBmodel
from models.xgboost_classifier import XGBoostClassifierPredictor
from models.xgboost_regressor import XGBoostRegressorPredictor
from time import sleep
from random import random

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', page='index')

@app.route('/xgboost_classifier')
def xgboost_classifier():
    return render_template('predict_system/xgboost_classifier.html', page='index')

@app.route('/xgboost_regressor')
def xgboost_regressor():
    return render_template('predict_system/xgboost_regressor.html', page='index')

@app.route('/analysis')
def analysis():
    return render_template('analysis.html',page='analysis')
    
@app.route('/decision_tree')
def decision_tree():
    return render_template('decision_tree.html',page='decision_tree')

@app.route('/data', methods=['POST'])
def data():
    sleep(random() + 0.5)
    model = XGBmodel()
    data = model.get_request_data()
    price = model.predict(data)
    return jsonify({'p':price})

@app.route('/data/xgboost_classifier', methods=['POST'])
def data_xgboost_classifier():
    sleep(random() + 0.5)
    model = XGBoostClassifierPredictor()
    data = model.get_request_data()
    price_label = model.predict(data)
    return jsonify({'p':price_label})

@app.route('/data/xgboost_regressor', methods=['POST'])
def data_xgboost_regressor():
    sleep(random() + 0.5)
    model = XGBoostRegressorPredictor()
    data = model.get_request_data()
    price = model.predict(data)
    return jsonify({'p':price})
