import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '../../services/apiService';
import API_ENDPOINTS from '../../services/apiEndpoints';

// Create async thunk for fetching all courses
export const fetchAllCourses = createAsyncThunk(
  'courses/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.GET_ALL_COURSES);
      return response;
    } catch (error) {
      // Return custom error message from backend if present
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to fetch courses');
      }
    }
  }
);

// Create async thunk for fetching a single course
export const fetchCourseById = createAsyncThunk(
  'courses/fetchById',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiService.get(`${API_ENDPOINTS.GET_ALL_COURSES}/${courseId}`);
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to fetch course details');
      }
    }
  }
);

// Initial state
const initialState = {
  courses: [],
  loading: false,
  error: null,
  selectedCourse: null,
  singleCourseLoading: false,
  singleCourseError: null,
};

// Create slice
const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.singleCourseError = null;
    },
    // Select a course for viewing/editing
    selectCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    // Clear selected course
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses cases
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single course cases
      .addCase(fetchCourseById.pending, (state) => {
        state.singleCourseLoading = true;
        state.singleCourseError = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.singleCourseLoading = false;
        state.selectedCourse = action.payload;
        state.singleCourseError = null;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.singleCourseLoading = false;
        state.singleCourseError = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError, selectCourse, clearSelectedCourse } = coursesSlice.actions;
export default coursesSlice.reducer;