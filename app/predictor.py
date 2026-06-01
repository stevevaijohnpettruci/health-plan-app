# predictor.py

import re
import tensorflow as tf
import pandas as pd

from app.preprocess import (
    preprocess_for_inference
)

import tensorflow as tf


@tf.keras.utils.register_keras_serializable()
class FeatureCrossLayer(
    tf.keras.layers.Layer
):

    def call(
        self,
        inputs
    ):

        user_vec, recipe_vec = inputs

        cross = tf.multiply(
            user_vec,
            recipe_vec
        )

        return tf.concat(
            [
                user_vec,
                recipe_vec,
                cross
            ],
            axis=-1
        )

# =========================================================
# MODEL PATH
# =========================================================

MODEL_PATH = (
    "app/artifacts/best_model.keras"
)

model = tf.keras.models.load_model(
    MODEL_PATH,
    custom_objects={
        "FeatureCrossLayer":
            FeatureCrossLayer
    }
)


# =========================================================
# EXTRACT FIRST IMAGE
# =========================================================

def extract_first_image(
    image_text
):

    if pd.isna(image_text):

        return None

    urls = re.findall(
        r'https://[^\s,"\)]+',
        str(image_text)
    )

    return (
        urls[0]
        if urls
        else None
    )


# =========================================================
# NUTRITION SUMMARY
# =========================================================

def build_nutrition_summary(
    row
):

    return (

        f"Calories: {round(row['calories'], 2)} kcal | "

        f"Protein: {round(row['protein'], 2)} g | "

        f"Carbs: {round(row['carbs'], 2)} g | "

        f"Fat: {round(row['fat'], 2)} g | "

        f"Fiber: {round(row['fiber'], 2)} g"
    )


# =========================================================
# RECOMMENDATION REASON
# =========================================================

def build_recommendation_reason(
    row
):

    reasons = []

    # High Protein
    if row.get(
        "protein", 0
    ) >= 20:

        reasons.append(
            "High Protein"
        )

    # High Fiber
    if row.get(
        "fiber", 0
    ) >= 8:

        reasons.append(
            "High Fiber"
        )

    # Low Sugar
    if row.get(
        "sugar", 999
    ) <= 5:

        reasons.append(
            "Low Sugar"
        )

    # Low Sodium
    if row.get(
        "sodium", 9999
    ) <= 500:

        reasons.append(
            "Low Sodium"
        )

    # Low Calorie
    if row.get(
        "calories", 9999
    ) <= 400:

        reasons.append(
            "Low Calorie"
        )

    if len(reasons) == 0:

        return (
            "Balanced Nutrition"
        )

    return ", ".join(reasons)


# =========================================================
# MAIN PREDICTION FUNCTION
# =========================================================

def recommend_recipes(
    user_dict,
    top_k=10
):

    # =====================================================
    # PREPROCESS
    # =====================================================

    (
        X_user,
        X_recipe,
        filtered_recipe_df
    ) = preprocess_for_inference(
        user_dict
    )

    # =====================================================
    # EMPTY CHECK
    # =====================================================

    if (
        X_user is None
        or X_recipe is None
        or len(filtered_recipe_df) == 0
    ):

        return []

    # =====================================================
    # MODEL PREDICTION
    # =====================================================

    predictions = model.predict(
        [
            X_user,
            X_recipe
        ],
        verbose=0
    ).flatten()

    # =====================================================
    # CLIP SIGMOID OUTPUT
    # =====================================================

    predictions = predictions.clip(
        0,
        1
    )

    # =====================================================
    # SAVE SCORES
    # =====================================================

    result_df = (
        filtered_recipe_df.copy()
    )

    result_df[
        "recommendation_score"
    ] = predictions

    # =====================================================
    # SORT TOP K
    # =====================================================

    result_df = (
        result_df
        .sort_values(
            by="recommendation_score",
            ascending=False
        )
        .head(top_k)
        .reset_index(drop=True)
    )

    # =====================================================
    # BUILD JSON RESPONSE
    # =====================================================

    response = []

    for _, row in result_df.iterrows():

        recipe_json = {

            # =============================================
            # BASIC INFO
            # =============================================

            "recipe_id":
                int(
                    row["recipe_id"]
                ),

            "recipe_name":
                row.get(
                    "recipe_name"
                ),

            "recommendation_score":
                round(
                    float(
                        row[
                            "recommendation_score"
                        ]
                    ),
                    6
                ),

            # =============================================
            # NUTRITION SUMMARY
            # =============================================

            "nutrition_summary":
                build_nutrition_summary(
                    row
                ),

            "recommendation_reason":
                build_recommendation_reason(
                    row
                ),

            # =============================================
            # NUTRITION DETAIL
            # =============================================

            "calories":
                float(
                    row.get(
                        "calories", 0
                    )
                ),

            "protein":
                float(
                    row.get(
                        "protein", 0
                    )
                ),

            "fat":
                float(
                    row.get(
                        "fat", 0
                    )
                ),

            "carbs":
                float(
                    row.get(
                        "carbs", 0
                    )
                ),

            "fiber":
                float(
                    row.get(
                        "fiber", 0
                    )
                ),

            "sugar":
                float(
                    row.get(
                        "sugar", 0
                    )
                ),

            "sodium":
                float(
                    row.get(
                        "sodium", 0
                    )
                ),

            "cholesterol":
                float(
                    row.get(
                        "cholesterol", 0
                    )
                ),

            # =============================================
            # COOKING INFO
            # =============================================

            "PrepTimeMinutes":
                float(
                    row.get(
                        "PrepTimeMinutes", 0
                    )
                ),

            "CookTimeMinutes":
                float(
                    row.get(
                        "CookTimeMinutes", 0
                    )
                ),

            "total_time":
                float(
                    row.get(
                        "total_time", 0
                    )
                ),

            "RecipeServings":
                float(
                    row.get(
                        "RecipeServings", 0
                    )
                ),

            # =============================================
            # DESCRIPTION
            # =============================================

            "Description":
                row.get(
                    "Description"
                ),

            "RecipeIngredientParts":
                row.get(
                    "RecipeIngredientParts"
                ),

            "RecipeInstructions":
                row.get(
                    "RecipeInstructions"
                ),

            # =============================================
            # IMAGE
            # =============================================

            "image_url":
                row.get(
                    "image_url"
                )
        }

        response.append(
            recipe_json
        )

    return response