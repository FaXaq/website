import { useTranslation } from "react-i18next";
import LocaleSelector from "../components/locale-selector";
import Header from "../components/header";
import Mountains from "../components/images/mountains";
import Footer from "../components/footer";

function HomePage() {
  const { t } = useTranslation();
  return (
    <div className="font-sans">
      <Header />
      <div className="rotate-180">
        <Mountains />
      </div>
      <div className="container px-4 md:px-0"></div>
      <Footer />
      <div className="fixed bottom-0 right-0">
        <LocaleSelector />
      </div>
    </div>
  );
}

export default HomePage;
