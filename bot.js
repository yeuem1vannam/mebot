//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the mebot bot.

// Import Botkit's core features
const { Botkit } = require('botkit');
const { BotkitCMSHelper } = require('botkit-plugin-cms');
const wit = require('./wit')

// Import a platform-specific adapter for facebook.

const {
  FacebookAdapter,
  FacebookEventTypeMiddleware,
} = require('botbuilder-adapter-facebook');

const { MongoDbStorage } = require('botbuilder-storage-mongodb');

// Load process.env values from .env file
require('dotenv').config();

let storage = null;
if (process.env.MONGO_URI) {
  storage = mongoStorage = new MongoDbStorage({
    url: process.env.MONGO_URI,
  });
}

const adapter = new FacebookAdapter({
  verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
  access_token: process.env.FACEBOOK_ACCESS_TOKEN,
  app_secret: process.env.FACEBOOK_APP_SECRET,
});

// emit events based on the type of facebook event being received
adapter.use(new FacebookEventTypeMiddleware());

const controller = new Botkit({
  debug: true,
  webhook_uri: '/api/messages',

  adapter: adapter,

  storage,
});

// Log every message received
// controller.middleware.receive.use(function(bot, message, next) {
//   // log it
//   console.log('RECEIVED: ', message);

//   // modify the message
//   message.logged = true;

//   // continue processing the message
//   next();
// });

// // Log every message sent
// controller.middleware.send.use(function(bot, message, next) {
//   // log it
//   console.log('SENT: ', message);

//   // modify the message
//   message.logged = true;

//   // continue processing the message
//   next();
// });

if (process.env.cms_uri) {
  controller.usePlugin(
    new BotkitCMSHelper({
      cms_uri: process.env.cms_uri,
      token: process.env.cms_token,
    })
  );
}

controller.middleware.receive.use(wit.receive);

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
  // load traditional developer-created local custom feature modules
  controller.loadModules(__dirname + '/features');

  /* catch-all that uses the CMS to trigger dialogs */
  if (controller.plugins.cms) {
    controller.on('message,direct_message', async (bot, message) => {
      let results = false;
      results = await controller.plugins.cms.testTrigger(bot, message);

      if (results !== false) {
        // do not continue middleware!
        return false;
      }
    });
  }
});
