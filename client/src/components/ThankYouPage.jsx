// frontend/src/components/ThankYouPage.js
import React from "react";
import { Link } from "react-router-dom";

const ThankYouPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
        <p className="text-gray-700 mb-4">
          Your group has been successfully submitted.
        </p>
        <Link to="/" className="text-blue-500 underline">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ThankYouPage;
