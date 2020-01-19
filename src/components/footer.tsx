import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-light-sand text-dark-sand">
      <div className="container px-4 lg:px-0 py-6 mx-auto text-xl">
        <p>
          {t("copy")}
          <a target="_blank" href="https://github.com/faxaq/website">
            github
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
