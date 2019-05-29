// const { Wit, log } = require('node-wit');
const { Wit, log } = require('node-wit');
require('dotenv').config();

const client = new Wit({
  accessToken: process.env.WIT_AI_TOKEN,
  logger: new log.Logger(log.DEBUG),
});

const middleware = {};

middleware.receive = async (bot, message, next) => {
  console.log('MIDDLEWARE RECEIVE');
  if (message.text) {
    try {
      const data = await client.message(message.text);
      message.entities = data.entities;
      next();
    } catch (error) {
      next(error);
    }
  } else if (message.attachments) {
    message.intents = [];
    next();
  } else {
    next();
  }
};

middleware.hears = (tests, message) => {
  if (message.entities && message.entities.intent) {
    for (var i = 0; i < message.entities.intent.length; i++) {
      for (var t = 0; t < tests.length; t++) {
        if (
          message.entities.intent[i].value == tests[t] &&
          message.entities.intent[i].confidence >= config.minimum_confidence
        ) {
          return true;
        }
      }
    }
  }

  return false;
};

module.exports = middleware;
