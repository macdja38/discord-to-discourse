const request = require('request');
const dotenv = require('dotenv').config();
const Eris = require('eris');

['FORUM_ROOT', 'API_KEY', 'API_USERNAME', 'DISCORD_TOKEN', 'DISCORD_CHANNEL_TO_TOPIC_ID'].forEach((key) => {
  if (!Object.hasOwnProperty.call(process.env, key)) {
    throw new Error(`Please supply an environment variable of name ${key}
    You can do soo in the .env file you can make by duplicating .env.example and naming it .env`)
  }
});

let mapping = {};
try {
  mapping = JSON.parse(process.env.DISCORD_CHANNEL_TO_TOPIC_ID);
} catch (error) {
  console.log('An explicit mapping was not defined.');
  console.log(process.env.DISCORD_CHANNEL_TO_TOPIC_ID);
  console.error(error);
  console.log('Falling back to DISCORD_CHANNEL and TOPIC_ID env variables. Migration to DISCORD_CHANNEL_TO_TOPIC_ID mapping recommended.');
  mapping[process.env.DISCORD_CHANNEL] = process.env.TOPIC_ID;
}

function createURL(topicId) {
  return `${process.env.FORUM_ROOT}babble/topics/${topicId}/posts`;
}

const options = {
  method: 'POST',
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

function createOptions(topicId, raw) {
  return Object.assign({}, options, {
    uri: createURL(topicId),
    form: Object.assign({}, options.form, { raw }),
  });
}

function sendToDiscourse(topicId, raw) {
  return new Promise((resolve, reject) => {
    request(createOptions(topicId, raw), function (error, response, body) {
      try {
        if (error) reject(new Error(error));
        resolve(JSON.parse(body));
      } catch (error) {
        reject({ body, error });
      }
    });
  })
}

const bot = new Eris(process.env.DISCORD_TOKEN);
bot.on("ready", () => {
  console.log(`Ready as ${bot.user.username}!`);
});
bot.on("messageCreate", (msg) => {
  if (mapping.hasOwnProperty(msg.channel.id)) {
    const topicId = mapping[msg.channel.id];
    if (msg.author && msg.content && msg.content.length > 0) {
      let content;
      if (msg.member.nick) {
        content = `${msg.member.nick} (${msg.author.username}#${msg.author.discriminator}): ${msg.content}`;
      } else {
        content = `(${msg.author.username}#${msg.author.discriminator}): ${msg.content}`;
      }
      console.log(`Sending ${content}`);
      sendToDiscourse(topicId, content).catch(console.error);
    }
  }
});
bot.connect();


