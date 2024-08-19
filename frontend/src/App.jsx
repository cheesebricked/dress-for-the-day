import Weather from "./Weather"
import SelectorMenu from "./SelectorMenu"
import ShowMore from "./ShowMore"
import MyProfile from "./MyProfile"
import Login from "./Login"
import { Route, Routes } from "react-router-dom"

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={[
        <MyProfile />,
        <Weather />,
        <SelectorMenu />,
        <ShowMore />
      ]} />
      <Route path="/login" element={<Login />} />
    </Routes>
    </>
  )
}

export default App
