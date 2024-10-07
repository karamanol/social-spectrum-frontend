import { useAutoAnimate } from "@formkit/auto-animate/react";
import { SearchResult } from "../hooks/useGetSearchResults";
import defaultUserImage from "../assets/default-user.jpg";
import { Link } from "react-router-dom";
import { Dispatch, SetStateAction } from "react";
import React from "react";
import { cn } from "../utils/cn";

type SearchResultsProps = {
  resultsFound: SearchResult | undefined;
  setSearchInput: Dispatch<SetStateAction<string>>;
  searchInput: string;
  fullPageMode: boolean;
};

const highlightMatchingText = (text: string, matchingText: string) => {
  const matchRegex = RegExp(matchingText, "ig");
  const matches = [...text.matchAll(matchRegex)];

  return text.split(matchRegex).map((nonBoldText, index, arr) => (
    <React.Fragment key={index}>
      {nonBoldText}
      {index + 1 !== arr.length && (
        <mark className="bg-sky-200 dark:bg-sky-900 text-inherit px-[1px]">
          {matches[index]}
        </mark>
      )}
    </React.Fragment>
  ));
};

function SearchResults({
  resultsFound,
  setSearchInput,
  searchInput,
  fullPageMode,
}: SearchResultsProps) {
  const namesSearch = resultsFound?.namesSearch;
  const postsSearch = resultsFound?.postsSearch;
  const [parent] = useAutoAnimate();

  return (
    <div
      ref={parent}
      className={cn(
        "w-full bg-white dark:bg-[#2f333d] border border-gray-400 dark:border-gray-600 border-t-0 rounded-b -translate-y-[2px] py-1 text-gray-700 dark:text-gray-300",
        fullPageMode ? "" : "absolute"
      )}>
      {Array.isArray(namesSearch) && namesSearch.length > 0 && (
        <div className="flex flex-col">
          <span className="bg-sky-50 dark:bg-[#20232a]  w-full pl-2 text-center ">
            Users found:
          </span>
          <ul
            ref={parent}
            className="flex flex-col divide-y dark:divide-gray-700 divide-gray-100">
            {namesSearch.map((nameResult) => (
              <li key={nameResult.id}>
                <Link
                  className={cn(
                    "flex gap-2 items-center px-3 w-full bg-white hover:bg-slate-100 dark:bg-[#2f333d] dark:hover:bg-slate-700",
                    fullPageMode ? "py-2" : "py-1"
                  )}
                  to={`/profile/${nameResult.id}`}
                  onClick={() => setSearchInput("")}>
                  <img
                    src={nameResult.profilePicture || defaultUserImage}
                    alt="user"
                    className="size-5 object-cover rounded-full"
                  />
                  <span className="text-nowrap overflow-hidden overflow-ellipsis">
                    {highlightMatchingText(nameResult.name, searchInput)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {Array.isArray(postsSearch) && postsSearch.length > 0 && (
        <div className="flex flex-col">
          <span className="bg-sky-50 dark:bg-[#20232a] w-full pl-2 text-center">
            Posts found:
          </span>
          <ul
            ref={parent}
            className="flex flex-col divide-y dark:divide-gray-700">
            {postsSearch.map((postResult) => (
              <li
                key={postResult.id}
                className={cn(
                  "px-3 bg-white hover:bg-slate-100 dark:bg-[#2f333d] dark:hover:bg-slate-700",
                  fullPageMode ? "py-2" : "py-1"
                )}>
                <Link
                  className="flex overflow-hidden overflow-ellipsis"
                  to={`/profile/${postResult.userId}#post-id-${postResult.id}`}>
                  <span className="text-nowrap overflow-hidden overflow-ellipsis">
                    {highlightMatchingText(postResult.textContent, searchInput)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchResults;
