"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const axios_1 = __importDefault(require("axios"));
const electron_store_1 = __importDefault(require("electron-store"));
const store = new electron_store_1.default();
const AuthString = 'Bearer ' + store.get('token');
const axiosInstance = axios_1.default.create({
    baseURL: "https://spaceback.developbase.net",
});
if (store.get('token')) {
    axiosInstance.defaults.headers.common['Authorization'] = AuthString;
}
const getTokenIdByRefreshToken = () => __awaiter(void 0, void 0, void 0, function* () {
    return axios_1.default.post('https://securetoken.googleapis.com/v1/token?key=AIzaSyAneplPWcNnC9JN4HQJ-oWoLG9AOdnXPl0', {
        'grant_type': 'refresh_token',
        'refresh_token': store.get('refreshToken')
    });
});
axiosInstance.interceptors.request.use(function (config) {
    return __awaiter(this, void 0, void 0, function* () {
        if (store.get('refreshToken')) {
            yield getTokenIdByRefreshToken().then(function (res) {
                store.set('uid', res.data.user_id);
                store.set('token', res.data.id_token);
                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access_token;
                config.headers.common['Authorization'] = 'Bearer ' + res.data.access_token;
            });
        }
        return config;
    });
}, function (error) {
    return Promise.reject(error);
});
exports.default = axiosInstance;
//# sourceMappingURL=axiosConfig.js.map