import React from "react";
import { useTranslation } from "react-i18next";

const HomePage = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, gray)",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          padding: "40px 60px",
          borderRadius: "20px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          maxWidth: "500px",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
          {t("welcome")}
        </h1>
        <p style={{ fontSize: "1.1rem", marginBottom: "30px" }}>
          {t("description")}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
          <button
            onClick={() => changeLanguage("en")}
            style={{
              backgroundColor: "#fff",
              color: "#3b82f6",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#e0e7ff")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            English
          </button>

          <button
            onClick={() => changeLanguage("ar")}
            style={{
              backgroundColor: "#3b82f6",
              color: "#fff",
              border: "2px solid #fff",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
          >
            عربي
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;