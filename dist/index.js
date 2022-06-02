"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = require("./router/router");
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("./constants/constants");
const PORT = process.env.PORT || 3001;
const { Telegraf, Markup } = require("telegraf");
const express = require('express');
const app = express();
app.use(router_1.router);
const bot = new Telegraf("5328421039:AAFDwR4EuciuJ5kVvTLtqK1ZsgFxWq24F6s");
bot.start((ctx) => ctx.reply(`Приветствую, ${ctx.from.first_name ? ctx.from.first_name : "хороший человек"}! Набери /help и увидишь, что я могу.`));
bot.help((ctx) => ctx.reply("- /start - возвращает приветственное сообщение;\n" +
    "- /help - возвращает краткую информацию о боте и его список команд;\n" +
    "- /listRecent - Получить небольшой (20-50 айтемов) список хайповой" +
    " крипты. один айтем должен выглядеть примерно так: `/BTC $250`, т.е. 250 - последняя средняя цена для крипты," +
    " /BTC - активная команда, при нажатии на которую юзер получит более подробную информацию про эту криптовалюту;" +
    " В более подробной информации указать истории средней цены за последние\n" +
    "24 часа. (вывести: 30 мин, 1 час, 3 часа, 6 часов, 12 часов, 24 часа).\n" +
    "- /{currency_symbol} получить подробную информацию о криптовалюте." +
    " С сообщением о информации так же прилетает инлайн кнопка - Add/Remove to/from following в зависимости от того," +
    " есть крипта в фолловинг листе;" +
    "- /addToFavourite {currency_symbol} -  Добавляет крипту в раздел \"избранное\";\n" +
    "- /listFavourite - возвращает лист избранной крипты в формате /listRecent;\n" +
    "- /deleteFavourite {currency_symbol} - удаляет крипту из избранного."));
bot.command("listRecent", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let result = yield axios_1.default.get(constants_1.SERV_DOMAIN + '/listRecent');
        return ctx.replyWithMarkdown(result.data);
    }
    catch (e) {
        console.error(e);
    }
}));
bot.command("addToFavourite", (ctx) => {
    return ctx.replyWithMarkdown('addFavourite');
});
bot.command("deleteFavourite", (ctx) => {
    return ctx.replyWithMarkdown('deleteFavourite');
});
bot.command("listFavourite", (ctx) => {
    return ctx.replyWithMarkdown('WTF');
});
bot.on("text", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const coinName = ctx.message.text;
        const result = yield axios_1.default.get(constants_1.SERV_DOMAIN + '/coinInfo' + coinName);
        const inFavorite = result.data[1] ? 'Remove from following' : 'Add to following';
        return ctx.reply(result.data[0], Markup.inlineKeyboard([
            Markup.button.callback(`${inFavorite}`, 'toFavourite'),
        ]));
    }
    catch (e) {
        console.error(e);
    }
}));
bot.action('toFavourite', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const coinName = ctx.update.callback_query.message.text.split(' ')[0];
    axios_1.default.get(constants_1.SERV_DOMAIN + '/favorite' + coinName);
    ctx.editMessageText('Complete OK');
}));
bot.launch();
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
