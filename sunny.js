const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const usercontainer = document.querySelector(".weather-container")
const grantAccessContainer = document.querySelector(".grant-location-container")
const searchForm = document.querySelector("[data-searchForm]")
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container")
// ================================================================================
const cityName = document.querySelector("[data-cityName]")
const countryIcon = document.querySelector("[data-countryIcon]")
const desc = document.querySelector("[data-weatherDesc]")
const weatherIcon= document.querySelector("[data-weathericon]")
const temp = document.querySelector("[data-temp]")
const windspeed = document.querySelector("[data-windspeed]")
const humidity = document.querySelector("[data-humidity]")
const cloudiness = document.querySelector("[data-clouds]")


let currentTab = userTab;
currentTab.classList.add("current-tab");
let apikey = "e5799db448e5582972036f43617b1817";
getFromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
    currentTab.classList.remove("current-tab");  
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if(!searchForm.classList.contains("active")){
        grantAccessContainer.classList.remove("active")
        userInfoContainer.classList.remove("active")
        searchForm.classList.add("active")
        removeData();
    }

    else{
        searchForm.classList.remove("active")
        userInfoContainer.classList.remove("active")
        getFromSessionStorage();
        
    }
}
}

userTab.addEventListener(('click'),()=>{
    switchTab(userTab);
})

searchTab.addEventListener(('click'),()=>{
    switchTab(searchTab);
    makeVisible(searchTab);
})

function getFromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates")
    if(!localCoordinates){
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
 
async function fetchUserWeatherInfo(coordinates) {
    const  {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active")
    loadingScreen.classList.add("active")
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`);
        const data = await response.json();
        setTimeout(()=>{
        loadingScreen.classList.remove("active")
        userInfoContainer.classList.add("active")
        renderWeatherInfo(data);
        },1000)
    }

    catch(err){
        loadingScreen.classList.remove("active")
        console.log('error fetching data',err);
    }
}

function renderWeatherInfo(weatherInfo){
    cityName.innerText  = weatherInfo?.name;
    countryIcon.src = weatherInfo?.sys?.country ? `https://flagcdn.com/16x12/${weatherInfo?.sys?.country.toLowerCase()}.png` : '';
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = weatherInfo?.weather?.[0]?.icon ? `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png` : '';
    temp.innerText = `${weatherInfo?.main?.temp} ℃`;
    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity} %`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all} %`;
}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition)
    }
    else{
        alert("Cannot access Location !! ")
    }
}

function showPosition(position){
    const userCoodinates = {
        lat : position.coords.latitude,
        lon : position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoodinates));
    fetchUserWeatherInfo(userCoodinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]")
grantAccessButton.addEventListener('click',getLocation);

let cityName1 = searchForm.querySelector("[data-searchinput]").value
const searchInput = document.querySelector("[data-searchinput]")
searchForm.addEventListener('submit',(e)=>{ // Listen for submit event on the form
    e.preventDefault();
    let cityName1 = searchForm.querySelector("[data-searchinput]").value; // Get the value from the input field inside the form

    if(cityName1 === ""){
        return;
    }
    else{
        fetchSearchWeatherInfo(cityName1);
    }
});

async function fetchSearchWeatherInfo(city) {
    userInfoContainer.classList.remove("active")
    loadingScreen.classList.add("active")
    grantAccessContainer.classList.remove("active");
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`);
        const data = await response.json();

        setTimeout(()=>{
            loadingScreen.classList.remove("active")
            userInfoContainer.classList.add("active")
            renderWeatherInfo(data);
        },1000)
    }

    catch{
        console.log('error fetching data');
    }
}

function removeData(){
    windspeed.innerText = "-"
    humidity.innerText = "-"
    cloudiness.innerText = "-"
}