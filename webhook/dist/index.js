"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWebhook = exports.SlackWebhook = exports.DiscordWebhook = void 0;
var discord_1 = require("./discord");
Object.defineProperty(exports, "DiscordWebhook", { enumerable: true, get: function () { return discord_1.DiscordWebhook; } });
var slack_1 = require("./slack");
Object.defineProperty(exports, "SlackWebhook", { enumerable: true, get: function () { return slack_1.SlackWebhook; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "sendWebhook", { enumerable: true, get: function () { return utils_1.sendWebhook; } });
//# sourceMappingURL=index.js.map