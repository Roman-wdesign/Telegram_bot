require('dotenv').config();
const {
  Bot,
  Keyboard,
  GrammyError,
  HttpError,
  InlineKeyboard,
} = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN);

bot.command('start', async (ctx) => {
  const startKeyboard = new Keyboard()
    .text('отложенное сообщение ⌛')
    .text('Продукт  2')
    .row()
    .text('Продукт  3')
    .text('Продукт  4')
    .text('Продукт  5')
    .text('Продукт  6')
    .resized();
  await ctx.reply('Привет user');
  await ctx.reply('Выберите необходимую услугу', {
    reply_markup: startKeyboard,
  });
});

bot.hears(
  ['отложенное сообщение ⌛', 'Продукт  2', 'Продукт  3', 'Продукт  4'],
  async (ctx) => {
    const inlineKeyboard = new InlineKeyboard()
      .text('Далее', 'next')
      .text('Отменить', 'cancel');
    await ctx.reply(`Выбрано ${ctx.message.text}`, {
      reply_markup: inlineKeyboard,
    });
  }
);
bot.on('callback_query:data', async (ctx) => {
  if (ctx.callbackQuery.data === 'cancel') {
    await ctx.answerCallbackQuery('Отменено пользователем');
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error('Error in request:', e.description);
  } else if (e instanceof HttpError) {
    console.error('Could not contact Telegram:', e);
  } else {
    console.error('Unknown error:', e);
  }
});

bot.start();
