import { useTranslation } from "react-i18next";
import Category from "../components/category";

export default function useCategory(
  name: string,
  CustomIcon: () => JSX.Element
) {
  const { t } = useTranslation();
  const categoryObject: [] = t(`content.${name}.past`);
  const elements = [];

  for (let s in categoryObject) {
    elements.push(
      <Category
        key={`${name}-${s}`}
        object={categoryObject[s]}
        icon={CustomIcon}
      />
    );
  }

  return [
    <div className="category">
      <h2 className="text-dark-marine text-2xl font-bold">
        {t(`content.${name}.title`)}
      </h2>
      {elements}
    </div>
  ];
}
