import React from 'react'
import SongEditor from './song-editor'
import DetachableWindow from './detachable-window'
import { Provider } from 'react-redux'
import store from '../../../redux'
import DawToolbar from './toolbar'

interface DawLayoutProps {
}

const DawLayout = () => {
  return (
    <Provider store={store}>
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        <DawToolbar />
        <div className="relative">
          <DetachableWindow attached={true}>
            <SongEditor />
          </DetachableWindow>
        </div>
      </div>
    </Provider>
  )
}

export default DawLayout
