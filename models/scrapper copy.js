const axios = require('axios');
const cheerio = require('cheerio');
const { next } = require('cheerio/lib/api/traversing');
const htmlparser2 = require('htmlparser2');


class scrapper {
    domain_name;
    all_url = [];
    all_url_from_where = [];
    url_status = [];

    constructor(){
        this.all_url = [];
    }

    get_all_url () {
        return this.all_url;
    }

    get_url_unvalid () {
        return this.url_unvalid;
    }
    
    set_all_url (url) {
        this.all_url.push(url);
    }

    set_url_unvalid (url) {
        this.url_unvalid.push(url);
    }

    start_analyze (url, cb){

        this.all_url.push('http://google.com');
        this.all_url_from_where['http://google.com'] = 'http://localhost:8000/';
        this.url_status['http://google.com'] = 200;

        this.find_domain_name(url, (data) => {
            this.domain_name = data.domain_name;

            this.main_analyze('http://localhost:8000/', url, (data) => {

                console.log(this.url_status)
                console.log(this.all_url)
                console.log(this.all_url_from_where)
    
                cb("J'ai bien recu ton url : " + data.url_destination + '<br />\nQui vient de cette url : ' + data.url_display + '<br />\nVoici son status : ' + data.status)
            });
        });
    }

    main_analyze (url_display, url_destination, cb)
    {
        console.log(url_destination);
        //check si j'ai mon url dans le tableau all url
        // this.all_url.push(url_destination);
        // this.all_url_from_where[url_destination] = url_display;

        this.check_url_analyzed(url_destination, (data) => {
            if(!data.check)
            {
                //check si j'ai mon url dans le tableau all url
                this.all_url.push(url_destination);
                this.all_url_from_where[url_destination] = url_display;
                
                                
                this.url_analyze(url_display, url_destination, (data) => {
                    cb({
                        url_destination : data.url_destination,
                        url_display : data.url_display,
                        status : data.status
                    });
                });
            }
            else
            {
                cb({
                    url_destination : url_destination,
                    url_display : this.all_url_from_where[url_destination],
                    status : this.url_status[url_destination]
                });
                console.log('Le lien a déjà été analysé')
            }
        })
    }

    search_link (url_display, data_url_destination, cb)
    {
        const $ = cheerio.load(data_url_destination.data);
       
        var all_link_temp = []

        console.log('--------------------------------------------------Trouver des liens--------------------------------------------------')
        var a_element = $('a', data_url_destination.data)

        for (let index = 0; index < a_element.length; index++) {
            const element = a_element[index];

            if (typeof element.attribs.href !== 'undefined') {
                if(element.attribs.href.startsWith('http'))
                {
                    this.find_domain_name(element.attribs.href, (data)=>{
                        if(data.domain_name == this.domain_name)
                        {
                            // this.main_analyze(url_display, element.attribs.href, (data) => {

                            // })
                            all_link_temp.push(element.attribs.href);
                            console.log(element.attribs.href)
                        }
                    });
                }
            }
        }

        cb('--------------------------------------------------Finie--------------------------------------------------')
    }

    async url_analyze (url_display, url_destination, cb)
    {
        //si oui alors je verifie le status
        try{
            let data_url_destination = await axios.get(url_destination)
            var status = data_url_destination.status
            this.url_status[url_destination] = status;

            //si le status est 200, alors je cherche les url sur le site
            this.search_link(url_destination, data_url_destination, (data) =>{
                console.log(data)
            });

            cb({
                url_destination : url_destination,
                url_display : url_display,
                status : status
            });

        }catch(err){
            //si status est 404 (ou autre), je le met dans url unvalid
            var status = err.response.status
            this.url_status[url_destination] = status
            
            cb({
                url_destination : url_destination,
                url_display : url_display,
                status : status
            });
        }

    }

    check_url_analyzed(url_destination, cb){
        var bool = false; 
        for (let index = 0; index < this.all_url.length; index++) {
            const element = this.all_url[index];
            if(element == url_destination)
            {
                bool = true;
            }
        }

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




