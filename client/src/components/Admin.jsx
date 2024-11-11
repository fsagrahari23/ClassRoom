import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGroups, deleteGroup } from "../features/groupSlice";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import toast components
import "react-toastify/dist/ReactToastify.css"; // Import styles for toast notifications

const AdminPage = () => {
  const dispatch = useDispatch();
  const { groups, loading, error } = useSelector((state) => state.groups);

  const [selectedTopic, setSelectedTopic] = useState(null); // Track selected topic

  useEffect(() => {
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleDelete = (groupId) => {
    dispatch(deleteGroup(groupId))
      .then(() => {
        toast.success("Group deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
        });
      })
      .catch(() => {
        toast.error("Failed to delete the group. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
      });
  };

  const availableTopics = [
    "Topic 1",
    "Topic 2",
    "Topic 3",
    "Topic 4",
    "Topic 5",
    "Topic 6",
    "Topic 7",
    "Topic 8",
    "Topic 9",
    "Topic 10",
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Filter groups based on the selected topic
  const filteredGroups = groups.filter(
    (group) => group.topic === selectedTopic
  );
  console.log(filteredGroups);

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">
        Admin Panel - Topic Management
      </h1>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Sidebar - Topic List */}
        <div className="col-span-4">
          <h2 className="text-xl font-semibold mb-4">Available Topics</h2>
          <ul className="space-y-3">
            {availableTopics.map((topic, index) => (
              <motion.li
                key={index}
                className={`p-3 cursor-pointer border border-gray-300 rounded ${
                  selectedTopic === topic ? "bg-blue-100" : "bg-white"
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setSelectedTopic(topic)} // Set selected topic
              >
                {topic}
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right Panel - Groups under the selected topic */}
        <div className="col-span-8">
          {selectedTopic ? (
            <>
              <h2 className="text-xl font-semibold mb-4">
                Groups for {selectedTopic}
              </h2>
              {filteredGroups.length > 0 ? (
                <ul className="space-y-4">
                  {filteredGroups.map((group) => (
                    <motion.li
                      key={group._id}
                      className="bg-white shadow p-4 rounded flex justify-between items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="p-6 bg-white rounded-lg shadow-md">
                        <h3 className="font-bold text-xl text-gray-800 mb-4">
                          Group Members
                        </h3>
                        <table className="min-w-full table-auto border-collapse">
                          <thead>
                            <tr className="bg-gray-100 text-left text-sm text-gray-600">
                              <th className="py-2 px-4 border-b">Name</th>
                              <th className="py-2 px-4 border-b">
                                Roll Number
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {group.groupMembers.map((member, index) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition duration-200"
                              >
                                <td className="py-2 px-4 border-b text-sm font-medium text-gray-800">
                                  {member.name}
                                </td>
                                <td className="py-2 px-4 border-b text-sm text-gray-600">
                                  {member.rollNumber}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <button
                        onClick={() => handleDelete(group._id)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded"
                      >
                        <FaTrash />
                      </button>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p>No groups available for this topic.</p>
              )}
            </>
          ) : (
            <p>Please select a topic to view the groups.</p>
          )}
        </div>
      </div>

      {/* ToastContainer for notifications */}
      <ToastContainer />
    </div>
  );
};

export default AdminPage;
