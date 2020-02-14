import { useTranslation } from "react-i18next";
import useCategory from "../../hooks/category";
import ExperienceIcon from "../images/experience-icon";
import StudyIcon from "../images/study-icon";
import AchievementIcon from "../images/achievement-icon";
import MiscIcon from "../images/misc-icon";
import ProjectIcon from "../images/project-icon";
import Anime from "react-anime";

function Content() {
  const { t } = useTranslation();

  const [experiences] = useCategory("experiences", ExperienceIcon);
  const [studies] = useCategory("studies", StudyIcon);
  const [achievements] = useCategory("achievements", AchievementIcon);
  const [projects] = useCategory("projects", ProjectIcon);
  const [misc] = useCategory("misc", MiscIcon);

  return (
    <Anime opacity={[0, 1]} duration={5000} delay={300} translateY={"-1px"}>
      <main>
        {experiences}
        <div className="flex flex-col md:flex-row">
          <div className="w-auto md:w-1/2 md:mr-5">
            {studies}
            {achievements}
          </div>
          <div className="w-auto mdw-1/2 md:ml-5">
            {projects}
            {misc}
          </div>
        </div>
      </main>
    </Anime>
  );
}

export default Content;
