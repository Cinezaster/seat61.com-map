import React, { createContext, useState } from 'react'

const StartingPointContext = createContext(['', () => { }])

export const StartingPointProvider = (props) => {
  const [state, setState] = useState('')
  return (
    <StartingPointContext.Provider value={[state, setState]}>
      {props.children}
    </StartingPointContext.Provider>
  )
}

export default StartingPointContext
