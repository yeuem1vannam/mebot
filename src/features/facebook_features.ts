import * as wit from '../wit'

const handler: Function = (controller) => {
  /**
   * Detect when a message has a sticker attached
   */
  controller.hears(
    async message => message.sticker_id,
    'message',
    async (bot, message) => {
      await bot.reply(message, 'Cool sticker.');
    }
  );

  controller.on('facebook_postback', async (bot, message) => {
    await bot.reply(
      message,
      `I heard you posting back a post_back about ${message.text}`
    );
  });

  controller.on('message', wit.hears, async (bot, message) => {
    await bot.reply(message, `Echo: ${message.text}`);
  });
}

export = handler