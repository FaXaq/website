'use client'

import React from 'react'
import LinkIcon from '../../components/images/link-icon'

interface CategoryMission {
  type: string,
  text: string,
  techUsed: undefined | Array<string>
}

interface CategoryTranslation {
  title: string,
  period: string,
  links: Array<string>,
  missions: Array<CategoryMission>
}

export interface CategoryProps {
  object: CategoryTranslation;
  Icon: () => React.JSX.Element;
  filter?: string
}

function Category ({ object, Icon, filter }: CategoryProps) {
  const links = []
  if (Array.isArray(object.links)) {
    for (const l in object.links) {
      links.push(
        <a
          href={object.links[l]}
          target="_blank"
          rel="noopener noreferrer"
          
          key={`link-${l}`}
        >
          <div >
            <LinkIcon />
          </div>
          <span >{object.links[l]}</span>
        </a>
      )
    }
  }

  const missions = []
  if (Array.isArray(object.missions)) {
    let filteredMissions = object.missions.filter(mission => {
      if (filter && mission.type !== filter) {
        return false
      }

      return true
    })

    for (let i = 0; i < filteredMissions.length; i++) {
      const mission = filteredMissions[i]
      missions.push(
        <li key={`mission-${i}`} >
          * {filteredMissions[i].text} {filteredMissions[i].techUsed && `(${filteredMissions[i].techUsed.join(', ')})`}
        </li>
      )
    }
  }


  return (
    <div >
      <div >
        <Icon />
      </div>
      <div>
        <h3 >
          {object.title}
        </h3>
        <div >
          <p>{object.period}</p>
          {links}
        </div>
        <ul>{missions}</ul>
      </div>
    </div>
  )
}

export default Category
