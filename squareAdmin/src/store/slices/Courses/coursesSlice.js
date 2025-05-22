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

// Create async thunk for creating a new course
export const createCourse = createAsyncThunk(
  'courses/create',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.CREATE_COURSE, courseData);
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to create course');
      }
    }
  }
);

// Create async thunk for deleting a course
export const deleteCourse = createAsyncThunk(
  'courses/delete',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(`${API_ENDPOINTS.GET_ALL_COURSES}/${courseId}`);
      return { courseId, message: response.message };
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to delete course');
      }
    }
  }
);

// Create async thunk for updating a course
export const updateCourse = createAsyncThunk(
  'courses/update',
  async ({ courseId, courseData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(`${API_ENDPOINTS.GET_ALL_COURSES}/${courseId}`, courseData);
      return response;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue('Failed to update course');
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
  createCourseLoading: false,
  createCourseError: null,
  createCourseSuccess: false,
  deleteLoading: false,
  deleteError: null,
  deleteSuccess: false,
  updateCourseLoading: false,
  updateCourseError: null,
  updateCourseSuccess: false,
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
      state.createCourseError = null;
      state.deleteError = null;
      state.updateCourseError = null;
    },
    // Select a course for viewing/editing
    selectCourse: (state, action) => {
      state.selectedCourse = action.payload;
    },
    // Clear selected course
    clearSelectedCourse: (state) => {
      state.selectedCourse = null;
    },
    // Reset create course success flag
    resetCreateCourseSuccess: (state) => {
      state.createCourseSuccess = false;
    },
    // Reset delete course success flag
    resetDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    // Reset update course success flag
    resetUpdateCourseSuccess: (state) => {
      state.updateCourseSuccess = false;
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
      })
      // Create course cases
      .addCase(createCourse.pending, (state) => {
        state.createCourseLoading = true;
        state.createCourseError = null;
        state.createCourseSuccess = false;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.createCourseLoading = false;
        state.courses.push(action.payload);
        state.createCourseError = null;
        state.createCourseSuccess = true;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.createCourseLoading = false;
        state.createCourseError = action.payload;
        state.createCourseSuccess = false;
      })
      // Delete course cases
      .addCase(deleteCourse.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
        state.deleteSuccess = false;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.courses = state.courses.filter(course => course._id !== action.payload.courseId);
        state.deleteError = null;
        state.deleteSuccess = true;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload;
        state.deleteSuccess = false;
      })
      // Update course cases
      .addCase(updateCourse.pending, (state) => {
        state.updateCourseLoading = true;
        state.updateCourseError = null;
        state.updateCourseSuccess = false;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.updateCourseLoading = false;
        state.updateCourseError = null;
        state.updateCourseSuccess = true;
        // Update the course in the courses array
        const index = state.courses.findIndex(course => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        // Update selected course if it's the same one
        if (state.selectedCourse && state.selectedCourse._id === action.payload._id) {
          state.selectedCourse = action.payload;
        }
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.updateCourseLoading = false;
        state.updateCourseError = action.payload;
        state.updateCourseSuccess = false;
      });
  },
});

// Export actions and reducer
export const { 
  clearError, 
  selectCourse, 
  clearSelectedCourse, 
  resetCreateCourseSuccess,
  resetDeleteSuccess,
  resetUpdateCourseSuccess
} = coursesSlice.actions;

export default coursesSlice.reducer;