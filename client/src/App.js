import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "../src/pages/Login";
import SigninPage from "./pages/Signin";
import ProfilePage from "./pages/Profile";
import Create_postPage from "./pages/Create_post";
import Create_profilePage from "./pages/Create_profile";
import MessengerPage from "./pages/Messenger";
import { ProfileContextProvider } from "./contex/profileContex";
import SearchBox_Page from "./pages/searchBox_Page";

function App() {
  return (
    <div className="App">
      <ProfileContextProvider>
        <Router>
          <Routes>
            <Route path="/home" element={<Home />} />
          </Routes>
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
          <Routes>
            <Route path="/signin" element={<SigninPage />} />
          </Routes>
          <Routes>
            <Route path="/profile/:userId" element={<ProfilePage />} />
          </Routes>
          <Routes>
            <Route path="/createPost" element={<Create_postPage />} />
          </Routes>
          <Routes>
            <Route path="/createProfile" element={<Create_profilePage />} />
          </Routes>
          <Routes>
            <Route path="/messenger" element={<MessengerPage />} />
          </Routes>
          <Routes>
            <Route path="/search" element={<SearchBox_Page />} />
          </Routes>
        </Router>
      </ProfileContextProvider>
    </div>
  );
}

export default App;
