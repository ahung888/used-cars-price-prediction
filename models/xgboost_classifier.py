from flask import request
import pickle
import pandas as pd
import numpy as np
from os import path

class XGBoostClassifierPredictor:
    cols = [
        'daysonmarket',
        'has_incidents',
        'horsepower',
        'maximum_seating',
        'mileage',
        'savings_amount',
        'torque',
        'year',
        'combined_fuel_economy',
        'legroom',
        'major_options_count',
        'size_of_vehicle',
        'body_type_Hatchback',
        'body_type_Pickup Truck',
        'body_type_SUV / Crossover',
        'body_type_Sedan',
        'body_type_Wagon',
        'engine_type_Gasoline engine',
        'engine_type_H6',
        'engine_type_I4',
        'engine_type_I5',
        'engine_type_I6',
        'engine_type_V12',
        'engine_type_V6',
        'engine_type_V8',
        'exterior_color_Silver',
        'exterior_color_White',
        'fuel_type_Diesel',
        'fuel_type_Gasoline',
        'interior_color_Mixed Colors',
        'interior_color_Other Color',
        'interior_color_Red',
        'interior_color_White',
        'make_name_BMW',
        'make_name_Cadillac',
        'make_name_Dodge',
        'make_name_Ford',
        'make_name_GMC',
        'make_name_Honda',
        'make_name_Hyundai',
        'make_name_Kia',
        'make_name_Lexus',
        'make_name_Mercedes-Benz',
        'make_name_Nissan',
        'make_name_Other',
        'make_name_RAM',
        'make_name_Volkswagen',
        'model_name_Altima',
        'model_name_Camry',
        'model_name_Civic',
        'model_name_Corolla',
        'model_name_Equinox',
        'model_name_Escape',
        'model_name_Explorer',
        'model_name_F-150',
        'model_name_Fusion',
        'model_name_Malibu',
        'model_name_Rogue',
        'model_name_Silverado 1500',
        'model_name_Trax',
        'seller_rating_3 stars',
        'seller_rating_4 stars',
        'transmission_CVT',
        'transmission_M',
        'wheel_system_4X2',
        'wheel_system_AWD',
        'wheel_system_FWD',
        'wheel_system_RWD',
    ]

    # logged price IQR
    # q1 = 9.899580001831055
    # q2 = 10.221759796142578
    # q3 = 10.572521209716797

    # exponential price IQR
    # q1 = 19922
    # q2 = 27495
    # q3 = 39047
    
    # price_iqr = {
    #     0: (0,19922),
    #     1: (19922,27495),
    #     2: (27495,39047),
    #     3: (39047,-1),
    # }
    
    def __init__(self):
        filepath = path.join(path.dirname(__file__), 'XGBOOSTClassifier.pickle')
        self.model = pickle.load(open(filepath, 'rb'))
    
    def predict(self, data):
        y_pred = self.model.predict(data)
        return int(y_pred[0])

    def get_request_data(self):
        horsepower = request.values.get('horsepower', type=float, default=170.0)
        torque = request.values.get('torque', type=float, default=264.0)
        mileage = request.values.get('mileage', type=float, default=20835.0)
        year = request.values.get('year', type=int, default=2018)
        daysonmarket = request.values.get('daysonmarket', type=float, default=36.0)
        maximum_seating = request.values.get('maximum_seating', type=int, default=4)
        savings_amount = request.values.get('savings_amount', type=float, default=0.0)
        combined_fuel_economy = request.values.get('combined_fuel_economy', type=float, default=26.0)
        legroom = request.values.get('legroom', type=float, default=79.0)
        major_options_count = request.values.get('major_options_count', type=int, default=0)
        seller_rating = request.values.get('seller_rating', type=int, default=4)
        length = request.values.get('length', type=float, default=190.0)
        width = request.values.get('width', type=float, default=72.0)
        height = request.values.get('height', type=float, default=66.0)
        wheelbase = request.values.get('wheelbase', type=float, default=111.0)
        fuel_tank_volume = request.values.get('fuel_tank_volume', type=float, default=26.0)
        has_incidents = request.values.get('has_incidents', type=int, default=0)
        engine_type = request.values.get('engine_type', type=int, default=3)
        make_name = request.values.get('make_name', type=int, default=4)
        body_type = request.values.get('body_type', type=int, default=3)
        wheel_system = request.values.get('wheel_system', type=int, default=1)
        model_name = request.values.get('model_name', type=int, default=8)
        fuel_type = request.values.get('fuel_type', type=int, default=1)
        transmission = request.values.get('transmission', type=int, default=1)
        exterior_color = request.values.get('exterior_color', type=int, default=1)
        interior_color = request.values.get('interior_color', type=int, default=1)

        return pd.DataFrame([[
            # 'daysonmarket': 36.0,
            daysonmarket,
            # 'has_incidents': 0.0,
            1 if has_incidents == 1 else 0,
            # 'horsepower': 228.0,
            horsepower,
            # 'maximum_seating': 5.0,
            maximum_seating,
            # 'mileage': 1099.0,
            mileage,
            # 'savings_amount': 0.0,
            savings_amount,
            # 'torque': 264.2731628417969,
            torque,
            # 'year': 2020.0,
            year,
            # 'combined_fuel_economy': 26.083271026611328,
            combined_fuel_economy,
            # 'legroom': 79.89999389648438,
            legroom,
            # 'major_options_count': 6.0,
            major_options_count,
            # 'size_of_vehicle': 456.5,
            # size_of_vehicle = length + width + height + wheelbase + fuel_tank_volume
            length + width + height + wheelbase + fuel_tank_volume,
            # 'body_type_Hatchback': 0.0,
            1 if body_type == 1 else 0,
            # 'body_type_Pickup Truck': 0.0,
            1 if body_type == 2 else 0,
            # 'body_type_SUV / Crossover': 0.0,
            1 if body_type == 3 else 0,
            # 'body_type_Sedan': 0.0,
            1 if body_type == 4 else 0,
            # 'body_type_Wagon': 0.0,
            1 if body_type == 5 else 0,
            # 'engine_type_Gasoline engine': 0.0,
            1 if engine_type == 1 else 0,
            # 'engine_type_H6': 0.0,
            1 if engine_type == 2 else 0,
            # 'engine_type_I4': 1.0,
            1 if engine_type == 3 else 0,
            # 'engine_type_I5': 0.0,
            1 if engine_type == 4 else 0,
            # 'engine_type_I6': 0.0,
            1 if engine_type == 5 else 0,
            # 'engine_type_V12': 0.0,
            1 if engine_type == 8 else 0,
            # 'engine_type_V6': 0.0,
            1 if engine_type == 6 else 0,
            # 'engine_type_V8': 0.0,
            1 if engine_type == 7 else 0,
            # 'exterior_color_Silver': 0.0,
            1 if exterior_color == 3 else 0,
            # 'exterior_color_White': 0.0,
            1 if exterior_color == 1 else 0,
            # 'fuel_type_Diesel': 0.0,
            1 if fuel_type == 2 else 0,
            # 'fuel_type_Gasoline': 1.0,
            1 if fuel_type == 1 else 0,
            # 'interior_color_Mixed Colors': 0.0,
            1 if interior_color == 14 else 0,
            # 'interior_color_Other Color': 0.0,
            1 if interior_color == 15 else 0,
            # 'interior_color_Red': 0.0,
            1 if interior_color == 5 else 0,
            # 'interior_color_White': 0.0,
            1 if interior_color == 1 else 0,
            # 'make_name_BMW': 0.0,
            1 if make_name == 1 else 0,
            # 'make_name_Cadillac': 0.0,
            1 if make_name == 2 else 0,
            # 'make_name_Dodge': 0.0,
            1 if make_name == 3 else 0,
            # 'make_name_Ford': 0.0,
            1 if make_name == 4 else 0,
            # 'make_name_GMC': 0.0,
            1 if make_name == 5 else 0,
            # 'make_name_Honda': 0.0,
            1 if make_name == 6 else 0,
            # 'make_name_Hyundai': 0.0,
            1 if make_name == 7 else 0,
            # 'make_name_Kia': 0.0,
            1 if make_name == 8 else 0,
            # 'make_name_Lexus': 0.0,
            1 if make_name == 9 else 0,
            # 'make_name_Mercedes-Benz': 0.0,
            1 if make_name == 10 else 0,
            # 'make_name_Nissan': 0.0,
            1 if make_name == 11 else 0,
            # 'make_name_Other': 0.0,
            1 if make_name == 14 else 0,
            # 'make_name_RAM': 0.0,
            1 if make_name == 12 else 0,
            # 'make_name_Volkswagen': 0.0,
            1 if make_name == 13 else 0,
            # 'model_name_Altima': 0.0,
            1 if model_name == 1 else 0,
            # 'model_name_Camry': 0.0,
            1 if model_name == 2 else 0,
            # 'model_name_Civic': 0.0,
            1 if model_name == 3 else 0,
            # 'model_name_Corolla': 0.0,
            1 if model_name == 4 else 0,
            # 'model_name_Equinox': 0.0,
            1 if model_name == 5 else 0,
            # 'model_name_Escape': 0.0,
            1 if model_name == 6 else 0,
            # 'model_name_Explorer': 0.0,
            1 if model_name == 7 else 0,
            # 'model_name_F-150': 0.0,
            1 if model_name == 8 else 0,
            # 'model_name_Fusion': 0.0,
            1 if model_name == 9 else 0,
            # 'model_name_Malibu': 0.0,
            1 if model_name == 10 else 0,
            # 'model_name_Rogue': 0.0,
            1 if model_name == 11 else 0,
            # 'model_name_Silverado 1500': 0.0,
            1 if model_name == 12 else 0,
            # 'model_name_Trax': 0.0,
            1 if model_name == 13 else 0,
            # 'seller_rating_3 stars': 0.0,
            1 if seller_rating == 3 else 0,
            # 'seller_rating_4 stars': 1.0,
            1 if seller_rating == 4 else 0,
            # 'transmission_CVT': 0.0,
            1 if transmission == 2 else 0,
            # 'transmission_M': 0.0,
            1 if transmission == 3 else 0,
            # 'wheel_system_4X2': 0.0,
            1 if wheel_system == 5 else 0,
            # 'wheel_system_AWD': 0.0,
            1 if wheel_system == 2 else 0,
            # 'wheel_system_FWD': 0.0,
            1 if wheel_system == 1 else 0,
            # 'wheel_system_RWD': 0.0
            1 if wheel_system == 4 else 0,
        ]],
        columns=XGBoostClassifierPredictor.cols)