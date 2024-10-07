import AddPostForm from "../../components/AddPostForm";
import Posts from "../../components/Posts";
import Stories from "../../components/Stories";

function HomePage() {
  return (
    <div className="bg-inherit dark:text-gray-300 pt-3">
      <Stories />

      <AddPostForm />

      <Posts />
    </div>
  );
}

export default HomePage;
