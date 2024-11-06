import * as React from "react";
import { useScrapedData } from "./hooks/useScrapedData";

function App(): JSX.Element {
  const { loading, data: scrapedData } = useScrapedData();

  return (
    <>
      <main>
        <h1>S&P 500 Scraper</h1>
        {loading ? (
          <p>List loading...</p>
        ) : (
          <div className="table-parent">
            <table>
              <thead>
                <tr>
                  <th>Rank</th> <th>Symbol</th> <th>Company</th>
                </tr>
              </thead>
              <tbody>
                {scrapedData.map((row) => (
                  <tr>
                    <td className="rank">{row.rank}</td>
                    <td className="symbol">{row.symbol}</td>
                    <td className="company">{row.company}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}

export default App;
