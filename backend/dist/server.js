"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cheerio = __importStar(require("cheerio"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const hostname = "127.0.0.1";
const port = 4000;
async function scrape() {
    const response = await fetch("https://www.slickcharts.com/sp500");
    const htmlStr = await response.text();
    const $ = cheerio.load(htmlStr);
    const elements = [];
    $("table:first > tbody > tr").each((i, el) => {
        const htmlString = $(el).html();
        const splitByTd = htmlString?.split('">');
        if (!splitByTd) {
            return;
        }
        const matchCompany = /(\b[\w\d\s]+.+(?=<\/a))/g;
        const matchSymbol = /(\b[\w\d\s]+(?=<\/a))/g;
        const company = splitByTd[2].match(matchCompany)?.[0].replace("&amp;", "&");
        const symbol = splitByTd[3].match(matchSymbol)?.[0];
        elements.push({ rank: i + 1, symbol, company });
    });
    return elements;
}
app.get("/", async (req, res) => {
    const data = await scrape();
    console.log(data.length);
    res.send(JSON.stringify(data));
});
app.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});
//# sourceMappingURL=server.js.map