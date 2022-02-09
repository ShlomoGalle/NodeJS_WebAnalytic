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
    if(request.body.url === undefined || request.body.url === '' || request.body.number_url === undefined || request.body.number_url === '' )
    {
        response.render("index", {error : "The url or number of url is missing !"})
    }
    else{
        // scrapper.start(request, response);
        var data2;
        var monInstance = new scrapper();
        monInstance.start_analyze(request.body.url, request.body.number_url, (data) => {
            // console.log(data)
            // data2 = data;
            // response.Clear()
            if(request.body.number_url == -1)
            {
                response.write(data)
                response.write('------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------')

            }
            else
            {
                response.render("index", {success : "Thank you ! ", message : data})
            }
            // response.write('------------------------------------------------------------------------------------------------------')
        });
        // console.log(data2)
        // for (let index = 0; index < 30; index++) {
        //     setTimeout(function(){ 
        //     }, 20000);
        // }   
    }
});


app.listen(8000);
