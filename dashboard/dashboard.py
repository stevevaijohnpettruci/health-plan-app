from pathlib import Path

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
import streamlit as st

DATA_DIR = Path(__file__).resolve().parents[1] / "data"
RECIPE_DATA_PATH = DATA_DIR / "recipes_cleaned.csv"
USER_DATA_PATH = DATA_DIR / "synthetic_healthplan_users.csv"

st.set_page_config(
    page_title="HealthPlan EDA Dashboard",
    page_icon="📊",
    layout="wide"
)

@st.cache_data
def load_recipe_data():
    return pd.read_csv(RECIPE_DATA_PATH)

@st.cache_data
def load_user_data():
    return pd.read_csv(USER_DATA_PATH)

def extract_list_from_c_string(value):
    if not isinstance(value, str) or not value:
        return []
    text = value.strip()
    if text.startswith('c("') and text.endswith('")'):
        text = text[3:-2]
    return [item.strip().lower() for item in text.split('", "') if item.strip()]

ALLERGEN_KEYWORDS = {
    "Telur": ["telur", "egg"],
    "Susu": ["susu", "milk", "dairy", "keju", "cheese", "mentega", "butter"],
    "Gluten": ["gluten", "gandum", "wheat", "tepung terigu", "flour", "roti", "bread"],
    "Kedelai": ["kedelai", "soy", "tofu", "tempeh"],
    "Kacang Tanah": ["kacang tanah", "peanut", "kacang"],
    "Seafood": ["seafood", "ikan", "fish", "udang", "shrimp", "kepiting", "crab", "kerang", "shellfish", "cumi", "squid"]
}


def get_allergen_flags(df):
    for label, keywords in ALLERGEN_KEYWORDS.items():
        col_name = f"has_{label.lower().replace(' ', '_')}"
        df[col_name] = df["RecipeIngredientParts"].fillna("").apply(
            lambda value: any(
                any(keyword in ingredient for keyword in keywords)
                for ingredient in extract_list_from_c_string(value)
            )
        )
    df["has_any_allergen"] = df[[f"has_{label.lower().replace(' ', '_')}" for label in ALLERGEN_KEYWORDS]].any(axis=1)
    return df


def categorize_health(row):
    healthy_criteria = 0
    unhealthy_criteria = 0

    if row["calories"] <= 200:
        healthy_criteria += 1
    if row["fat"] <= 5:
        healthy_criteria += 1
    if row["saturated_fat"] <= 1.5:
        healthy_criteria += 1
    if row["cholesterol"] <= 20:
        healthy_criteria += 1
    if row["sodium"] <= 140:
        healthy_criteria += 1
    if row["sugar"] <= 5:
        healthy_criteria += 1
    if row["protein"] >= 5:
        healthy_criteria += 1
    if row["fiber"] >= 2:
        healthy_criteria += 1

    if row["calories"] > 400:
        unhealthy_criteria += 1
    if row["fat"] > 15:
        unhealthy_criteria += 1
    if row["saturated_fat"] > 5:
        unhealthy_criteria += 1
    if row["cholesterol"] > 60:
        unhealthy_criteria += 1
    if row["sodium"] > 400:
        unhealthy_criteria += 1
    if row["sugar"] > 15:
        unhealthy_criteria += 1

    if healthy_criteria >= 6:
        return "Healthy"
    if unhealthy_criteria >= 3:
        return "Unhealthy"
    return "Moderate"


def plot_top_categories(df, title):
    category_counts = df["RecipeCategory"].value_counts().head(10)
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.barplot(x=category_counts.values, y=category_counts.index, palette="viridis", ax=ax)
    ax.set_title(title)
    ax.set_xlabel("Jumlah Resep")
    ax.set_ylabel("Kategori Resep")
    return fig


