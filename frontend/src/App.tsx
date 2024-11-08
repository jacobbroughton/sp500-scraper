import { useScrapedData } from "./hooks/useScrapedData.ts";

function App() {
  const { loading, error, data: scrapedData } = useScrapedData();

  return (
    <main>
      <h1>S&P 500 Scraper</h1>
      <div className="footnotes">
        <p>Data updates every 5 days</p>
        <p>Last scrape: {loading ? "N/A" : scrapedData.lastFetched}</p>
      </div>
      {error ? (
        <div className="error">
          <p>
            <strong>
              <i>⚠️ Error</i>
            </strong>
          </p>
          <p>
            <i>{error}</i>
            <p>
              <strong>Hint:</strong> Try turning it on and off again
            </p>
          </p>
        </div>
      ) : loading ? (
        <div className="loading">
          <p>
            <strong>List loading...</strong>
          </p>
          <p>
            <i>If this is taking a while:</i>
          </p>
          <ul>
            <li>- The website is broken (sorry)</li>
            <li>- or</li>
            <li>- The data is being scraped again, which can take a moment</li>
          </ul>
        </div>
      ) : (
        <div className="table-parent">
          <table>
            <thead>
              <tr>
                <th>Rank</th> <th>Symbol</th> <th>Company</th>
              </tr>
            </thead>
            <tbody>
              {scrapedData.companies.map(
                (row: { rank: number; symbol: string; company: string }) => (
                  <tr>
                    <td className="rank">{row.rank}</td>
                    <td className="symbol">{row.symbol}</td>
                    <td className="company">{row.company}</td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default App;
