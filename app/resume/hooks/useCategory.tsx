'use client'

import React from 'react'
import { useTranslation } from 'next-i18next'
import Category from '../components/category'

export default function useCategory (
  name: string,
  CustomIcon: () => React.JSX.Element,
  filter?: string
) {
  const { t } = useTranslation()
  const categoryObject: [] = t(`resume.content.${name}.past`)
  const elements: React.JSX.Element[] = []

  for (const s in categoryObject) {
    elements.push(
      <Category
        key={`${name}-${s}`}
        object={categoryObject[s]}
        Icon={CustomIcon}
        filter={filter}
      />
    )
  }

  return (
    <div >
      <h2 >
        {t(`resume.content.${name}.title`)}
      </h2>
      { name === 'experiences' && (
        <Category key='current' object={t(`resume.content.${name}.current`)} Icon={CustomIcon} filter={filter} />
      )}
      {elements}
    </div>
  )
}
