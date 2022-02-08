const server = require('./server_http')

let app = server.start(8000)
app.on("root", function (response) {
    response.write("Je suis à la racine");
});
