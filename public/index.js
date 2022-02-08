var express = require("express");

var app = express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "./view");

app.listen(8000);

app.get("/", function(request, response)  {
   
    response.render("homePage");
});

app.get("/test", function(request, response)  {
   
    response.render("testPage");
});