import React from 'react'

import '../styles/tailwind.scss'
import '../styles/main.scss'
import '../i18n'

// eslint-disable-next-line react/prop-types
function MyApp ({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
