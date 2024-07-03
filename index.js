const express = require("express");
const app = express();
const axios = require("axios");
require("dotenv").config();

const PORT = process.env.PORT;

const getIP = (req) => {
  return req.headers["x-forwarded-for"] || req.connection.remoteAddress;
};

const getLocation = async (ip) => {
  const response = await axios.get(`http://ip-api.com/json/${ip}`);
  return response.data;
};

const getWeather = async (city) => {
  const apiKey = process.env.APIKEY;
  const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`,
  );
  return response.data.main.temp;
};

app.get("/api/hello", async (req, res) => {
  const visitorName = req.query.visitor_name || "Visitor";
  const ip = getIP(req);
  const locationData = await getLocation(ip);
  const city = locationData.city || "New York";
  const temperature = await getWeather(city);

  res.json({
    client_ip: ip,
    location: city,
    greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
