// frontend/src/features/groupSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/groups/all`);
  return response.data;
});

export const createGroup = createAsyncThunk('groups/createGroup', async (groupData) => {
  const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/groups/create`, groupData);
  return response.data;
});

export const deleteGroup = createAsyncThunk('groups/deleteGroup', async (groupId) => {
  await axios.delete(`${import.meta.env.VITE_API_URL}/api/groups/${groupId}`);
  return groupId;
});

const groupSlice = createSlice({
  name: 'groups',
  initialState: {
    groups: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter((group) => group._id !== action.payload);
      });
  },
});

export default groupSlice.reducer;
