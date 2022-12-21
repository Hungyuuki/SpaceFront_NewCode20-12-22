require('dotenv').config()
import axios from "axios";
import Storage from "electron-store";

const store = new Storage()
const AuthString = 'Bearer ' + store.get('token');

const axiosInstance = axios.create({
  baseURL: "https://spaceback.developbase.net",
})

if (store.get('token')) {  
  axiosInstance.defaults.headers.common['Authorization'] = AuthString;
}

const getTokenIdByRefreshToken = async () => {
  return axios.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyAneplPWcNnC9JN4HQJ-oWoLG9AOdnXPl0', {
    'grant_type': 'refresh_token',
    'refresh_token': store.get('refreshToken') as string
  })
}

axiosInstance.interceptors.request.use(async function (config: any) {
  if (store.get('refreshToken')) {
    await getTokenIdByRefreshToken().then(function (res) {
      store.set('uid', res.data.user_id);
      store.set('token', res.data.id_token);
      axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access_token;
      config.headers.common['Authorization'] = 'Bearer ' + res.data.access_token;
    })
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});

export default axiosInstance