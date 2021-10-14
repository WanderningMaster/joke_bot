const cheerio = require("cheerio");
const axios = require("axios");
const api = require("node-telegram-bot-api");
const schedule = require('node-schedule');

const config = require("./config.json");

/*bot config*/
const TOKEN = process.env.TOKEN || config.TOKEN;
const joke_url = config.joke_url;

const options = {
    webHook: {
      port: process.env.PORT
    }
};

const url = process.env.APP_URL || config.url; 
const bot = new api(TOKEN, options);
//const bot = new api(TOKEN, {polling: true});
bot.setWebHook(`${url}/bot${TOKEN}`);


/*parsing*/
async function getHtml(joke_url){
    return axios.get(joke_url).then(res => res.data);
}
function getJoke($){
    const data = $('p')[0].children;
    let joke = "";
    data.forEach(Node => {
        if(Node.data){
            joke += Node.data;
            joke += '\n';
        }   
    });

    return joke;
}
let jokes = [];



/*commands*/
bot.onText(/\/joke/, (msg) => {
    const chatId = msg.chat.id;
    getHtml(joke_url)
        .then(html => {
            const $ = cheerio.load(html);
            const joke = getJoke($);
             
            bot.sendMessage(chatId, joke);
            jokes.push(joke);
        })
        .catch(err => console.log(err));
});

bot.onText(/\/all/, (msg) => {
    const chatId = msg.chat.id;
    jokes.forEach(joke => bot.sendMessage(chatId, joke));
});
