import { useState } from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { useGetSearchResults } from "../hooks/useGetSearchResults";
import SearchResults from "./SearchResults";
import { cn } from "../utils/cn";
import SpinnerCircle from "./SpinnerCircle";
import { useOutsideClick } from "../hooks/useOutsideClick";

function Search({ fullPageMode }: { fullPageMode: boolean }) {
  const [searchInput, setSearchInput] = useState<string>("");
  const { resultsFound, isLoading } = useGetSearchResults(searchInput);
  const ref = useOutsideClick(() => {
    setSearchInput("");
  });

  const showSearchResults =
    searchInput.length > 2 &&
    resultsFound &&
    "namesSearch" in resultsFound &&
    "postsSearch" in resultsFound &&
    ((Array.isArray(resultsFound.namesSearch) &&
      resultsFound.namesSearch.length > 0) ||
      (Array.isArray(resultsFound.postsSearch) &&
        resultsFound.postsSearch.length > 0));

  const noResultsFound =
    searchInput.length > 2 &&
    resultsFound &&
    "namesSearch" in resultsFound &&
    "postsSearch" in resultsFound &&
    Array.isArray(resultsFound.namesSearch) &&
    resultsFound.namesSearch.length === 0 &&
    Array.isArray(resultsFound.postsSearch) &&
    resultsFound.postsSearch.length === 0;

  return (
    <div
      ref={fullPageMode ? undefined : ref}
      className={cn(
        "relative",
        fullPageMode ? "" : "transition-shadow ml-2 hidden sm:block"
      )}>
      <label htmlFor="search">
        <HiMiniMagnifyingGlass
          className={cn(
            "absolute dark:text-gray-200 text-neutral-600",
            fullPageMode ? "h-10 scale-125 left-4" : "h-7 scale-110 left-1"
          )}
        />
      </label>
      <input
        autoComplete="off"
        spellCheck="false"
        value={searchInput}
        onChange={(e) => {
          setSearchInput(e.target.value);
        }}
        id="search"
        type="text"
        placeholder={
          fullPageMode ? "Search" : "Search for posts or user / username..."
        }
        className={cn(
          "peer rounded border focus-visible:border-gray-400 dark:focus-visible:border-gray-600 border-gray-200 dark:border-gray-600 outline-none pl-7 pr-2 py-1 transition-all dark:bg-[#2f333d] bg-white font-semibold dark:text-gray-100 dark:placeholder:text-slate-400",
          showSearchResults
            ? "border-b-white rounded-b-none w-96 dark:border-gray-600 border-gray-400"
            : null,
          fullPageMode ? "w-full h-10 pl-10" : "text-sm w-72 focus:w-96 h-7"
        )}
      />
      {isLoading ? (
        <SpinnerCircle
          containerClassName="absolute right-2 top-0 h-5 w-5 top-1/2 -translate-y-1/2"
          iconClassName="fill-gray-600 dark:text-gray-400"
        />
      ) : (
        searchInput.length > 0 && (
          <button
            onClick={() => setSearchInput("")}
            className={cn(
              "absolute text-sm right-2 dark:text-gray-200 text-neutral-600 font-semibold",
              fullPageMode ? "h-10 text-lg" : "h-7"
            )}>
            <span>&#10005;</span>
          </button>
        )
      )}
      {noResultsFound ? (
        <div className="absolute w-full dark:bg-[#2f333d] border border-gray-200 dark:border-gray-600 border-t-0 rounded-b -translate-y-[3px] py-1 text-gray-700 dark:text-gray-300 pl-2 bg-sky-50 peer-focus-visible:border-gray-400 dark:peer-focus-visible:border-gray-600">
          No results for this query
        </div>
      ) : (
        showSearchResults && (
          <SearchResults
            fullPageMode={fullPageMode}
            searchInput={searchInput}
            resultsFound={resultsFound}
            setSearchInput={setSearchInput}
          />
        )
      )}
    </div>
  );
}

export default Search;
