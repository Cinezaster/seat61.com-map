import React, { createContext, useState } from 'react'

const DestinationContext = createContext(['', () => { }])

export const DestinationProvider = (props) => {
  const [state, setState] = useState('')
  return (
    <DestinationContext.Provider value={[state, setState]}>
      {props.children}
    </DestinationContext.Provider>
  )
}

export default DestinationContext