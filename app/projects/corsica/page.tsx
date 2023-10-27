'use client'

import { NextPage } from 'next'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import MergeGPX from './components/MergeGPX'
import AnalyseGPX from './components/AnalyseGPX'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import classNames from 'classnames'

const HomePage: NextPage<{}> = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)
  const { t } = useTranslation()

  const ACTIONS = [
    {
      tabLabel: t('corsica.pages.index.tabs.merge.tabLable'),
      component: <MergeGPX />
    },
    {
      tabLabel: t('corsica.pages.index.tabs.analyse.tabLable'),
      component: <AnalyseGPX />
    }
  ]

  return (
    <div className="font-sans">
      <header className='p-6'>
        <h1 className='text-4xl text-center'>{t('corsica.pages.index.header.title')}</h1>
        <h3 className='text-xl text-center'>{t('corsica.pages.index.header.subtitle')}</h3>
      </header>
      <Tabs onSelect={(index) => setSelectedTabIndex(index)}>
        <TabList className="flex">
          {ACTIONS.map((action, actionIndex) => (
            <Tab
              key={`tab-label-${action.tabLabel}`}
              className={classNames('p-2 border-b cursor-pointer rounded-t', { 'bg-corsica-green text-white': selectedTabIndex === actionIndex })}
            >
              {action.tabLabel}
            </Tab>
          ))}
        </TabList>
        {ACTIONS.map(action => (
          <TabPanel key={`tab-content-${action.tabLabel}`}>
            <div className="p-2">
              {action.component}
            </div>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}

export default HomePage
