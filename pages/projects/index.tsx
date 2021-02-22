import { useTranslation } from "react-i18next";

const Aigrenys = () => {
  const { t } = useTranslation()
  return <h1>{t('aigrenys.title')}</h1>
}

export default Aigrenys;