/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#ffffff',
        'dark-card': '#f5f5f5',
        'dark-input': '#e8e8e8',
        primary: '#ff8c00',
        'primary-dark': '#ff7a00',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      }
    },
  },
  plugins: [],
}
