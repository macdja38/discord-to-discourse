const request = require('request');
const dotenv = require('dotenv').config();
const Eris = require('eris');

['FORM_ROOT', 'API_KEY', 'API_USERNAME', 'TOPIC_ID', 'DISCORD_TOKEN', 'DISCORD_CHANNEL'].forEach((key) => {
  if (!Object.hasOwnProperty.call(process.env, key)) {
    throw new Error(`Please supply an environment variable of name ${key}
    You can do soo in the .env file you can make by duplicating .env.example and naming it .env`)
  }
});

const options = {
  method: 'POST',
  url: `${process.env.FORM_ROOT}babble/topics/${process.env.TOPIC_ID}/posts`,
  headers:
    {
      'cache-control': 'no-cache',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  form:
    {
      raw: '',
      api_key: process.env.API_KEY,
      api_username: process.env.API_USERNAME,
    }
};

function createOptions(raw) {
  return Object.assign({}, options, { form: Object.assign({}, options.form, { raw }) })
}

function sendToDiscourse(raw) {
  return new Promise((resolve, reject) => {
    request(createOptions(raw), function (error, response, body) {
      try {
        if (error) reject(new Error(error));

        resolve(JSON.parse(body));
      } catch (error) {
        reject(error);
      }
    });
  })
}

const bot = new Eris(process.env.DISCORD_TOKEN);
bot.on("ready", () => {
  console.log(`Ready as ${bot.user.username}!`);
});
bot.on("messageCreate", (msg) => {
  if (msg.channel.id === process.env.DISCORD_CHANNEL) {
    console.log(msg.author.nick, msg.member.nick);
    if (msg.author && msg.content && msg.content.length > 0) {
      if (msg.member.nick) {
        sendToDiscourse(`${msg.member.nick} (${msg.author.username}#${msg.author.discriminator}): ${msg.content}`);
      } else {
        sendToDiscourse(`(${msg.author.username}#${msg.author.discriminator}): ${msg.content}`);
      }
    }
  }
});
bot.connect();


