import { useTranslation } from "react-i18next";
import { useState } from "react";

function LocaleSelector() {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(i18n.language);
  const fallbackLocales = [];

  for (let l of i18n.languages.sort()) {
    const classes = ["p-1"];
    if (i18n.language === l) classes.push("text-red-500");

    fallbackLocales.push(
      <div
        className={classes.join(" ")}
        onClick={() => {
          i18n.changeLanguage(l);
        }}
      >
        {l}
      </div>
    );
  }

  return (
    <div className="border rounded border-gray-500 flex flex-row cursor-pointer">
      {fallbackLocales}
    </div>
  );
}

export default LocaleSelector;
