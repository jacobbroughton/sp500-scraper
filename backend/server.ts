import express from "express";
import { Request, Response } from "express";
import * as cheerio from "cheerio";
import cors from "cors";

const app = express();

app.use(cors());

const hostname = "127.0.0.1";
const port = 4000;

async function scrape() {
  const response = await fetch("https://www.slickcharts.com/sp500");
  const htmlStr = await response.text();

  const $ = cheerio.load(htmlStr);

  const elements: any[] = [];

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

app.get("/", async (req: Request, res: Response) => {
  const data = await scrape();
  console.log(data.length);
  res.send(JSON.stringify(data));
});

app.listen(port, () => {
  console.log(`Server is running on http://${hostname}:${port}`);
});
