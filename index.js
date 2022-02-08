const express = require("express");
const ejs = require('ejs');

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
        response.render("index", {error : "The message is missing !"})
    }
    response.render("index", {success : "Thank you ! "})
});


app.listen(8000);
