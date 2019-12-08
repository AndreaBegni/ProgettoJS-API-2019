const rowDate = document.getElementById('date')
const rowCityName = document.getElementById('cityName')
const rowTemperature = document.getElementById('temperature')
const rowMaxTemperature = document.getElementById('maxTemperature')
const rowMinTemperature = document.getElementById('minTemperature')
const rowHumidity = document.getElementById('humidity')
const rowWind = document.getElementById('wind')
const rowClouds = document.getElementById('clouds')

const dateAPIKey = '{timezodedbAPIKey}' //insert your timezonedb API key here
const dateAPI = 'http://api.timezonedb.com/v2.1/get-time-zone?key=' + dateAPIKey + '&format=json&by=position&'
const weatherAPIKey = '{openweathermapAPIKey}' //insert your openweathermap API key here
const weatherAPI = 'http://api.openweathermap.org/data/2.5/weather?appid=' + weatherAPIKey + '&q='
const weatherButton = document.getElementById('weatherButton')
const cityFilter = document.getElementById('cityFilter')
const token = '{mapboxToken}' //insert your mapbox token here

var mymap = L.map('mapid').setView([45.54, 10.22], 15); //create a map and set the view to lat 45.54 and lon 10.22

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + token, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 20,
    id: 'mapbox.streets',
    accessToken: 'your.mapbox.access.token'
}).addTo(mymap);

var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(mymap);
}

mymap.on('click', onMapClick);

function centerView(lat, lon) {
    mymap.panTo([lat, lon])
    mymap.setZoom(15)
}

function insertDataIntoTable(body, date) {
    rowDate.innerHTML = date.formatted
    rowCityName.innerHTML = cityFilter.value.toUpperCase()
    rowTemperature.innerHTML = (body.main.temp - 273.15).toFixed(2) + "°C"
    rowMaxTemperature.innerHTML = (body.main.temp_max - 273.15).toFixed(2) + "°C"
    rowMinTemperature.innerHTML = (body.main.temp_min - 273.15).toFixed(2) + "°C"
    rowHumidity.innerHTML = body.main.humidity + '%'
    rowClouds.innerHTML = body.clouds.all + '%'
    rowWind.innerHTML = body.wind.speed + 'm/s'
}

const loadWeather = async() => {
    let body = await fetch(weatherAPI + cityFilter.value).then(data => data.json())
    if (body.message !== 'city not found') {
        centerView(body.coord.lat, body.coord.lon)
        let date = await fetch(dateAPI + 'lat=' + body.coord.lat + '&lng=' + body.coord.lon).then(data => data.json())
        insertDataIntoTable(body, date)
    }
}

weatherButton.onclick = loadWeather
