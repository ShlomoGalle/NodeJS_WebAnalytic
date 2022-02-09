const axios = require('axios');
const cheerio = require('cheerio');
const { next } = require('cheerio/lib/api/traversing');
const htmlparser2 = require('htmlparser2');


class scrapper {
    domain_name;
    all_url = [];
    all_url_from_where = [];
    url_status = [];
    number_url;

    constructor(){
        this.all_url = [];
    }

    start_analyze (url, number_url, cb){
        this.number_url = number_url;
        this.find_domain_name(url, (data) => {
            this.domain_name = data.domain_name;

            this.main_analyze('http://localhost:8000/', url, (data) => {
                // console.log('yop')

                console.log(this.url_status)
                console.log(this.all_url)
                // console.log(this.all_url_from_where)
                
                var status = "";
                var count = 0;
                for (const property in this.url_status) {
                    // console.log(`${property}: ${this.url_status[property]}`);
                    count ++;
                    status += count + ' = '
                    if(this.url_status[property] != 200)
                    {
                        status += `<br /><br />\n\n<p style="color:red">Cette page ce trouve sur :  ${this.all_url_from_where[property]} `+"<br />\n"+`${property} : ${this.url_status[property]}</p><br /><br />\n\n`
                    }
                    else
                    {
                        status += `${property} : ${this.url_status[property]}` + "<br />\n"
                    }
                }

                console.log(count)
                console.log(status)

                if(count == this.number_url || this.number_url == -1){
                    cb(status)
                }
            });
        });
    }

    main_analyze (url_display, url_destination, cb)
    {
        if(this.all_url.length == this.number_url && this.number_url != -1){
            return;
        }

        this.check_url_analyzed(url_destination, (data) => {
            if(!data.check)
            {
                this.all_url.push(url_destination);
                this.all_url_from_where[url_destination] = url_display;
                                
                this.url_analyze(url_display, url_destination, (data) => {
                    // console.log(this.all_url)
                    // console.log(this.all_url_from_where)                    
                    if(data.status == 200)
                    this.search_link(url_destination, data.data_url_destination, (data) =>{
                        cb({
                        });
                    });

                    cb({});
                });
            }
        })
    }

    async url_analyze (url_display, url_destination, cb)
    {
        //si oui alors je verifie le status
        try{
            let data_url_destination = await axios.get(url_destination)
            var status = data_url_destination.status
            this.url_status[url_destination] = status;
            //console.log(url_destination + "STATUS 200   " + status)

            cb({
                data_url_destination : data_url_destination,
                url_destination : url_destination,
                url_display : url_display,
                status : status,
            });

        }catch(err){
            //si status est 404 (ou autre), je le met dans url unvalid
            var status = 'ERROR'

            if (typeof err.response !== 'undefined')
            {
                status = err.response.status
                this.url_status[url_destination] = status
            
                cb({
                    url_destination : url_destination,
                    url_display : url_display,
                    status : status,
                });
            }
            // //console.log(url_destination + "ERROR 400" )

        }
    }

    search_link (url_display, data_url_destination, cb)
    {
        const $ = cheerio.load(data_url_destination.data);
       
        var all_link_temp = []

        //console.log('--------------------------------------------------Trouver des liens--------------------------------------------------')
        var a_element = $('a', data_url_destination.data)

        for (let index = 0; index < a_element.length; index++) {
            const element = a_element[index];

            if (typeof element.attribs.href !== 'undefined') {
                if(element.attribs.href.startsWith('http'))
                {
                    this.find_domain_name(element.attribs.href, (data)=>{
                        if(data.domain_name == this.domain_name)
                        {
                            this.main_analyze(url_display, element.attribs.href, (data) => {
                                cb('finish')
                                // console.log(data)
                            })
                            all_link_temp.push(element.attribs.href);
                            //console.log(element.attribs.href)
                        }
                    });
                }
            }
        }

        // cb('--------------------------------------------------Finie--------------------------------------------------')
    }

    check_url_analyzed(url_destination, cb){
        var bool = false; 
        // for (let index = 0; index < this.all_url.length; index++) {
        //     const element = this.all_url[index];
        //     if(element == url_destination)
        //     {
        //         bool = true;
        //     }
        // }

        (this.all_url.indexOf(url_destination)) != -1 ? bool = true : ''; 

        cb({check : bool})
    }

    find_domain_name(url, cb)
    {   
        var domain_name;
        if(url.substring(4,5) == "s")
        {
            domain_name = url.substring(8);
        }
        else
        {
            domain_name = url.substring(7);
        }

        if(domain_name.substring(0,3) == "www")
        {
            domain_name = domain_name.substring(4);
        }

        domain_name = domain_name.substring(0, domain_name.indexOf("."));

        cb({domain_name : domain_name});
    }
}

module.exports = scrapper;




