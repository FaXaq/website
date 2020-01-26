import { isArray } from "util";
import LinkIcon from "../images/link-icon";

export interface CategoryProps {
  object: any;
  icon: () => JSX.Element;
}

function Category(props: CategoryProps) {
  const links = [];
  if (isArray(props.object.links)) {
    for (let l in props.object.links) {
      links.push(
        <a
          href={props.object.links[l]}
          target="_blank"
          className="block flex ml-2"
          key={`link-${l}`}
        >
          <div className="w-5 mr-1">
            <LinkIcon />
          </div>
          <span>{props.object.links[l]}</span>
        </a>
      );
    }
  }

  const missions = [];
  if (isArray(props.object.missions)) {
    for (let m in props.object.missions) {
      missions.push(<li key={`mission-${m}`}>{props.object.missions[m]}</li>);
    }
  }
  return (
    <div className="flex my-4">
      <div className="h-6 w-6 mr-4 my-2 flex-shrink-0">
        <props.icon />
      </div>
      <div>
        <h3 className="text-light-marine font-bold text-lg">
          {props.object.title}
        </h3>
        <div className="flex flex-col md:flex-row text-dark-sand">
          <p>{props.object.period}</p>
          <div className="flex flex-col md:flex-row">{links}</div>
        </div>
        <ul>{missions}</ul>
      </div>
    </div>
  );
}

export default Category;
