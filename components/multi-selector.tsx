import { useTranslation } from "react-i18next";

interface MultiSelectorProps<T> {
  selected: T;
  setSelected: (e: T) => void;
  elements: T[];
  toText?: (e: T) => string;
}

function MultiSelector<T>(props: MultiSelectorProps<T>) {
  const { t } = useTranslation();
  const elementsList = [];
  for (let i = 0; i < props.elements.length; i++) {
    const element = props.elements[i];
    let classNames = [
      "cursor-pointer",
      "border",
      "border-solid",
      "border-mtts-light-violet",
      "py-2",
      "px-4"
    ];

    if (i === 0) classNames.push("rounded-l");
    if (i === props.elements.length - 1) classNames.push("rounded-r");

    if (element === props.selected)
      classNames.push("bg-mtts-dark-violet text-white border-none");

    elementsList.push(
      <li
        className={classNames.join(" ")}
        onClick={() => props.setSelected(element)}
        key={`multi-selector-${element}`}
      >
        {props.toText ? props.toText(element) : element}
      </li>
    );
  }
  return (
    <div>
      <ul className="flex">{elementsList}</ul>
    </div>
  );
}

export default MultiSelector;
