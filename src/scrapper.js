const got = require('got')
const $ = require('cheerio')
const fs = require('fs-extra')

const startingPointList = []
const cityLocations = new Map(fs.readJsonSync('./data/cityLocations.json'))

const getSeat61 = async () => {
  return (await got('https://www.seat61.com/')).body
}

const getCityLocation = async (cityName) => {
  const result = (await got(`https://nominatim.openstreetmap.org/search?city=${cityName}&format=json`, { json: true })).body
  if (result.length === 1) {
    cityLocations.set(cityName, result[0])
  } else {
    const cities = result.filter(value => value.type === 'city')
    if (cities.length === 1) {
      cityLocations.set(cityName, cities[0])
    } else if (cities.length > 1) {
      cityLocations.set(cityName, cities[0])
    } else if (result.length > 0) {
      cityLocations.set(cityName, result[0])
    } else {
      console.log(cityName, result)
    }
  }
  await fs.writeJSON('./data/cityLocations.json', [...cityLocations])
}

const scrapeSeat61 = async () => {
  const html = await getSeat61()
  const startingPoints = $('form[name=menu6] select', html).children()
  startingPoints.each(async (index, startingPoint) => {
    const value = $(startingPoint).val()
    const cityName = $(startingPoint).text().trim()
    if (!cityLocations.has(cityName)) {
      await getCityLocation(cityName)
    }
    if (value.includes('international-trains')) {
      startingPointList.push({
        name: cityName,
        url: value,
        location: cityLocations.get(cityName),
        destinations: []
      })
    }
  })

  for (const key in startingPointList) {
    if (startingPointList.hasOwnProperty(key)) {
      const startingPoint = startingPointList[key]
      const page = (await got(`https://www.seat61.com/${startingPoint.url}`)).body
      const destinationOptions = $('div#content select[name=list]', page).children()
      destinationOptions.each((i, destinationOption) => {
        const value = $(destinationOption).val()
        const cityName = $(destinationOption).text().trim()
        if (value.includes('#')) {
          startingPoint.destinations.push({
            name: cityName,
            url: startingPoint.url + value,
            anchor: value
          })
        } else if (value.includes('../trains-and-routes/')) {
          startingPoint.destinations.push({
            name: cityName,
            url: value,
          })
        }
      })
    }
  }

  fs.outputJSON('./data/connections.json', startingPointList, { spaces: '\t' })
}

scrapeSeat61()
