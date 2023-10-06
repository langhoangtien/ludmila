import { ICategory, ICategoryState } from '@/@types/category';
import axios from '@/utils/axios';
import { Dispatch, createSlice } from '@reduxjs/toolkit';

const initialState: ICategoryState = {
  isLoading: false,
  error: null,
  categories: [],
  category: null,
};

const slice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET CATEGORIES
    getCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.categories = action.payload;
    },

    // GET CATEGORY
    getCategorySuccess(state, action) {
      state.isLoading = false;
      state.category = action.payload;
    },

    // GET CATEGORY
    postCategorySuccess(state) {
      state.isLoading = false;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getCategories() {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response1 = await fetch('http://localhost:3000/api/v1/categories?limit=20');
      const response = await response1.json();
      dispatch(slice.actions.getCategoriesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addCategory(data: Omit<ICategory, 'id'>) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/v1/categories', {
        data,
      });
      dispatch(slice.actions.postCategorySuccess());
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function getCategory(id: string) {
  return async (dispatch: Dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/categories/${id}`);
      dispatch(slice.actions.getCategorySuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.hasError(error));
      
    }
  };
}
