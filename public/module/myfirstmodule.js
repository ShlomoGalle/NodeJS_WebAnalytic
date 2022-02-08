const http = require('http');
const fs = require('fs');
const url = require("url");


// Create a local server to receive data from
const server = http.createServer((req, res) => {
    
    res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
    })

    // console.log(url.parse(req.url, true))
    // console.log(url.parse(req.url, true))

    if(url.parse(req.url, true).pathname != '/favicon.ico')
    {
        var query = url.parse(req.url, true).query
        let name = query.name === undefined ? 'anonyme' : query.name;

        fs.readFile('./view/homePage.html', (err, data) => {
            if (err) 
            {
                res.writeHead(404)

                res.end("<h1> ERROR 404 </h1> <br/> La page n'existe pas")    
            } 
            
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8'
            })

            data = String(data).replace('{{ name }}', name)

            res.end(data)
        });
    }


}).listen(8000);
