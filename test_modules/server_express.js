var express = require("express");

var app = express();

// app.use(express.static("public"));

app.set("view engine", "ejs");
// app.set("views", "./view");


app.get("/", (request, response) => {
    response.render("testPage");
    console.log("test");
    response.send("test");
});

// app.get("/test", (request, response) => {
   
//     response.render("../view/testPage.ejs");
// });


app.listen(8000);
