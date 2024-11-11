import React from "react";
import UserPage from "../components/User";

const UserLayout = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-center text-4xl my-8">Group Management App</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserPage />
      </div>
    </div>
  );
};

export default UserLayout;
