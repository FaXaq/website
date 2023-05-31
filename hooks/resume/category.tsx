import React from 'react'
import { useTranslation } from 'react-i18next'
import Category from '../../components/resume/category'

export default function useCategory (
  name: string,
  CustomIcon: () => React.JSX.Element
) {
  const { t } = useTranslation()
  const categoryObject: [] = t(`resume.content.${name}.past`)
  const elements: React.JSX.Element[] = []

  for (const s in categoryObject) {
    elements.push(
      <Category
        key={`${name}-${s}`}
        object={categoryObject[s]}
        icon={CustomIcon}
      />
    )
  }

  return (
    <div className="category">
      <h2 className="text-dark-marine text-2xl font-bold">
        {t(`resume.content.${name}.title`)}
      </h2>
      { name === 'experiences' &&
        <Category key='current' object={t(`resume.content.${name}.current`)} icon={CustomIcon} />
      }
      {elements}
    </div>
  )
}