def main():
    st.title("HealthPlan EDA Dashboard")
    st.markdown(
        "Dashboard interaktif ini menyajikan jawaban bisnis dari analisis ``recipes_cleaned.csv`` dan ``synthetic_healthplan_users.csv``."
    )

    recipes = load_recipe_data()
    users = load_user_data()
    recipes = get_allergen_flags(recipes)
    recipes["HealthCategory"] = recipes.apply(categorize_health, axis=1)

    with st.sidebar:
        st.header("Filter Interaktif")
        cal_threshold = st.slider(
            "Ambang Batas Kalori AKG (per porsi)",
            min_value=300,
            max_value=800,
            value=600,
            step=50,
        )
        time_threshold = st.slider(
            "Ambang Batas Total Waktu (menit)",
            min_value=15,
            max_value=120,
            value=60,
            step=5,
        )
        weight_loss_range = st.slider(
            "Rentang Kalori untuk Rekomendasi Weight Loss",
            min_value=100,
            max_value=700,
            value=(100, 500),
            step=25,
        )
        st.markdown("---")
        st.markdown("Data resep dan pengguna diambil dari Kaggle.com, yang telah dibersihkan dan disiapkan untuk analisis.")

    st.header("1. Resep AKG Cepat Saji")
    filtered_akg = recipes[
        (recipes["calories"] <= cal_threshold)
        & (recipes["total_time"] < time_threshold)
    ]
    col1, col2, col3 = st.columns(3)
    col1.metric("Resep yang Memenuhi Kriteria", f"{len(filtered_akg):,}")
    col2.metric("Ambang Kalori", f"≤ {cal_threshold} kkal")
    col3.metric("Ambang Waktu", f"< {time_threshold} menit")

    st.markdown(
        "Resep yang memenuhi kriteria AKG ini menunjukkan potensi menu cepat dan bergizi untuk pengguna HealthPlan."
    )
    st.pyplot(plot_top_categories(filtered_akg, "Top 10 Kategori Resep AKG Cepat Saji"))

    if not filtered_akg.empty:
        st.subheader("Contoh Resep")
        st.dataframe(
            filtered_akg[
                ["recipe_name", "calories", "total_time", "RecipeCategory"]
            ]
            .sort_values("calories")
            .head(10)
            .reset_index(drop=True)
        )
    st.markdown(
        "Berdasarkan kriteria filter yang telah diperbarui (kalori minimal 600 kkal per porsi dan total waktu memasak kurang dari 60 menit), ditemukan **180.457 resep** yang memenuhi standar tersebut. Jumlah ini menunjukkan bahwa ada banyak pilihan resep yang relatif cepat untuk disiapkan dan memiliki kandungan kalori yang memadai.\n"
        "Visualisasi pie chart dari kategori resep teratas dari data yang terfilter memberikan gambaran tentang jenis resep yang paling sering muncul dalam kriteria ini. Ini dapat memberikan gambaran awal tentang ketersediaan resep cepat saji dengan kalori yang sesuai. Dengan adanya 10 kategori teratas dan pengelompokan 'Lain-lain', kita bisa melihat dominasi kategori tertentu atau keberagaman resep secara umum.\n"
        "**Kesimpulan**:\n" \
        "Sejumlah besar resep memenuhi kriteria kalori minimal 600 kkal dan total waktu memasak kurang dari 60 menit, menunjukkan potensi besar untuk menyajikan rekomendasi cepat dan bergizi. Analisis kategori lebih lanjut akan membantu dalam memahami tren dan preferensi pengguna dalam konteks resep cepat saji dan berkalori cukup."
    )
    
    st.header("2. Rekomendasi Berat Badan: Kalori 100-500 kkal")
    weight_loss_filtered = recipes[
        (recipes["calories"] >= weight_loss_range[0])
        & (recipes["calories"] <= weight_loss_range[1])
    ]
    col1, col2, col3 = st.columns(3)
    col1.metric("Resep Tersedia", f"{len(weight_loss_filtered):,}")
    col2.metric("Rentang Kalori", f"{weight_loss_range[0]}-{weight_loss_range[1]} kkal")
    col3.metric("Rata-rata Total Waktu", f"{weight_loss_filtered['total_time'].mean():.1f} menit" if not weight_loss_filtered.empty else "-")

    st.pyplot(plot_top_categories(weight_loss_filtered, "Top 10 Kategori Resep untuk Weight Loss"))
    if not weight_loss_filtered.empty:
        st.subheader("Contoh Resep Weight Loss")
        st.dataframe(
            weight_loss_filtered[
                ["recipe_name", "calories", "total_time", "RecipeCategory"]
            ]
            .sort_values("calories")
            .head(10)
            .reset_index(drop=True)
        )

    st.markdown(
        "Berdasarkan filter resep dengan kalori antara 100-500 kkal per porsi, ditemukan 50.235 resep yang dapat direkomendasikan untuk pengguna yang ingin menurunkan berat badan. Jumlah resep ini cukup signifikan untuk memberikan variasi pilihan kepada pengguna.\n"
        "Visualisasi bar chart menunjukkan kategori resep yang paling umum dalam kelompok ini. Kategori seperti 'One Dish Meal', 'Lunch/Snacks', dan 'Chicken' mendominasi, menunjukkan bahwa resep untuk makan siang/makan malam yang mudah dan berbahan dasar ayam atau hidangan lengkap sangat populer dalam rentang kalori ini."    
    )
    st.markdown(
        "**Kesimpulan**:\n" \
        "Terdapat banyak resep yang memenuhi kriteria kalori 100-500 kkal per porsi, menjadikannya pilihan yang sangat baik untuk rekomendasi penurunan berat badan. Dengan menganalisis kategori resep ini, platform HealthPlan dapat secara efektif merekomendasikan hidangan yang bervariasi dan sesuai dengan tujuan diet pengguna. Untuk rekomendasi yang lebih personal, integrasi dengan preferensi pengguna (misalnya, bahan yang disukai atau alergi) akan sangat bermanfaat."
    )

    st.header("3. Risiko Alergen dalam Resep")
    allergen_counts = {
        label: int(recipes[f"has_{label.lower().replace(' ', '_')}"].sum())
        for label in ALLERGEN_KEYWORDS
    }
    allergen_df = pd.Series(allergen_counts, name="Jumlah Resep").sort_values(ascending=False)
    st.bar_chart(allergen_df)
    st.markdown(
        "Berdasarkan analisis, ditemukan sejumlah besar resep yang mengandung setidaknya satu jenis alergen. Visualisasi menunjukkan distribusi resep untuk setiap kategori alergen (telur, susu, gluten, kedelai, kacang tanah, seafood)."  
    )
    st.markdown(
        "**Insight Risiko Alergen:**\n"
        "- Alergen seperti susu, gluten, dan telur terlihat paling sering muncul dalam dataset resep ini, menunjukkan bahwa bahan-bahan ini umum digunakan.\n"
        "- Platform HealthPlan dapat menggunakan informasi ini untuk menyaring resep atau memberikan peringatan kepada pengguna yang memiliki alergi spesifik, meningkatkan pengalaman personalisasi dan keamanan.\n"
    )

    st.header("4. Korelasi Waktu Persiapan dan Memasak")
    corr_value = recipes[["PrepTimeMinutes", "CookTimeMinutes"]].corr().iloc[0, 1]
    st.metric("Korelasi Prep vs Cook", f"{corr_value:.2f}")
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.scatterplot(
        x="PrepTimeMinutes",
        y="CookTimeMinutes",
        data=recipes,
        alpha=0.3,
        edgecolor=None,
        ax=ax,
    )
    ax.set_title("Scatter Plot: PrepTimeMinutes vs CookTimeMinutes")
    ax.set_xlabel("Waktu Persiapan (menit)")
    ax.set_ylabel("Waktu Memasak (menit)")
    st.pyplot(fig)

    # Tambahkan heatmap korelasi sesuai isi EDA Final
    st.subheader("Heatmap Korelasi Fitur Nutrisi & Waktu")
    corr_cols = [
        "calories",
        "fat",
        "saturated_fat",
        "cholesterol",
        "sodium",
        "sugar",
        "protein",
        "fiber",
        "PrepTimeMinutes",
        "CookTimeMinutes",
        "total_time",
    ]
    available_cols = [c for c in corr_cols if c in recipes.columns]
    if len(available_cols) >= 2:
        corr = recipes[available_cols].corr()
        fig2, ax2 = plt.subplots(figsize=(10, 8))
        sns.heatmap(corr, annot=True, fmt=".2f", cmap="vlag", center=0, ax=ax2)
        ax2.set_title("Heatmap Korelasi: Fitur Nutrisi & Waktu")
        st.pyplot(fig2)
    else:
        st.info("Tidak cukup kolom numerik untuk membuat heatmap korelasi.")
    st.markdown(
        "Berdasarkan matriks korelasi yang telah kita buat sebelumnya, **korelasi antara `PrepTimeMinutes` dan `CookTimeMinutes` adalah positif, namun tidak terlalu signifikan, yaitu sekitar 0.18**. Ini menunjukkan bahwa ada sedikit kecenderungan resep dengan waktu persiapan yang lebih lama juga memiliki waktu memasak yang lebih lama, tetapi hubungannya lemah.\n"
        "Dari scatter plot hubungan antara Waktu Persiapan dan Waktu Memasak, kita dapat melihat bahwa titik-titik data tersebar cukup luas. Meskipun ada konsentrasi data pada durasi waktu yang lebih pendek untuk kedua variabel, tidak ada pola linier yang kuat yang menunjukkan korelasi tinggi. Artinya, waktu yang dihabiskan untuk persiapan tidak selalu berbanding lurus dengan waktu yang dibutuhkan untuk memasak.\n"
        "Histori distribusi `CookTimeMinutes` dan `PrepTimeMinutes` menunjukkan bahwa sebagian besar resep memiliki waktu persiapan dan waktu memasak yang relatif singkat, dengan puncaknya berada di bawah 60 menit untuk waktu memasak dan di bawah 30 menit untuk waktu persiapan.\n"
    )    
    st.markdown(
        "**Insight Korelasi:**\n"
        "- Untuk calon pengguna HealthPlan, informasi ini berarti bahwa mereka tidak perlu khawatir bahwa resep dengan waktu persiapan singkat pasti akan memiliki waktu memasak yang panjang, atau sebaliknya.\n"
        "- Platform dapat merekomendasikan resep yang 'cepat saji' secara keseluruhan (total waktu rendah) tanpa harus mengorbankan waktu persiapan atau memasak secara spesifik, karena keduanya tidak saling terikat secara kuat.\n"
    )

    st.header("5. Kategori Kesehatan Resep")
    health_counts = recipes["HealthCategory"].value_counts()
    st.bar_chart(health_counts)
    st.markdown(
        "**Insight Kategori Kesehatan:**\n"
        "- Hanya ada 2 kategori yang ditampilkan, yaitu **Healthy** dan **Moderate**. Hal ini terjadi karena data cleaning sebelumnya telah menghapus menu makanan yang tergolong tidak sehat.\n"
        "- Terdapat **170.244 menu makanan** yang tergolong **'Healthy'** dengan nutrisi seimbang dan memenuhi standar AKG.\n"
        "- Terdapat **94.606 menu makanan** yang tergolong **'Moderate'** dengan profil nutrisi yang dapat disesuaikan.\n"
        "- Dengan jumlah resep sehat hingga ratusan ribu, dataset ini cukup untuk memberikan rekomendasi beragam kepada pengguna HealthPlan."
    )

    st.header("6. Dataset Pengguna Sintetis")
    col1, col2, col3 = st.columns(3)
    overweight_pct = (users["BMI"] > 25).mean() * 100
    col1.metric("Persentase BMI > 25", f"{overweight_pct:.1f}%")
    col2.metric("Jumlah Pengguna", f"{len(users):,}")
    col3.metric("Rata-rata Target Kalori", f"{users['calorie_target_derived'].mean():.0f} kkal")

    st.subheader("Distribusi Tujuan Utama Pengguna")
    st.bar_chart(users["primary_goal"].value_counts())

    st.subheader("Rata-rata Target Kalori per Tujuan")
    st.bar_chart(users.groupby("primary_goal")["calorie_target_derived"].mean())

    st.subheader("Distribusi BMI Pengguna")
    fig, ax = plt.subplots(figsize=(10, 4))
    sns.histplot(users["BMI"], bins=30, kde=True, ax=ax)
    ax.set_title("Distribusi BMI Pengguna Sintetis")
    ax.set_xlabel("BMI")
    ax.set_ylabel("Frekuensi")
    st.pyplot(fig)

    st.subheader("Profil Demografis berdasarkan Gender dan Goal")
    goal_gender = users["primary_goal"].groupby(users["gender"]).value_counts().unstack(fill_value=0)
    st.dataframe(goal_gender)

    st.subheader("Sampel Pengguna")
    st.dataframe(users.sample(10, random_state=42).reset_index(drop=True))

    st.markdown(
        "---"
    )
    st.markdown(
        "### Catatan"
        "\n- Gunakan filter di sidebar untuk menyesuaikan ambang kalori dan waktu pada analisis resep."
        "\n- Dashboard ini menampilkan jawaban langsung untuk pertanyaan bisnis utama yang sudah dianalisis dalam EDA."  
    )


if __name__ == "__main__":
    main()