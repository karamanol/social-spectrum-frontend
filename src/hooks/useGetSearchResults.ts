import { useEffect, useState } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";
import axios, { AxiosError } from "axios";

export type SearchResult = {
  namesSearch: {
    id: number;
    name: string;
    profilePicture?: string;
    username: string;
  }[];
  postsSearch: {
    id: number;
    image?: string;
    textContent: string;
    userId: number;
  }[];
};

const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));

export function useGetSearchResults(searchString: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [resultsFound, setResultsFound] = useState<SearchResult | undefined>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    (async () => {
      if (!searchString || searchString.length < 3)
        return setResultsFound(undefined);
      await delay(800);
      setIsLoading(true);
      const controller = new AbortController();

      async function searchByQuery(query: string) {
        try {
          const url = `/search?${new URLSearchParams({
            searchString: query,
          })}`;
          const response = await axios.get(url);

          if ("data" in response) {
            setResultsFound(response.data as SearchResult);
          }
        } catch (err) {
          const errorMessage =
            err instanceof AxiosError
              ? err.response?.data?.message
              : getErrorMessage(err);
          setError(errorMessage);
          throw new Error(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }

      searchByQuery(searchString);

      // cleanup
      return () => {
        controller.abort();
      };
    })();
  }, [searchString]);

  return { resultsFound, isLoading, error };
}
