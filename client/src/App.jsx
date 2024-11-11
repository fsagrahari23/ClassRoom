// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ThankYouPage from "./components/ThankYouPage";
import AdminLayout from "./Pages/AdminLayout";
import UserLayout from "./Pages/UserLayout";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<UserLayout />} />
          <Route path="/adminOSystem" element={<AdminLayout />} />
          <Route path="/thank-you" element={<ThankYouPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
