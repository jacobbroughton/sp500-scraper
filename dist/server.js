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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const cheerio = __importStar(require("cheerio"));
const cors = __importStar(require("cors"));
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
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
            throw err;
        }
        if (!data) {
            const data = await scrape();
            jsonData = JSON.stringify({
                lastFetched: new Date().toLocaleString(),
                companies: data,
            }, null, 2);
            createNewFile(jsonData);
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
            }
            else {
                jsonData = data;
            }
        }
        const parsedJsonData = JSON.parse(jsonData);
        // res.send(jsonData)
        // return
        res.send(`
      <html>
      <head>
        <style>
          :root {
            font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
            line-height: 1.5;
            font-weight: 400;

            color-scheme: light dark;
            color: rgba(255, 255, 255, 0.87);
            background-color: #242424;

            font-synthesis: none;
            text-rendering: optimizeLegibility;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }

          * {
            padding: 0;
            margin: 0;
          }

          main {
            margin: 0 auto;
            max-width: 520px;
            padding-bottom: 50px;
          }

          main > div.footnotes {
            margin-bottom: 10px;
          }

          main > div.footnotes > p {
            font-size: 0.875rem;
          }

          main > h1 {
            margin: 30px 0 10px 0;
          }

          main > div.error {
            border: 1px solid crimson;
            border-radius: 5px;
            padding: 10px;
            color: crimson;
            font-size: 0.875rem;
          }

          main > div.error > p:first-child {
            font-size: 1rem;
          }

          main > div.table-parent,
          main > div.loading {
            border: 1px solid #555;
            border-radius: 5px;
            padding: 10px;
          }

          main > div.table-parent > table {
          }

          main > div.table-parent > table > thead > tr > th,
          main > div.table-parent > table > tbody > tr > td {
            text-align: start;
            padding: 3px 5px;
          }

          main > div.table-parent > table > thead > tr > th {
            padding-top: 0;
          }

          main > div.table-parent > table > tbody > tr > td.rank {
            color: grey;
          }

          main > div.loading {
            display: flex;
            gap: 5px;
            flex-direction: column;
          }

          main > div.loading > ul {
            list-style: none;
          }
        </style>
      </head>
        <body>

           <main>
            <h1>S&P 500 Scraper</h1>
            <div class="footnotes">
              <p>Data updates every 5 days</p>
              <p>Last scrape: ${parsedJsonData.lastFetched}</p>
            </div>
            
            <div class="table-parent">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th> <th>Symbol</th> <th>Company</th>
                  </tr>
                </thead>
                <tbody>
                  ${parsedJsonData.companies.map((company) => `
                      <tr>
                        <td class="rank">${company.rank}</td>
                        <td class="symbol">${company.symbol}</td>
                        <td class="company">${company.company}</td>
                      </tr>
                      `).join("")}
                </tbody>
              </table>
            </div>
            
          </main>
        </body>
      </html>
    `);
    });
});
function createNewFile(jsonData) {
    fs.writeFile("data.json", "", (err) => {
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