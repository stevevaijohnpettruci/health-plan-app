# HealthPlan AI Recommendation System

HealthPlan AI Recommendation System is a deep learning–based personalized food recommendation system developed using TensorFlow Functional API and custom training loop with `tf.GradientTape`.

This project focuses on generating personalized healthy food recommendations based on:

* User health profile
* Nutritional needs
* Dietary restrictions
* Allergies
* Health conditions
* Personal fitness goals

The model predicts a recommendation score between user features and recipe features to generate personalized meal recommendations.

---

# Features

## Personalized Recommendation

Generate personalized food recommendations based on:

* Age
* BMI
* TDEE
* Blood pressure
* Heart rate
* Sleep quality
* Activity level
* Health conditions
* Fitness goals

---

## Health-Aware Recommendation

Supports filtering and recommendation adjustment for:

* Diabetes
* Hypertension
* High cholesterol
* Asthma

---

## Allergy Filtering

The system can avoid recipes containing:

* Milk
* Peanut
* Gluten
* Egg
* Soy
* Seafood

---

## Nutrition-Based Recommendation

Recommendation considers:

* Calories
* Protein
* Carbohydrates
* Fiber
* Sugar
* Sodium
* Saturated fat ratio

---

## Goal-Based Recommendation

Supports multiple goals:

* Healthy Lifestyle
* Weight Loss
* Muscle Gain
* Maintenance

---

## Deep Learning Recommendation Model

Built using:

* TensorFlow Functional API
* Custom Feature Cross Layer
* Dense Neural Network
* Batch Normalization
* Dropout Regularization

---

## Custom Training Loop

Implements:

* `tf.GradientTape`
* Manual forward pass
* Manual loss computation
* Manual gradient update
* Custom validation loop

---

# Project Structure

```bash
AI_FIX/
│
├── app/
│   ├── __pycache__/
│   ├── artifacts/
│   │   ├── best_model.keras
│   │   ├── feature_order.pkl
│   │   ├── feature_scaler.pkl
│   │   ├── recipe_features_api.csv
│   │   └── scale_cols.pkl
│   │
│   ├── __init__.py
│   ├── main.py
│   ├── predictor.py
│   ├── preprocess.py
│   ├── requirements.txt
│   └── schemas.py
│
├── .gitignore
├── README.md
├── notebook_fix.ipynb
└── requirements.txt
```

---

# Technologies Used

* Python
* TensorFlow
* Keras
* Pandas
* NumPy
* Scikit-learn
* FastAPI

---

# Model Architecture

The recommendation model uses:

* Dual Input Architecture
* User Feature Encoder
* Recipe Feature Encoder
* Feature Cross Layer
* Fully Connected Layers

Input:

* 44 User Features
* 21 Recipe Features

Output:

* Recommendation Score

---

# Recommendation Pipeline

The inference pipeline:

1. Receive user profile
2. Preprocess user features
3. Prepare recipe features
4. Scale numerical features
5. Predict recommendation score
6. Rank recipes
7. Return top recommendations

---

# Setup Installation

## Clone Repository

```bash
git clone https://github.com/stevevaijohnpettruci/health-plan-app.git
```

---

## Move Into Project

```bash
cd health-plan-app
```

---

# Create Virtual Environment

## Windows

```bash
python -m venv venv
venv\Scripts\activate
```

---

## Linux / MacOS

```bash
python3 -m venv venv
source venv/bin/activate
```

---

# Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Run FastAPI Server

Move into app folder:

```bash
cd app
```

Run server:

```bash
uvicorn main:app --reload
```

---

# API Documentation

After server starts:

Swagger UI:

```text
http://127.0.0.1:8000/docs
```

ReDoc:

```text
http://127.0.0.1:8000/redoc
```

---

# Example User Input

```json
{
  "age": 28,
  "height": 170,
  "BMI": 24.5,
  "blood_pressure_systolic": 118,
  "blood_pressure_diastolic": 76,
  "heart_rate": 72,
  "daily_water_intake_goal": 2500,
  "avg_sleep_hours": 7.5,
  "target_weight_kg": 68,
  "TDEE": 2200,
  "activity_score": 3,
  "water_ml_per_kg": 35,
  "calorie_gap": -250,
  "calorie_target_ratio": 0.88,
  "target_weight_change": -4,
  "target_weight_change_pct": -5.5,
  "health_risk_score": 0,

  "activity_level_encoded": 2,
  "sleep_quality_encoded": 1,

  "has_diabetes": 1,
  "has_hypertension": 0,
  "has_asthma": 0,
  "has_high_cholesterol": 0,
  "no_medical_history": 0,

  "allergy_Egg": 0,
  "allergy_Gluten": 0,
  "allergy_Milk": 1,
  "allergy_Peanut": 1,
  "allergy_Seafood": 0,
  "allergy_Soy": 0,

  "primary_goal_Healthy Lifestyle": 1,
  "primary_goal_Maintenance": 0,
  "primary_goal_Muscle Gain": 0,
  "primary_goal_Weight Loss": 0,

  "dietary_restriction_Balanced": 0,
  "dietary_restriction_High Protein": 0,
  "dietary_restriction_Low Calorie": 1,
  "dietary_restriction_Low Sodium": 0,
  "dietary_restriction_Low Sugar": 0
}
```

---

# Training Result

The model was trained using:

* TensorFlow Functional API
* Custom FeatureCrossLayer
* Custom Training Loop with `tf.GradientTape`

Final performance:

* Validation MAE ≈ 0.02
* Validation RMSE ≈ 0.03

---

# Important Notes

* The preprocessing pipeline used during inference must be identical to the training pipeline.
* Feature order consistency is critical.
* Scaling must use the same saved scaler artifact from training.
* User and recipe features must be concatenated before scaling.

---

# Author

Developed for:
HealthPlan AI Personalized Recommendation System Project
