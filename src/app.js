const express = require("express");
const path = require("path")
const https = require("https")
const bodyParser = require("body-parser")
const hbs = require("hbs")
const app = express();

app.use(bodyParser.urlencoded({extended : true}));

// public static path 
const staticPath = path.join(__dirname,"../public");
const templatePath = path.join(__dirname,"../templates/views")
const partialPath = path.join(__dirname , "../templates/partial")
console.log(partialPath);

app.set("view engine" , "hbs");
app.set("views" , templatePath)
app.use(express.static(staticPath));

hbs.registerPartials(partialPath)

app.get("/" , (req , res)=>{
    res.render("index")
});

app.get("/about" , (req , res)=>{
    res.render("about")
});


app.get("/weather" , (req , res)=>{

    // const cityName = req.body.search;
    // console.log(cityName);

    // console.log(req);
    var cityName = req.query.search;
    console.log(cityName);
    if(cityName===undefined){
        res.render("weather" , {
            temp : "Enter City Name in a correct way",
        })
    }

    else if(cityName==""){
        res.render("weather" , {
            temp : "Enter correct City Name",
        })
    }

    else if(cityName.includes("1")===true || cityName.includes("2")===true || cityName.includes("3")===true || cityName.includes("4")===true || cityName.includes("5")===true || cityName.includes("6")===true || cityName.includes("7")===true || cityName.includes("8")===true || cityName.includes("9")===true || cityName.includes("0")===true){
        res.render("weather" , {
            temp : "Enter correct City Name",
        })
    }

    else if(cityName.indexOf(' ') >= 0 ===true){
        res.render("weather" , {
            temp : "Enter correct City Name",
        })
    }
    else{
    https.get("https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&appid=6ab72bcbc823941d15c76e4d6d3d59b0&units=metric#" , function(response){
        // console.log(response.statusCode);

        response.on("data" , function(data){
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            const Wtemp = weatherData.main.temp; 
            const minTemp = weatherData.main.temp_min; 
            const maxTemp = weatherData.main.temp_max; 
            const city = weatherData.name;
            const country = weatherData.sys.country;
            const icon = weatherData.weather[0].icon;
            // console.log(icon);
            const discription = weatherData.weather[0].description;
            const imageURL = "http://openweathermap.org/img/wn/"+ icon + "@2x.png";
            
            res.render("weather" , {
                temp : Wtemp,
                cityName : city,
                countryName : country,

            })

        }) 

    })
}
});

app.get("*" , (req , res)=>{
    res.send("Error 404")
});

app.listen(8080 , ()=>{
    console.log("Server is live at port 8080");
})