'use client'

import React from 'react'

import Header from './components/header'
import Mountains from '../components/images/mountains'
import Footer from './components/footer'
import Content from './components/content'

function HomePage () {
  return (
    <div className="font-sans">
      <Header />
      <div className="rotate-180">
        <Mountains />
      </div>
      <div className="container mx-auto px-4 md:px-0">
        <Content />
      </div>
      <Footer />
    </div>
  )
}

export default HomePage
