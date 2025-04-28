import AddEmployee from "./components/add-employee";
import HomeClient from "./components/home-client";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeClient />} />
        <Route path="/add-employee" element={<AddEmployee />} />
        <Route path="/update-employee/:id" element={<AddEmployee />} />
      </Routes>
    </>
  );
}

export default App;
