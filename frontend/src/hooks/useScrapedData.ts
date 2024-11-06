import { useEffect, useState } from "react";

type RowType = { rank: number; symbol: string; company: string };

export function useScrapedData(): {
  loading: boolean;
  error: string | null;
  data: RowType[];
} {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<RowType[]>([]);

  async function getScrapedData() {
    try {
      setLoading(true);

      const response = await fetch("http://localhost:4000");

      if (!response.ok) throw new Error("Something happened");

      const data = await response.json();

      setData(data);
    } catch (error) {
      setError(error ? error.toString() : null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getScrapedData();
  }, []);

  return { loading, error, data };
}
