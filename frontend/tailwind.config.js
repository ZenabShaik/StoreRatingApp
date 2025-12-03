module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5",
        secondary: "#06B6D4",
        accent: "#F59E0B",
        success: "#10B981",
        danger: "#F43F5E",
        dark: "#020617",
        surface: "#F8FAFC",
        glass: "rgba(255,255,255,0.65)",
      },
      boxShadow: {
        glow: "0 0 25px rgba(79,70,229,0.45)",
        soft: "0 10px 30px rgba(0,0,0,0.08)",
      },
      backdropBlur: {
        glass: "20px",
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
