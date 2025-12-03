import React from "react";
import i18n from "../i18n";

export default function LanguageSwitcher() {
  const changeLang = (lng) => {
    console.log("Switching language to:", lng);
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => changeLang("en")}>🇬🇧</button>
      <button onClick={() => changeLang("de")}>🇩🇪</button>
      <button onClick={() => changeLang("es")}>🇪🇸</button>
      <button onClick={() => changeLang("fr")}>🇫🇷</button>
    </div>
  );
}
