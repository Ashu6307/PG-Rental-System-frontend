import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../services/api';

export const fetchContent = createAsyncThunk('content/fetchContent', async (type) => {
  return await apiService.get(`/api/content/${type}`);
});

const contentSlice = createSlice({
  name: 'content',
  initialState: {
    home: {},
    about: {},
    contact: {},
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContent.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state[action.meta.arg] = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default contentSlice.reducer;
