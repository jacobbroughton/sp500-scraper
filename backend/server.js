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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var cors = require("cors");
var cheerio = require("cheerio");
var app = express();
"<td>1</td>\n<td style=\"max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;\"><a href=\"/symbol/NVDA\">Nvidia Corp</a></td>\n<td><a href=\"/symbol/NVDA\">NVDA</a></td>\n<td>7.03%</td>\n<td class=\"text-nowrap\"><img src=\"/img/up.gif\" alt=\"\"> &nbsp;&nbsp;142.35</td>\n<td class=\"text-nowrap\" style=\"color: green\">2.44</td>\n<td class=\"text-nowrap\" style=\"color: green\">(1.74%)</td>";
app.use(cors());
var hostname = "127.0.0.1";
var port = 4000;
function scrape() {
    return __awaiter(this, void 0, void 0, function () {
        var response, htmlStr, $, elements;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://www.slickcharts.com/sp500")];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.text()];
                case 2:
                    htmlStr = _a.sent();
                    $ = cheerio.load(htmlStr);
                    elements = [];
                    $("table:first > tbody > tr").each(function (i, el) {
                        var _a, _b;
                        var htmlString = $(el).html();
                        var splitByTd = htmlString === null || htmlString === void 0 ? void 0 : htmlString.split('">');
                        if (!splitByTd) {
                            return;
                        }
                        var matchCompany = /(\b[\w\d\s]+.+(?=<\/a))/g;
                        var matchSymbol = /(\b[\w\d\s]+(?=<\/a))/g;
                        var company = (_a = splitByTd[2].match(matchCompany)) === null || _a === void 0 ? void 0 : _a[0].replace("&amp;", "&");
                        var symbol = (_b = splitByTd[3].match(matchSymbol)) === null || _b === void 0 ? void 0 : _b[0];
                        elements.push({ rank: i + 1, symbol: symbol, company: company });
                    });
                    return [2 /*return*/, elements];
            }
        });
    });
}
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, scrape()];
            case 1:
                data = _a.sent();
                console.log(data.length);
                res.send(JSON.stringify(data));
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("Server is running on http://".concat(hostname, ":").concat(port));
});