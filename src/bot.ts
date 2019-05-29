import { Botkit } from 'botkit'
import './env';

import * as wit from './wit'

import {
  FacebookAdapter,
  FacebookEventTypeMiddleware,
} from 'botbuilder-adapter-facebook';

import { MongoDbStorage } from 'botbuilder-storage-mongodb';

let storage = null;
if (process.env.MONGO_URI) {
  storage = new MongoDbStorage({
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
  webhook_uri: '/api/messages',
  adapter: adapter,
  storage,
});

controller.middleware.receive.use(wit.receive);

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
  // load traditional developer-created local custom feature modules
  controller.loadModules(__dirname + '/features');
});
