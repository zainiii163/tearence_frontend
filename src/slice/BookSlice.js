import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import BookServices from "../services/BookServices";

const initialState = {
  loading: false,
  bookList: [],
  message: null,
  error: null,
};
export const getBooks = createAsyncThunk(
  "book/getBooks",
  async ({ skip, limit }) => {
    const res = await BookServices.getBooks(skip, limit);
    return res.data;
  }
);
const handleError = (state, action) => {
  state.error = action.error.message;
};
const BookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    redirectFalse: (state) => {
      state.redirect = false;
    },
    clearBookErrorAndMessage: (state) => {
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBooks.fulfilled, (state, action) => {
        state.bookList = action.payload;
        state.loading = false;
      })
      .addCase(getBooks.rejected, handleError);
  }
})
export const { clearBookErrorAndMessage, redirectFalse } = BookSlice.actions;
const { reducer } = BookSlice;
export default reducer;