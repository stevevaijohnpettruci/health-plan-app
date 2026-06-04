# EDA: Food.com - Recipes and Reviews

---

## ID Tim CC26-PRU427

---

## Tim Data Science:
- CDCC319D6Y2516 Jeremia Hasudungan Sitinjak
- CDCC180D6X2400 Nesya Dwi Cahyani

---

## Deskripsi Proyek

Proyek ini menganalisis dataset peminjaman sepeda dari sistem Capital Bikeshare di Washington D.C., USA. Dataset mencakup data historis penggunaan rental sepeda selama periode 2 tahun (2011-2012) yang diaggregasi berdasarkan per jam dan per hari.

Analisis ini bertujuan untuk menemukan pola dan faktor-faktor yang mempengaruhi penggunaan layanan bike-sharing, termasuk pengaruh musim, cuaca, jam operasional, dan hari kerja.

Dataset Resep: https://www.kaggle.com/datasets/irkaal/foodcom-recipes-and-reviews?select=recipes.csv

"The recipes dataset contains 522,517 recipes from 312 different categories. This dataset provides information about each recipe like cooking times, servings, ingredients, nutrition, instructions, and more.
The reviews dataset contains 1,401,982 reviews from 271,907 different users. This dataset provides information about the author, rating, review text, and more."

---

Proyek ini mengeksplorasi mengenai resep-resep yang ada dalam dataset Food.com Recipes and Reviews, yang merupakan hasil dari data scraping publik yang dipublikasikan di Kaggle.com untuk digunakan sesuai kebutuhan.

---

## Dataset

Dataset terdiri dari 4 file CSV:

### recipes.csv
- Ukuran 522,517 baris x 27 kolom
- File .csv mentah yang diambil langsung dari Kaggle.
- Source: https://www.kaggle.com/datasets/irkaal/foodcom-recipes-and-reviews?select=recipes.csv
- Link: https://drive.google.com/file/d/1g4PmMZjmPjT_5WOSZ7V8APUkXzj6rAy9/view?usp=sharing

### recipes_cleaned.csv
- Ukuran 264,850 x 22 kolom
- File .csv yang telah dibersihkan dan siap diproses lebih lanjut oleh tim AI.
- Link: https://drive.google.com/file/d/1AIpa2G3wkdhNNWY9JgK9guiXeehQZwgH/view?usp=sharing

### synthetic_healthplan_users.csv
- Ukuran 10,000 baris x 21 kolom 32
- File sintetis yang dibuat sesuai instruksi tim AI, guna kebutuhan pelatihan model.
- Link: https://drive.google.com/file/d/1rZexLOM6crsp84yu59px0ZxYDUBFT27j/view?usp=sharing

### synthetic_healthplan_users_eda.csv
- Ukuran 10,000 baris x 32 kolom
- File siap digunakan untuk proses EDA lanjut dan modelling oleh tim AI.
- Link: https://drive.google.com/file/d/12LFkMqANJYeMRmzriS3pWDB_sQSfrKT-/view?usp=sharing

---

## Instalasi dan Cara Menjalankan

### Prasyarat

- Python 3.7 atau lebih tinggi
- pip (package manager)

### Langkah 1: Instal Dependencies

```bash
pip install -r requirements.txt
```

### Langkah 2: Jalankan Notebook (Analisis Lengkap)

```bash
jupyter notebook EDA Final.ipynb
```

### Langkah 3: Jalankan Dashboard Interaktif

```bash
python -m streamlit run dashboard/dashboard.py
```

Dashboard akan terbuka di browser di alamat: http://localhost:8501

---
