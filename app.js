const cheerio = require("cheerio");
const axios = require("axios");
const api = require("node-telegram-bot-api");

const config = require("./config.json");


const TOKEN = process.env.TOKEN || config.TOKEN;
const joke_url = config.joke_url;

const options = {
    webHook: {
      // Port to which you should bind is assigned to $PORT variable
      // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
      port: process.env.PORT
      // you do NOT need to set up certificates since Heroku provides
      // the SSL certs already (https://<app-name>.herokuapp.com)
      // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
    }
};

const url = process.env.APP_URL || config.url; 
const bot = new api(TOKEN, options);
//const bot = new api(TOKEN, {polling: true});
bot.setWebHook(`${url}/bot${TOKEN}`);

async function getHtml(joke_url){
    return axios.get(joke_url).then(res => res.data);
}

/*bot.onText(/\/joke/, (msg) => {
    const chatId = msg.chat.id;
    getHtml(joke_url)
        .then(html => {
            const $ = cheerio.load(html);
                    
            const data = $('p')[0].children;
            let joke = "";
            data.forEach(Node => {
                if(Node.data){
                    joke += Node.data;
                    joke += '\n';
                }   
            }); 
            bot.sendMessage(chatId, joke);
        })
        .catch(err => console.log(err));
});*/
bot.on("message", (msg) => {
    bot.sendMessage(msg.chat.id, "Hello");
});



/*
bot.onText(/\/joke/, (msg) => {

    const chatId = msg.chat.id;

    axios(joke_url)
        .then(res => {
            const html = res.data;
            const $ = cheerio.load(html);
            
            const _data = $('p')[0].children;
            let joke = "";
            _data.forEach(Node => {
                if(Node.data){
                    joke += Node.data;
                    joke += '\n';
                }   
            });
            bot.sendMessage(chatId, joke);
        }).catch((err) => {
            console.log(err)
        });

        
});*/