"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cheerio = require("cheerio");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
dotenv.config();
const app = express();
app.use(cors());
const hostname = "127.0.0.1";
const port = 4000;
async function scrape() {
    const response = await fetch("https://www.slickcharts.com/sp500");
    const htmlStr = await response.text();
    const $ = cheerio.load(htmlStr);
    console.log("scraping");
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
    let jsonData = "";
    fs.readFile("data.json", "utf-8", async (err, data) => {
        if (err) {
            console.error(err);
        }
        else {
            const parsedData = JSON.parse(data);
            const oneDayMS = 1000 * 60 * 60 * 24;
            const timeNeededToFetchMS = oneDayMS * 5;
            const timeSinceLastFetchedMS = new Date().getTime() - new Date(parsedData.lastFetched).getTime();
            if (timeSinceLastFetchedMS > timeNeededToFetchMS) {
                const data = await scrape();
                jsonData = JSON.stringify({
                    lastFetched: new Date().toLocaleString(),
                    companies: data,
                }, null, 2);
                createNewFile(jsonData);
                res.send(jsonData);
            }
            else {
                jsonData = data;
                res.send(jsonData);
            }
        }
    });
});
function createNewFile(jsonData) {
    fs.unlink("data.json", (err) => {
        if (err) {
            console.error("something happened when unlinking the file");
        }
        else {
            console.log("File was deleted");
        }
    });
    fs.writeFile("data.json", jsonData, (err) => {
        if (err) {
            console.error("something happened when saving the file");
        }
        else {
            console.log("File was created");
        }
    });
}
app.listen(port, () => {
    console.log(`Server is running on ${process.env.NODE_ENV === "development"
        ? `http://${hostname}:${port}`
        : "https://sp500-scraper.onrender.com/"}`);
});
//# sourceMappingURL=server.js.map