import Weather from "./home/Weather"
import SelectorMenu from "./home/SelectorMenu"
import ShowMore from "./home/ShowMore"
import LoginOrUser from "./home/LoginOrUser"
import Login from "./login-register-profile/Login"
import Register from "./login-register-profile/Register"
import Profile from "./login-register-profile/Profile"
import PageNotFound from "./PageNotFound"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={[
        <LoginOrUser />,
        <Weather />,
        <SelectorMenu />,
        <ShowMore />
      ]} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="*" element={<PageNotFound />}/>
    </Routes>
    </>
  )
}

export default App
