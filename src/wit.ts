import { Wit, log } from 'node-wit';
import { Botkit, BotkitMessage, BotWorker } from 'botkit'
import './env';

const client = new Wit({
  accessToken: process.env.WIT_AI_TOKEN,
  logger: new log.Logger(log.DEBUG),
});

interface WitMiddleware {
  receive(bot: Botkit, message: BotkitMessage, next: Function): void;
  hears(bot: BotWorker, message: BotkitMessage): Promise<any> ;
}

const middleware: WitMiddleware = {
  receive: (bot: Botkit, message: BotkitMessage, next): void => {
    if (message.text) {
      // try {
      //   const data = await client.message(message.text);
      //   message.entities = data.entities;
      //   debugger
      //   next();
      // } catch (error) {
      //   next(error);
      // }
      client.message(message.text).then(({entities}) => {
        message.entities = entities
        console.log('WIT returned')
        next();
      }).catch((error) => {
        console.error(error)
        next(error)
      })
    } else if (message.attachments) {
      message.intents = [];
      next();
    } else {
      next();
    }
  },

  hears: async (bot: BotWorker, message: BotkitMessage): Promise<any> => {
    // if (message.entities && message.entities.intent) {
    //   for (var i = 0; i < message.entities.intent.length; i++) {
    //     for (var t = 0; t < tests.length; t++) {
    //       if (
    //         message.entities.intent[i].value == tests[t] &&
    //         message.entities.intent[i].confidence >= 0.5
    //       ) {
    //         return true;
    //       }
    //     }
    //   }
    // }

    // Always continue the message if wit cannot detect anything
    // console.log('TRUE')
    // return true;
    await bot.reply(message, `Echo: ${message.text}`);
  },
};

export = middleware
