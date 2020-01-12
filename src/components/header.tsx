import Mountains from "./images/mountains";
import { useTranslation } from "react-i18next";
import Anime from "react-anime";

function Header() {
  const { t } = useTranslation();
  return (
    <header className="py-32 md:py-64 max-h-screen relative bg-dark-marine w-full">
      <div className="container h-full px-4 lg:px-0 mx-auto flex flex-col justify-center">
        <Anime
          opacity={[0, 1]}
          translateY={"-1px"}
          duration={1000}
          delay={(e, i) => (i + 1) * 300}
        >
          <h1 className="text-light-sand text-6xl md:text-10xl font-black">
            {t("firstname")}
          </h1>
          <h2 className="text-dark-sand text-2xl md:text-5xl">
            {t("workfield")}
          </h2>
        </Anime>
      </div>
      <div className="absolute bottom-0 w-full">
        <Mountains />
      </div>
    </header>
  );
}

export default Header;
