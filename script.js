let myKey = "02b3188381997dfeafa92aaf04d4057a";

function getWeather(city){// It was necesary to use city as an argument so it can be called when the user types a name in the search box

    let myUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric" + "&q="+ city +"&appid=" + myKey;
    let weatherIcon = document.querySelector(".weather-icon"); // this is a standard weather icon that will display if there is not an image available for the weather condition
    
    $.ajax({
        url: myUrl,
        type: 'GET',
        dataType: 'json',
        success: function(data) {

            // Handle the response here
            document.querySelector(".city").innerHTML = data.name;// this is the city, in the API it appears as 'name'
            document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°c"; 
            document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
            document.querySelector(".wind").innerHTML = data.wind.speed + "km/h";

            if(data.weather[0].main == "Clouds"){ // Change the weather condition image.
                weatherIcon.src = "images/clouds.png";

            } else if (data.weather[0].main == "Clear") {
                weatherIcon.src = "images/clear.png";

            } else if (data.weather[0].main == "Rain") {
                weatherIcon.src = "images/rain.png";

            } else if (data.weather[0].main == "Clear") {
                weatherIcon.src = "images/clear.png";

            } else if (data.weather[0].main == "Drizzle") {
                weatherIcon.src = "images/drizzle.png";

            } else if (data.weather[0].main == "Mist") {
                weatherIcon.src = "images/mist.png";

            } else if (data.weather[0].main == "Snow") {
                weatherIcon.src = "images/snow.png";

            } else if (data.weather[0].main == "Thunderstorm") {
                weatherIcon.src = "images/thunderstorm.png";

            } else {
                weatherIcon.src = "images/clouds.png";
            }

            document.querySelector(".weather").style.display = "block";// this avoids the webpage to load with information on it, the user will only see the search box in the beggining.
            
        },
        error: function(error) {
            // Handle errors here
            console.error("Error fetching data:", error);
        }
    });
}

window.addEventListener("load", (event) => {
    const searchbox = document.querySelector(".search input")
    const searchbtn = document.querySelector(".search button");
    searchbtn.addEventListener("click", () => getWeather(searchbox.value));// this is why I needed to use city as an argument, so when you click the search button, the program will use the information in the searchbar.
});