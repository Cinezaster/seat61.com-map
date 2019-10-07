import React, { Fragment, useContext } from 'react'
import './Map.css'
import './../assets/leaflet.css'
import { Map as LMap, Marker, TileLayer, Polyline } from 'react-leaflet'
import L from 'leaflet'
import connections from './../data/connections.json'
import StartingPointContext from '../context/StartingPointContext'
import DestinationContext from '../context/DestinationContext'

const position = [51.505, -0.09]
function MapComponent() {
  const [selectedCity, setSelectedCity] = useContext(StartingPointContext)
  const [selectedDestination, setSelectedDestination] = useContext(DestinationContext)
  const selectedCityObject = selectedCity !== '' ? connections.find((connection) => connection.name === selectedCity) : undefined
  const destinations = selectedCity !== '' ? selectedCityObject.destinations : undefined
  return (
    <LMap center={position} zoom={5}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
      />
      {
        connections.map(connection => {
          const location = connection.location
          let opacity = 1
          let destination
          if (destinations) {
            destination = destinations.find((destination) => destination.name === connection.name)
            if (!destination) {
              opacity = .2
            }
          }
          if (location) {
            return (
              <Fragment key={connection.name}>
                <Marker
                  onclick={() => {
                    if (connection.name === selectedCity) {
                      setSelectedCity('')
                    } else {
                      setSelectedCity(connection.name)
                    }
                  }}
                  position={[location.lat, location.lon]}
                  opacity={opacity}
                  icon={L.icon({
                    iconUrl: 'images/marker-icon.png',
                    iconRetinaUrl: 'images/marker-icon-2x.png',
                    shadowUrl: 'images/marker-shadow.png',
                    iconSize: [25, 41],
                    iconAnchor: [12, 41],
                    popupAnchor: [1, -34],
                    tooltipAnchor: [16, -28],
                    shadowSize: [41, 41]
                  })}
                >
                  {/* <Popup>{`https://www.seat61.com/${connection.url}`}</Popup> */}
                </Marker>
                {
                  destination ?
                    <Polyline
                      color={destination.name === selectedDestination ? 'orange' : 'lime'}
                      positions={[[selectedCityObject.location.lat, selectedCityObject.location.lon], [location.lat, location.lon]]}
                      onmouseover={() => setSelectedDestination(destination.name)}
                    />
                    :
                    null
                }
              </Fragment>
            )
          }
          return ''
        })
      }

    </LMap>
  )
}

export default MapComponent;