"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SnapTikAPI_1 = __importDefault(require("./SnapTikAPI"));
const args = process.argv;
const argsLength = args.length;
if (argsLength < 3) {
    console.log('Use like this : node dist/cli.js <tiktokVideoLink>');
    process.exit();
}
const link = args[2];
(async () => {
    const api = new SnapTikAPI_1.default();
    const downloadLink = await api.getDownloadLink(link);
    console.log(downloadLink);
})();
