var search = document.querySelector("#search-icon").addEventListener("click", typeSearch);
var city = document.querySelector("#city");
var cityValue = "London";
var currentDay = document.querySelector("#current-day-heading");
var day1 = document.querySelector("#day1");
var day2 = document.querySelector("#day2");
var day3 = document.querySelector("#day3");
var day4 = document.querySelector("#day4");
var day5 = document.querySelector("#day5");
var currentIcon = document.querySelector("#current-icon");
var currentTemp = document.querySelector("#current-temp");
var currentHumidity = document.querySelector("#current-humidity");
var currentWindSpeed = document.querySelector("#current-wind-speed");
var currentUVIndex = document.querySelector("#current-uv-index");
var searchList = document.querySelector("#search-list");
var currentDate = moment();
var date1 = moment().add(1, "days");
var date2 = moment().add(2, "days");
var date3 = moment().add(3, "days");
var date4 = moment().add(4, "days");
var date5 = moment().add(5, "days");
var APIKEY = '7b0197c226ae249e6f7f72a52e0e15b5';


function storeCity() {
    if (typeof (Storage) !== "undefined") {
        //Store
        if (localStorage.getItem("cities") !== null) {
            var temp = [];
            temp = (JSON.parse(localStorage.getItem("cities")));
            if (!temp.includes(cityValue)) {//if city does not exist in local storage
                temp.push(cityValue);
            }
            else {//city exist in local storage
                var oldIndex = temp.indexOf(cityValue);
                var newIndex = temp.length-1;
                temp = move(temp, oldIndex, newIndex);
            }
            localStorage.setItem("cities", JSON.stringify(temp));
        }//if localStorage is not empty
        else {
            var temp = [];
            temp.push(cityValue);
            localStorage.setItem("cities", JSON.stringify(temp));
        }//localStorage is empty

    }
    else {//notify user
        window.alert("Sorry, your browser does not support Web Storage...");
    }

}//store city value in local storage
function move(arr, oldIndex, newIndex) {
    while (oldIndex < 0) {
        oldIndex += arr.length;
    }
    while (newIndex < 0) {
        newIndex += arr.length;
    }
    if (newIndex >= arr.length) {
        var k = newIndex - arr.length;
        while ((k--) + 1) {
            arr.push(undefined);
        }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr;
}//move listitem to the top of bottom of the list if it already exist

function displaySearchHistory() {
    while (searchList.hasChildNodes()){
        searchList.removeChild(searchList.firstChild);
    }
    
    var cities = JSON.parse(localStorage.getItem("cities"));
     if (cities !== null) {
        for (var i= cities.length-1; i>=0; i--) {
            var listItem = document.createElement("li")
            listItem.addEventListener("click", function () {
                historySearch(event.target.innerHTML)
            });
            listItem.innerHTML = cities[i];
            searchList.appendChild(listItem);
        
        }
    }
    
}//display previously searched cities
function searchQuery() {

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&units=imperial&appid=${APIKEY}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            currentDayWeather(response);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`)
                .then(function (response) {
                    return response.json();
                }).then(function (response) {
                    addUVIndex(response);
            })
        });
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&units=imperial&appid=${APIKEY}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            displayForcast(response);
        });
}
function displayForcast(response) {
    var forcastList = response.list;
    var responseDate1 = date1.format("YYYY-MM-DD");
    var responseDate2 = date2.format("YYYY-MM-DD");
    var responseDate3 = date3.format("YYYY-MM-DD");
    var responseDate4 = date4.format("YYYY-MM-DD");
    var responseDate5 = date5.format("YYYY-MM-DD");
    day1.querySelector(".date").innerHTML = date1.format("M/D/YYYY");
    day2.querySelector(".date").innerHTML = date2.format("M/D/YYYY");
    day3.querySelector(".date").innerHTML = date3.format("M/D/YYYY");
    day4.querySelector(".date").innerHTML = date4.format("M/D/YYYY");
    day5.querySelector(".date").innerHTML = date5.format("M/D/YYYY");
    for (var i = 1; i < (forcastList.length) - 7; i += 8){
        var responseDate = forcastList[i].dt_txt.slice(0, 10);
        if (responseDate === responseDate1) {
            day1.querySelector(".icon").setAttribute("src", `https://openweathermap.org/img/wn/${forcastList[i].weather[0].icon}@2x.png`);
            day1.querySelector(".temp").innerHTML = `Temperature: ${forcastList[i].main.temp} &#8457`;
            day1.querySelector(".humidity").innerHTML = `Humidity: ${forcastList[i].main.humidity}%`;
        }
        if (responseDate === responseDate2) {
            day2.querySelector(".icon").setAttribute("src", `https://openweathermap.org/img/wn/${forcastList[i].weather[0].icon}@2x.png`);
            day2.querySelector(".temp").innerHTML = `Temperature: ${forcastList[i].main.temp} &#8457`;
            day2.querySelector(".humidity").innerHTML = `Humidity: ${forcastList[i].main.humidity}%`;
        }
        if (responseDate === responseDate3) {
            day3.querySelector(".icon").setAttribute("src", `https://openweathermap.org/img/wn/${forcastList[i].weather[0].icon}@2x.png`);
            day3.querySelector(".temp").innerHTML = `Temperature: ${forcastList[i].main.temp} &#8457`;
            day3.querySelector(".humidity").innerHTML = `Humidity: ${forcastList[i].main.humidity}%`;
        }
        if (responseDate === responseDate4) {
            day4.querySelector(".icon").setAttribute("src", `https://openweathermap.org/img/wn/${forcastList[i].weather[0].icon}@2x.png`);
            day4.querySelector(".temp").innerHTML = `Temperature: ${forcastList[i].main.temp} &#8457`;
            day4.querySelector(".humidity").innerHTML = `Humidity: ${forcastList[i].main.humidity}%`;
        }
        
    }
        day5.querySelector(".icon").setAttribute("src", `https://openweathermap.org/img/wn/${forcastList[38].weather[0].icon}@2x.png`);
        day5.querySelector(".temp").innerHTML = `Temperature: ${forcastList[38].main.temp} &#8457`;
        day5.querySelector(".humidity").innerHTML = `Humidity: ${forcastList[38].main.humidity}%`;
    
}
function typeSearch() {
    cityValue = toSentenceCase(city.value);
    
    storeCity();
    searchQuery();
    displaySearchHistory();
}
function historySearch(clickedCity) {
    cityValue = clickedCity;
    city.innerHTML = cityValue;
    searchQuery();
}
function toSentenceCase(str) {
    if ((str === null) || (str === ''))
        return false;
    else
        str = str.toString();

    return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });

    return string;
}
function currentDayWeather(response) {
    var formatedDate = currentDate.format("M/D/YYYY");
    currentDay.innerHTML = `${cityValue} ${formatedDate}`;
    var iconSrc = `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`;
    currentIcon.setAttribute("src", iconSrc);
    currentTemp.innerHTML = `${response.main.temp} &#8457`;
    currentHumidity.innerHTML = `${response.main.humidity}%`;
    currentWindSpeed.innerHTML = `${response.wind.speed} MPH`

}

function addUVIndex(response) {
    currentUVIndex.innerHTML = `${response.value}`;
}

function onLoad() {
    if (localStorage.getItem("cities") !== null) {
        var temp = [];
        temp = (JSON.parse(localStorage.getItem("cities")));
        cityValue = temp[temp.length - 1];
        }
    else {
        cityValue = "London";
        }
    searchQuery();
    displaySearchHistory();
}
onLoad();