const axios = require('axios');


class scrapper {
    all_url = [];
    url_unvalid = [];

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

        let status = this.url_analyze(url, (data) => {

            console.log(this.get_all_url())

            cb("J'ai bien recu ton url : " + url + '<br />\nVoici son status : ' + data.status)
        });
    }

    search_link (data_url, cb)
    {

    }

    async url_analyze (url, cb)
    {
        this.set_all_url(url);

        try{
            let data_url = await axios.get(url)
            var status = data_url.status

            // this.search_link(data_url, (data) =>{

            // });
            cb({
                url : url,
                status : status
            });

        }catch(err){
            this.set_url_unvalid(url);
            var status = err.response.status
            
            cb({
                url : url,
                status : status
            });
        }
    }
}

module.exports = scrapper;




