import { DateTime } from "luxon";

const API_KEY = "Get a key at openweathermap.org ";
const BASE_URL = "https://api.openweathermap.org/data";
const SECOND_URL = "https://api.stormglass.io/v2/solar/point";

const getWeatherData =  (infoType, searchParams) => {
    const url = new URL(BASE_URL + "/" + infoType);
    url.search = new URLSearchParams({...searchParams, appid:API_KEY});
    
    return fetch(url)
    .then((res) => res.json());
};

 
const formatCurrentWeather = (data) => {
    const {
        coord: {lat, lon},
        main: {temp, feels_like, temp_min, temp_max, humidity},
        name,
        dt,
        sys: {country, sunrise, sunset},
        weather,
        wind: {speed}
    } = data

    const {main: details, icon} = weather[0];

    return {lat, lon, temp, feels_like, temp_min, temp_max,
         humidity, name, dt, country, sunrise, sunset, details, icon, speed};
};

const formatForecastWeather = (data) => {
    let {timezone, daily, hourly} = data;
    daily = daily.slice(1, 6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, "ccc"),
            temp: d.temp.day,
            icon: d.weather[0].icon,
        }
    });

    hourly = hourly.slice(1,6).map(d => {
        return {
            title: formatToLocalTime(d.dt, timezone, 'hh:mm a'),
            temp: d.temp,
            icon: d.weather[0].icon
        };
    });
    
    return {timezone, daily, hourly};
};

const getFormattedWeatherData = async (searchParams) => {
    const formattedCurrentWeather = await getWeatherData(
        '2.5/weather', 
        searchParams
        ).then(formatCurrentWeather);

        const {lat, lon} = formattedCurrentWeather;
        const UVIndexResponse = await fetch(SECOND_URL + `?lat=${lat}&lng=${lon}&params=uvIndex`, {
            headers: {
                'Authorization': 'Get a key at stormglass.io'
            }
        });
        const UVIndexData = await UVIndexResponse.json();
        //console.log(UVIndexData);
        const UVIndex = UVIndexData.data[0].uvIndex;//this may throw error because it has a limit of 10 requests per day.
        const formattedForecastWeather = await getWeatherData(
        '3.0/onecall', 
        {
            lat, 
            lon, 
            exclude: "current, minutely, alerts", 
            units: searchParams.units,
        }
        
    ).then(formatForecastWeather);

    return { ...formattedCurrentWeather, ...formattedForecastWeather, uvIndex: UVIndex 
    };
};

const formatToLocalTime = (
    secs, 
    zone, 
    format = "cccc, dd LLL yyyy' | Local time: 'hh:mm a"
) => DateTime.fromSeconds(secs).setZone(zone).toFormat(format);

const iconUrlFromCode = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`

export default  getFormattedWeatherData;
export {formatToLocalTime, iconUrlFromCode};