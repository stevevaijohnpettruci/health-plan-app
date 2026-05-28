# health-plan-app
Health Plan App adalah aplikasi berbasis AI yang dirancang untuk membantu pengguna merencanakan dan mengelola gaya hidup sehat secara personal. Aplikasi ini mengintegrasikan kecerdasan buatan untuk memberikan rekomendasi kesehatan yang disesuaikan dengan kebutuhan, kondisi, dan tujuan masing-masing pengguna. 

# HealthPlan AI Model
Folder ini berisi seluruh artefak model machine learning untuk sistem rekomendasi makanan pada aplikasi Health Plan App.

## Struktur Folder
├── artifacts/
│   ├── feature_scaler.pkl
│   ├── food_recommendation_model.keras
│   ├── recipe_cols.pkl
│   ├── recipe_features_api.csv
│   ├── scale_cols.pkl
│   └── user_cols.pkl
├── notebook.ipynb
├── requirements.txt
└── README.md

## Deskripsi File

### `food_recommendation_model.keras`

Model deep learning utama untuk sistem rekomendasi makanan personalisasi.
Model digunakan untuk:
* memprediksi kecocokan menu makanan,
* menghasilkan rekomendasi berdasarkan profil pengguna,
* mendukung rekomendasi berdasarkan kebutuhan kesehatan dan preferensi diet.

### `feature_scaler.pkl`
Scaler preprocessing yang digunakan untuk normalisasi fitur numerik sebelum inferensi model.
Digunakan agar:
* distribusi data konsisten,
* input inference sesuai dengan data training.

### `recipe_features_api.csv`
Dataset fitur makanan yang digunakan pada proses inference dan integrasi API. Data dari file inilah yang akan diambil ketika melakukan prediksi.
Berisi informasi seperti:
* nutrisi makanan,
* kategori meal type,
* kalori,
* protein,
* lemak,
* karbohidrat,
* dan fitur lain yang digunakan model.

### `recipe_cols.pkl`
Daftar kolom fitur recipe yang digunakan model saat preprocessing dan inference.

### `scale_cols.pkl`
Daftar kolom numerik yang perlu dilakukan scaling sebelum diproses model.

### `user_cols.pkl`
Daftar kolom profil pengguna yang digunakan sebagai input sistem rekomendasi.

### `notebook.ipynb`
Notebook utama untuk:
* preprocessing data,
* training model,
* evaluasi model,
* inference dan pengujian sistem rekomendasi.

### `requirements.txt`
Daftar dependency Python yang dibutuhkan untuk menjalankan project.

## Teknologi yang Digunakan

* Python
* TensorFlow / Keras
* Pandas
* NumPy
* Scikit-learn
* Joblib
