import Weather from "./Weather"
import SelectorMenu from "./SelectorMenu"
import ShowMore from "./ShowMore"
import LoginOrUser from "./LoginOrUser"
import Login from "./Login"
import Register from "./Register"
import Profile from "./Profile"
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
