const express = require("express");
const scrapper = require("./models/scrapper")

var app = express();

app.set("view engine", "ejs");

app.use(express.static("public")); 
app.use(express.urlencoded({ extended: false}))
app.use(express.json())


app.get("/", (request, response) => {
    // console.log("test");
    response.render("index")
});

app.post("/", (request, response) => {
    console.log(request.body.url)
    if(request.body.url === undefined || request.body.url === '')
    {
        response.render("index", {error : "The url is missing !"})
    }
    else{
        // scrapper.start(request, response);
        
        var monInstance = new scrapper();
        monInstance.start_analyze(request.body.url, (data) => {
            console.log(data)
            response.render("index", {success : "Thank you ! ", message : data})
        });
    }
});


app.listen(8000);
