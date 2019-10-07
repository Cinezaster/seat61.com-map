import React, { useState, Fragment } from 'react'
import './App.css'
import Map from './components/Map'
import Info from './components/Info'
import { StartingPointProvider } from './context/StartingPointContext'
import { DestinationProvider } from './context/DestinationContext'

function App() {
  return (
    <StartingPointProvider>
      <DestinationProvider>
        <div id='flex-container'>
          <Map />
          <div style={{ flexGrow: 2 }}>
            <Info />
          </div>
        </div>
      </DestinationProvider>
    </StartingPointProvider>
  )
}

export default App;
