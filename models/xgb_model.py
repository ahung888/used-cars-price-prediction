from flask import request
import pickle
import pandas as pd
import numpy as np
from os import path

class XGBmodel:
    cols = [
        'horsepower',
        'torque',
        'wheel_system_FWD',
        'engine_type_I4',
        'make_name_Lexus',
        'make_name_Mercedes-Benz',
        'year',
        'engine_type_H6',
        'mileage',
        'make_name_Dodge',
        'make_name_BMW',
        'make_name_Cadillac',
        'fuel_type_Diesel',
        'body_type_Pickup Truck',
        'wheel_system_4X2',
        'body_type_Sedan',
        'engine_type_I6',
        'make_name_Other',
        'make_name_Kia',
        'body_type_SUV / Crossover',
        'wheel_system_AWD',
        'make_name_Ford',
        'body_type_Hatchback',
        'make_name_Nissan',
        'model_name_Fusion',
        'make_name_Honda'
    ]
    default_value = {
        'horsepower': 228,
        'torque': 264,
        'mileage': 1099,
    }
    
    def __init__(self):
        filepath = path.join(path.dirname(__file__), 'xgb_model.pkl')
        self.model = pickle.load(open(filepath, 'rb'))
    
    def predict(self, data):
        y_pred = self.model.predict(data)
        return float(np.around(np.exp(y_pred[0]), 2).astype(str))

    def get_request_data(self):
        horsepower = request.values.get('horsepower', type=float, default=228.0)
        torque = request.values.get('torque', type=float, default=264.27)
        mileage = request.values.get('mileage', type=float, default=1099.0)
        year = request.values.get('year', type=int, default=2015)
        engine_type = request.values.get('engine_type', type=int, default=0)
        make_name = request.values.get('make_name', type=int, default=0)
        body_type = request.values.get('body_type', type=int, default=0)
        wheel_system = request.values.get('wheel_system', type=int, default=0)
        model_name = request.values.get('model_name', type=int, default=0)
        fuel_type = request.values.get('fuel_type', type=int, default=0)

        return pd.DataFrame([[
            horsepower if horsepower else 228.0,
            torque if torque else 264.27,
            1 if wheel_system == 1 else 0, # wheel_system_FWD
            1 if engine_type == 1 else 0, # engine_type_I4
            1 if make_name == 2 else 0, # make_name_Lexus
            1 if make_name == 3 else 0, # make_name_Mercedes-Benz
            year if year else 2020,
            1 if engine_type == 2 else 0, # engine_type_H6
            mileage if mileage else 1099.0,
            1 if make_name == 4 else 0, # make_name_Dodge
            1 if make_name == 5 else 0, # make_name_BMW
            1 if make_name == 6 else 0, # make_name_Cadillac
            1 if fuel_type == 1 else 0, # fuel_type_Diesel
            1 if body_type == 1 else 0, # body_type_Pickup Truck
            1 if wheel_system == 3 else 0, # wheel_system_4X2
            1 if body_type == 2 else 0, # body_type_Sedan
            1 if engine_type == 3 else 0, # engine_type_I6
            1 if make_name == 10 else 0, # make_name_Other
            1 if make_name == 7 else 0, # make_name_Kia
            1 if body_type == 3 else 0, # body_type_SUV / Crossover
            1 if wheel_system == 2 else 0, # wheel_system_AWD
            1 if make_name == 1 else 0, # make_name_Ford
            1 if body_type == 4 else 0, # body_type_Hatchback
            1 if make_name == 8 else 0, # make_name_Nissan
            1 if model_name == 1 else 0, # model_name_Fusion
            1 if make_name == 9 else 0, # make_name_Honda
        ]],
        columns=XGBmodel.cols)