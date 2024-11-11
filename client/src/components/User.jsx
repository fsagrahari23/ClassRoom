import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../features/groupSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

const UserPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { groups } = useSelector((state) => state.groups);
  const [availableTopics, setAvailableTopics] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [takenRollNumbers, setTakenRollNumbers] = useState([]);
  const [rollNumberTaken, setRollNumberTaken] = useState({});

  // Fetch available topics from the backend
  useEffect(() => {
    const fetchAvailableTopics = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/groups/available-topics`
        );
        setAvailableTopics(response.data);
      } catch (error) {
        toast.error("Failed to fetch available topics.");
      }
    };

    fetchAvailableTopics();
  }, [groups]);

  // Use react-hook-form to handle form validation and state
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setFormSubmitted(false);
  }, [groups]);

  // Handle roll number change event and check if it is taken
  const checkRollNumberExistence = async (index, value) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/groups/check-roll-number`,
        { rollNumber: value }
      );
      // If roll number is taken, show warning
      if (response.data.taken) {
        setRollNumberTaken((prevState) => ({
          ...prevState,
          [index]: "This roll number is already taken.",
        }));
      } else {
        setRollNumberTaken((prevState) => ({
          ...prevState,
          [index]: "",
        }));
      }
    } catch (error) {
      setRollNumberTaken((prevState) => ({
        ...prevState,
        [index]: "This Roll number haves already been taken.",
      }));
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    // Check for roll number errors
    if (Object.values(rollNumberTaken).some((msg) => msg)) {
      toast.error("Please resolve all roll number errors before submitting.");
      return;
    }

    // Dispatch createGroup action with members and selected topic
    try {
      await dispatch(
        createGroup({ topic: data.topic, groupMembers: data.groupMembers })
      );
      setFormSubmitted(true);
      navigate("/thank-you");
    } catch (error) {
      toast.error("An error occurred while creating the group.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Create Group</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label htmlFor="topic" className="block text-gray-700 font-bold mb-2">
            Select Topic:
          </label>
          <Controller
            name="topic"
            control={control}
            defaultValue=""
            rules={{ required: "Please select a topic" }}
            render={({ field }) => (
              <select
                id="topic"
                className="w-full p-2 border border-gray-300 rounded"
                {...field}
              >
                <option value="" disabled>
                  -- Select a topic --
                </option>
                {availableTopics.map((t) => (
                  <option
                    key={t.topic}
                    value={t.topic}
                    disabled={t.availableSlots === 0}
                  >
                    {t.topic} (Available slots: {t.availableSlots})
                  </option>
                ))}
              </select>
            )}
          />
          {errors.topic && (
            <span className="text-red-500 text-sm">{errors.topic.message}</span>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="members"
            className="block text-gray-700 font-bold mb-2"
          >
            Group Members:
          </label>

          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="mb-2">
              <Controller
                name={`groupMembers[${index}].name`}
                control={control}
                defaultValue=""
                rules={{ required: `Member ${index + 1} name is required` }}
                render={({ field }) => (
                  <input
                    type="text"
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                    placeholder={`Member ${index + 1} Name`}
                    {...field}
                  />
                )}
              />
              {errors.groupMembers?.[index]?.name && (
                <span className="text-red-500 text-sm">
                  {errors.groupMembers[index].name.message}
                </span>
              )}

              <Controller
                name={`groupMembers[${index}].rollNumber`}
                control={control}
                defaultValue=""
                rules={{
                  required: `Member ${index + 1} roll number is required`,
                  pattern: {
                    value: /^S2023/,
                    message: "Roll number must start with 'S2023'",
                  },
                }}
                render={({ field }) => (
                  <input
                    type="text"
                    className="w-full mb-2 p-2 border border-gray-300 rounded"
                    placeholder={`Member ${index + 1} Roll Number`}
                    {...field}
                    onBlur={(e) =>
                      checkRollNumberExistence(index, e.target.value)
                    } // Check on blur (when the input loses focus)
                  />
                )}
              />
              {errors.groupMembers?.[index]?.rollNumber && (
                <span className="text-red-500 text-sm">
                  {errors.groupMembers[index].rollNumber.message}
                </span>
              )}

              {/* Show warning if roll number is taken */}
              {rollNumberTaken[index] && (
                <span className="text-red-500 text-sm">
                  {rollNumberTaken[index]}
                </span>
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          disabled={formSubmitted}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserPage;
