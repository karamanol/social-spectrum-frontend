import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import HomePage from "./pages/homepage/HomePage";
import NotFound from "./pages/not-found/NotFound";
import AppLayout from "./components/AppLayout";
import Profile from "./pages/profile/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { useTheme } from "./hooks/useTheme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import UpdateProfile from "./pages/update-profile/UpdateProfile";
import ChangePassword from "./pages/change-password/ChangePassword";
import MyStories from "./pages/my-stories/MyStories";
import MyFriends from "./pages/my-friends/MyFriends";
import SavedPosts from "./pages/saved-posts/SavedPosts";
import SearchPage from "./pages/search/SearchPage";
import SuggestedUsersPage from "./pages/suggested-users/SuggestedUsersPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 60 * 1000 },
  },
});

function App() {
  useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} position="left" />
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
            <Route path="" index element={<HomePage />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="my-stories" element={<MyStories />} />
            <Route path="my-friends" element={<MyFriends />} />
            <Route path="saved-posts" element={<SavedPosts />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="profile/update-profile" element={<UpdateProfile />} />
            <Route path="suggested-users" element={<SuggestedUsersPage />} />
            <Route
              path="profile/change-password"
              element={<ChangePassword />}
            />
          </Route>

          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
