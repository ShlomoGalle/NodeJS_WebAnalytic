const http = require('http');
const fs = require('fs');
const url = require("url");
const EventEmitter = require("events");

let myEcouter = new EventEmitter();

myEcouter.on("test", function (a, b) { 
    console.log("Test ", a, b);
});

myEcouter.emit("test", "a", "b");
myEcouter.emit("test");
myEcouter.emit("test", "c", "d");



let App = {
    start : function (port) {
        let emitter = new EventEmitter();
        
        const server = http.createServer((req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })

            if(req.url === "/")
            {
                emitter.emit('root', res)
            }
        
            res.end();
        }).listen(port)

        return emitter;
    }
}

let app = App.start(8000);

app.on("root", function (response) {
    console.log("Je suis à la racine");
})


// // Create a local server to receive data from
    
//     res.writeHead(200, {
//         'Content-Type': 'text/html; charset=utf-8'
//     })

//     // console.log(url.parse(req.url, true))
//     // console.log(url.parse(req.url, true))

//     if(url.parse(req.url, true).pathname != '/favicon.ico')
//     {
//         var query = url.parse(req.url, true).query
//         let name = query.name === undefined ? 'anonyme' : query.name;

//         fs.readFile('./view/homePage.html', (err, data) => {
//             if (err) 
//             {
//                 res.writeHead(404)

//                 res.end("<h1> ERROR 404 </h1> <br/> La page n'existe pas")    
//             } 
            
//             res.writeHead(200, {
//                 'Content-Type': 'text/html; charset=utf-8'
//             })

//             data = String(data).replace('{{ name }}', name)

//             res.end(data)
//         });
//     }


// }).listen(8000);
