import { SHOW_LOADER, HIDE_LOADER } from "../actionTypes/actionTypes";
const initialState = {
    loading: false,
};
const LoaderReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_LOADER:
            return {
                ...state,
                loading: true,
            };

        case HIDE_LOADER:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
export default LoaderReducer;
