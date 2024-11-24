export const HOST = "http://localhost/roomnestserver/index.php";
// export const HOST = "https://api.tradenest.tech";
export const AUTH_ROUTES = "api/v1/user";
export const SIGNUP_ROUTE = `${AUTH_ROUTES}/register`;
export const LOGIN_ROUTE = `${AUTH_ROUTES}/login`;
export const GET_USER_INFO = `${AUTH_ROUTES}/getprofile`;
export const LOGOUT_ROUTE = `${AUTH_ROUTES}/logout`;
export const UPDATE_PROFILE_ROUTE = `${AUTH_ROUTES}/newupdateuser`;
export const UPDATE_PASSWORD_ROUTE = `${AUTH_ROUTES}/updatepassword`;

export const PRODUCT_ROUTES = "api/v1/listing";
export const CREATE_PROPERTY = `${PRODUCT_ROUTES}/local`;
export const GET_ALL_PROPERTIES_ROUTE = `${PRODUCT_ROUTES}/getlistings`;
export const GET_USER_PROPERTIES = `${PRODUCT_ROUTES}/getuserlistings`;
export const GET_FILTERED_LISTINGS = `${PRODUCT_ROUTES}/filterlisting`;
export const GET_SAVED_PROP_ID = `${PRODUCT_ROUTES}/getsavedproperties`;
export const GET_ALL_SAVED_PROP = `${PRODUCT_ROUTES}/getallsavedproperties`;
export const DELETE_PROPERTY = `${PRODUCT_ROUTES}/deletelisting`;
export const CHANGE_STATUS = `${PRODUCT_ROUTES}/changestatus`;
export const TOGGLE_STATUS = `${PRODUCT_ROUTES}/togglesaveproperty`;
export const CREATE_PRODUCT_ROUTE = `${PRODUCT_ROUTES}/createproduct`;
export const SEARCH_PRODUCT_ROUTE = `${PRODUCT_ROUTES}/searchproduct`;

export const CLODUINARY_LINK = `https://res.cloudinary.com/dxnb4inln/image/upload/v1731164423/`;
