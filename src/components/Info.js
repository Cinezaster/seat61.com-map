import React, { useContext } from 'react'
import './Info.css'
import connections from './../data/connections.json'
import StartingPointContext from '../context/StartingPointContext'
import DestinationContext from '../context/DestinationContext'

const Info = () => {
  const [selectedCity, setSelectedCity] = useContext(StartingPointContext)
  const [selectedDestination, setSelectedDestination] = useContext(DestinationContext)
  const selectedCityObject = selectedCity !== '' ? connections.find((connection) => connection.name === selectedCity) : undefined
  if (selectedCityObject) {
    return (
      <div>
        {selectedCityObject.name} - {selectedDestination}
      </div>
    )
  }
  return null
}

export default Info;