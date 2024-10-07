import Search from "../../components/Search";

function SearchPage() {
  return (
    <div className="mt-4 mb-6 py-10 px-2 md:px-6 lg:px-16 bg-white dark:bg-[#20232a] text-gray-900 dark:text-gray-200 rounded-md overflow-hidden drop-shadow-sm min-h-screen max-w-7xl mx-auto">
      <h1 className="text-2xl text-center mb-7">Search for users or posts</h1>
      <Search fullPageMode={true} />
    </div>
  );
}

export default SearchPage;
