import SuggestedUsers from "../../components/SuggestedUsers";

function SuggestedUsersPage() {
  return (
    <div className="max-w-7xl">
      <SuggestedUsers narrowVersion={false} tallVersion={true} />
    </div>
  );
}

export default SuggestedUsersPage;
