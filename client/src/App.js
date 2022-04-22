import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import UpdateTitle from "./components/UpdateTitle";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/update/:id" element={<UpdateTitle />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
export default App;
