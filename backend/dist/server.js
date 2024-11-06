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
const express_1 = __importDefault(require("express"));
var cors = require("cors");
const cheerio = __importStar(require("cheerio"));
const app = (0, express_1.default)();
app.use(cors());
const hostname = "127.0.0.1";
const port = 4000;
function scrape() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch("https://www.slickcharts.com/sp500");
        const htmlStr = yield response.text();
        const $ = cheerio.load(htmlStr);
        const elements = [];
        $("table:first > tbody > tr").each((i, el) => {
            var _a, _b;
            const htmlString = $(el).html();
            const splitByTd = htmlString === null || htmlString === void 0 ? void 0 : htmlString.split('">');
            if (!splitByTd) {
                return;
            }
            const matchCompany = /(\b[\w\d\s]+.+(?=<\/a))/g;
            const matchSymbol = /(\b[\w\d\s]+(?=<\/a))/g;
            const company = (_a = splitByTd[2].match(matchCompany)) === null || _a === void 0 ? void 0 : _a[0].replace("&amp;", "&");
            const symbol = (_b = splitByTd[3].match(matchSymbol)) === null || _b === void 0 ? void 0 : _b[0];
            elements.push({ rank: i + 1, symbol, company });
        });
        return elements;
    });
}
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield scrape();
    console.log(data.length);
    res.send(JSON.stringify(data));
}));
app.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
});
//# sourceMappingURL=server.js.map