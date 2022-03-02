//Packages
import axios from "axios";
import Cookies from 'js-cookie';
import moment from "moment";
//React
import { useEffect, useState } from "react";
//App
import "../App.css";
import "../App";
//Component
import DetailCard from "./DetailCard";
import Header from "./Header";
import SummaryCard from "./SummaryCard";

const Home = () => {
  const API_KEY = process.env.REACT_APP_API_KEY;
  const [noData, setNoData] = useState("Please Search a Area!");
  const [searchTerm, setSearchTerm] = useState("");
  const [weatherData, setWeatherData] = useState([]);
  const [nextWeather, setNextWeather] = useState([]);
  const [city, setCity] = useState("Unknown location");
  //Weather Icon
  const [weatherIcon, setWeatherIcon] = useState(
    `${process.env.REACT_APP_ICON_URL}10n@2x.png`
  );
  //HandleChange for Searchbar
  const handleChange = (input) => {
    const { value } = input.target;
    setSearchTerm(value);
  };
  //HandleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.length === 0) {
      alert("Please enter one value!");
      return;
    } else {
      getWeather(searchTerm);
      let token = Cookies.get('token');
      axios.post("http://localhost:3001/graphql", {
        query: `
        mutation updateLocation {
          updateLocation(location: "${searchTerm}") {
            message
            success
          }
        }
        `
      }, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => { })
        .catch(err => { })
    }
  };
  //Get Weather function
  const getWeather = async (location) => {
    let how_to_search =
      typeof location === "string"
        ? `q=${location}`
        : `lat=${location[0]}&lon=${location[1]}`;
    try {
      let res = await fetch(
        `${process.env.REACT_APP_URL + how_to_search
        }&appid=${API_KEY}&units=metric&include=hourly,minutely`
      );
      let data = await res.json();
      console.log(data);
      if (data.cod !== "200") {
        return;
      } else {
        setWeatherData(data);
        setCity(`${data.city.name}, ${data.city.country}`);
        let reminder = [];
        let result = data.list.filter(item => {
          let date = item.dt_txt.split(' ')[0];
          if (reminder.includes(date)) {
            return false;
          }
          reminder.push(date);
          return true;
        });
        setNextWeather(result);
        setWeatherIcon(
          `${process.env.REACT_APP_ICON_URL + data.list[0].weather[0]["icon"]
          }@4x.png`
        );
      }
    } catch (error) {
      console.log("Error Encountered: " + error);
    }
  };
  const myIP = (location) => {
    const { latitude, longitude } = location.coords;
    getWeather([latitude, longitude]);
  };
  //Api Call for backend Last location
  useEffect(async () => {
    let location;
    let token = Cookies.get('token')
    if (token) {
      await axios.post("http://localhost:3001/graphql", {
        query: `
        query getUser {
          getUser{
            location
          }
        }
      `
      }, {
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }
      })
        .then(res => {
          location = res.data.data.getUser.location
        })
        .catch(err => { })
    }
    if (location) {
      getWeather(location);
    } else {
      navigator.geolocation.getCurrentPosition(myIP);
    }
  }, []);
  return (
    <div>
      <div className="appContainer">
        <div className="contentContainer">
          {/* form card section  */}
          <div className="form-container">
            <div className="flex items-center justify-center">
              <h3
                className="my-auto mr-auto text-xl text-pink-800 font-bold shadow-md py-1 px-3 
                   rounded-md bg-white bg-opacity-30"
              >
                Forecast
              </h3>
              <div className="flex p-2 text-gray-100 bg-gray-600 bg-opacity-30 rounded-lg">
                <i className="fa fa-map my-auto" aria-hidden="true"></i>
                <div className="text-right">
                  <p className="font-semibold text-sm ml-2">{city}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-white text-2xl">
                The Only Weather Forecast You Need
              </h1>
              <hr className="h-1 bg-white w-1/4 rounded-full my-5" />
              <form
                noValidate
                onSubmit={handleSubmit}
                className="flex justify-center w-full"
              >
                <input
                  type="text"
                  placeholder="Enter location"
                  className="relative rounded-xl py-2 px-3 w-2/3 bg-gray-300 bg-opacity-60 text-white placeholder-gray-200"
                  onChange={handleChange}
                  required
                />
                <button type="submit" className="z-10">
                  <i
                    className="fa fa-search text-white -ml-10 border-l my-auto z-10 cursor-pointer p-3"
                    aria-hidden="true"
                    type="submit"
                  ></i>
                </button>
                <i
                  className="fa fa-map-marker-alt my-auto cursor-pointer p-3 text-white"
                  aria-hidden="true"
                  onClick={() => {
                    navigator.geolocation.getCurrentPosition(myIP);
                  }}
                ></i>
              </form>
            </div>
          </div>
          {/* info card section  */}
          <div className="w-2/4 p-5">
            <Header />
            <div className="flex flex-col my-10">
              {/* card jsx  */}
              {weatherData.length === 0 ? (
                <div className="container p-4 flex items-center justify-center h-1/3 mb-auto">
                  <h1 className="text-gray-300 text-4xl font-bold uppercase">
                    {noData}
                  </h1>
                </div>
              ) : (
                <>
                  <div className="weatherDataContainer">
                    <h1 className="text-5xl text-gray-800 mt-auto mb-4">
                      Today
                    </h1>
                    <DetailCard weather_icon={weatherIcon} data={weatherData} />
                    <h1 className="text-3xl text-gray-600 mb-4 mt-10">
                      More On {city}
                    </h1>
                    <ul className="grid grid-cols-2 gap-2 summaryUl">
                      {nextWeather.slice(0, 5).map((days, index) => {
                        if (index > 0) {
                          return <SummaryCard key={index} day={days} />;
                        }
                      })}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
