import CONFIG from "./config";

const API_ENDPOINT = {
  // akun admin api
  ADMIN_LOGIN: `${CONFIG.BASE_URL}/login`,
  ADMIN_LOGOUT: (token) => `${CONFIG.BASE_URL}/logout/${token}`,
  ADMIN_REGIS: `${CONFIG.BASE_URL}/registrasi`,
  ADMIN_GETDATA: (token) => `${CONFIG.BASE_URL}/getadmin/${token}`,
  ADMIN_EDITDATA: (token) => `${CONFIG.BASE_URL}/editadmin/${token}`,
  ADMIN_DELETEDATA: (token) => `${CONFIG.BASE_URL}/deleteadmin/${token}`,
  // wisata api
  GETWISATA: `${CONFIG.BASE_URL}/getwisata`,
  GETWISATABYID: (id) => `${CONFIG.BASE_URL}/getwisatabyid/${id}`,
  ADDWISATA: `${CONFIG.BASE_URL}/createwisata`,
  EDITWISATA: (id) => `${CONFIG.BASE_URL}/updatewisata/${id}`,
  DELETEWISATA: (id) => `${CONFIG.BASE_URL}/deletewisata/${id}`,

  // review wisata api
  GET_REVIEW_ALL_WISATA: `${CONFIG.BASE_URL}/getallreview`,
  GET_REVIEW_BY_WISATA_ID: (id) =>
    `${CONFIG.BASE_URL}/getreviewbywisataid/${id}`,
  ADD_REVIEW: (id) => `${CONFIG.BASE_URL}/createreview/${id}`,

  // hotel api
  GET_ALL_HOTEL: `${CONFIG.BASE_URL}/hotel`,
  GET_HOTEL_BY_WISATA_ID: (id) => `${CONFIG.BASE_URL}/gethotelbywisataid/${id}`,
  GET_HOTEL_BY_ID: (id) => `${CONFIG.BASE_URL}/hotel/${id}`,
  ADD_HOTEL: `${CONFIG.BASE_URL}/hotel`,
  EDIT_HOTEL: (id) => `${CONFIG.BASE_URL}/hotel/${id}`,
  DELETE_HOTEL: (id) => `${CONFIG.BASE_URL}/hotel/${id}`,

  // review hotel api
  GET_REVIEW_ALL_HOTEL: `${CONFIG.BASE_URL}/getallreviewhotel`,
  GET_REVIEW_HOTEL_BY_WISATA_ID: (id) =>
    `${CONFIG.BASE_URL}/getreviewhotelbywisataid/${id}`,
  ADD_REVIEW_HOTEL: (id) => `${CONFIG.BASE_URL}/createreviewhotel/${id}`,

  // gallery wisata api
  GET_GALLERY_BY_ID: (id) => `${CONFIG.BASE_URL}/getgallerybyid/${id}`,
  GET_GALLERY_BY_WISATA_ID: (id) =>
    `${CONFIG.BASE_URL}/getgallerybywisataid/${id}`,
  ADD_GALLERY: (id) => `${CONFIG.BASE_URL}/creategallery/${id}`,
  DELETE_GALLERY: (id) => `${CONFIG.BASE_URL}/deletegallery/${id}`,

   // node api
   GETNODES: `${CONFIG.BASE_URL}/getnodes`,
   GETNODEBYID: (id) => `${CONFIG.BASE_URL}/getnodebyid/${id}`,
   ADDNODE: `${CONFIG.BASE_URL}/createnode`,
   EDITNODE: (id) => `${CONFIG.BASE_URL}/updatenode/${id}`,
   DELETENODE: (id) => `${CONFIG.BASE_URL}/deletenode/${id}`,

   HOTEL: `${CONFIG.BASE_URL}/hotel`,
   DETAIL_HOTEL: (id) => `${CONFIG.BASE_URL}/hotel/${id}`,
   HOTEL_RECOMMENDATIONS: `${CONFIG.BASE_URL}/hotel-recommendations`,
};

export default API_ENDPOINT;
