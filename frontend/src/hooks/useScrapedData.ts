import { useEffect, useState } from "react";

export function useScrapedData(): {
  loading: boolean;
  error: string | null;
  data: { rank: number; symbol: string; company: string }[];
} {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  async function getScrapedData() {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:4000");

      if (!response.ok) throw new Error("Something happened");

      const data = await response.json();

      setData(data);
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getScrapedData();
  }, []);

  return { loading, error, data };
}
