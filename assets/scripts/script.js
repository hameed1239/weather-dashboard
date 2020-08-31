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
    // console.log(cities);
     if (cities !== null) {
        for (var i= cities.length-1; i>=0; i--) {
            var listItem = document.createElement("li")
            listItem.addEventListener("click", function () {
                // console.log(event.target.innerHTML);
                historySearch(event.target.innerHTML)
            });
            // console.log(cities[i]);
            listItem.innerHTML = cities[i];
            searchList.appendChild(listItem);
        
        }
    }
    
}//display previously searched cities
function searchQuery() {
    // cityValue = city.value;
    // console.log(cityValue);

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&units=imperial&appid=${APIKEY}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            // console.log(response);
            currentDayWeather(response);
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            fetch(`https://api.openweathermap.org/data/2.5/uvi?appid=${APIKEY}&lat=${lat}&lon=${lon}`)
                .then(function (response) {
                    return response.json();
                }).then(function (response) {
                    // console.log(response);
                    addUVIndex(response);
            })
        });
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityValue}&units=imperial&appid=${APIKEY}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
            displayForcast(response);
        });
    // storeCity();
    // displaySearchHistory();
}
function displayForcast(response) {
    var forcastList = response.list;
    // console.log (forcastList);
    for (var i = 0; i < forcastList.length; i++){

    }
}
function typeSearch() {
    debugger;
    // console.log(city.value);
    cityValue = toSentenceCase(city.value);
    // console.log(cityValue);
    
    storeCity();
    searchQuery();
    displaySearchHistory();
}
function historySearch(clickedCity) {
    cityValue = clickedCity;
    city.innerHTML = cityValue;
    // console.log(cityValue);
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
    // var icon = response.weather[0].icon;
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
        console.log(cityValue);
        }
    else {
        cityValue = "London";
        console.log(cityValue);
        }
    searchQuery();
    displaySearchHistory();
}
onLoad();
// fetch('https://api.openweathermap.org/data/2.5/forecast?q=cleveland,ohio&appid=7b0197c226ae249e6f7f72a52e0e15b5')
//     .then(function (response) {
//         return response.json();
//     })
//     .then(function (response) {
//         console.log(response);
//     }); 