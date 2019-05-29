import { Wit, log } from 'node-wit';
import './env';

const client = new Wit({
  accessToken: process.env.WIT_AI_TOKEN,
  logger: new log.Logger(log.DEBUG),
});

interface WitMiddleware {
  receive(bot: any, message: any, next: Function): Promise<any>;
  hears(tests: any, message: any): boolean;
}

const middleware: WitMiddleware = {
  receive: async (bot, message, next) => {
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
  },

  hears: (tests, message) => {
    if (message.entities && message.entities.intent) {
      for (var i = 0; i < message.entities.intent.length; i++) {
        for (var t = 0; t < tests.length; t++) {
          if (
            message.entities.intent[i].value == tests[t] &&
            message.entities.intent[i].confidence >= 0.5
          ) {
            return true;
          }
        }
      }
    }

    return false;
  },
};

export = middleware
