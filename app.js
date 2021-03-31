const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const { time } = require("console");
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require("constants");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html")
});

app.post("/", function(req, res){

    const city = req.body.cityName;
    const weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&cnt=5&units=metric&lang=pt_br&appid=436082ca321971cceee78ee4f3a6f585";

    https.get(weatherUrl, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            
            var day1 = 0, day2 = 1, day3 = 2, day4 = 3, day5 = 4;
            
            const temperature = [];
            const description = [];
            const icon = [];
            const imageUrl = []
            const rain = weatherData.list[0].rain;
            // const rainPrec = rain[Object.keys(rain)[0]];
            const locationData = weatherData.city.name + ", " +  weatherData.city.country;
            const wind = weatherData.list[0].wind.speed;
            const humidity = weatherData.list[0].main.humidity;

            for(var N = 0; N < 5; N++){
                temperature.push(Math.floor(weatherData.list[N].main.temp));
                description.push(weatherData.list[N].weather[0].description);
                icon.push(weatherData.list[N].weather[0].icon);
                imageUrl.push("http://openweathermap.org/img/wn/" + icon[N] + "@2x.png");
            }

            
    
            let today = new Date();
            let WeekDays = [];

            for (var i=1; i<5; i++){
                NextDay = new Date()
                NextDay.setTime(NextDay.getTime() + ((24 * 60 * 60 * 1000)*[i]));
                WeekDays.push(NextDay);
            }
            

            var dayOptions1 = {
                weekday: "long"
            }
            var dayOptions2 = {
                weekday: "short"
            }
            var dateOptions = {
                day: "numeric",
                month: "long",
                year: "numeric"
            };


            let date = today.toLocaleDateString("pt", dateOptions);
            let day = (today.toLocaleDateString("pt", dayOptions1));
            let NextWeekDay1 = (WeekDays[0].toLocaleDateString("pt", dayOptions2));
            let NextWeekDay2 = WeekDays[1].toLocaleDateString("pt", dayOptions2);
            let NextWeekDay3 = WeekDays[2].toLocaleDateString("pt", dayOptions2);
            let NextWeekDay4 = WeekDays[3].toLocaleDateString("pt", dayOptions2);

            console.log(weatherData.list[0].weather);
               

            res.render("weather", {
                data: date,
                dia: day,
                location: locationData,
                // precipitation: rainPrec,
                vento: wind,
                humidade: humidity,
                day1Temp: temperature[day1],
                day1Desc: description[day1],
                day1Icon: imageUrl[day1],
                day2Temp: temperature[day2],
                day2Icon: imageUrl[day2],
                day3Temp: temperature[day3],
                day3Icon: imageUrl[day3],
                day4Temp: temperature[day4],
                day4Icon: imageUrl[day4],
                day5Temp: temperature[day5],
                day5Icon: imageUrl[day5],
                nextDay1: NextWeekDay1,
                nextDay2: NextWeekDay2,
                nextDay3: NextWeekDay3,
                nextDay4: NextWeekDay4,
            })
        });
    });
});



app.listen(5000, function(){
    console.log("Server running on port 5000");
})