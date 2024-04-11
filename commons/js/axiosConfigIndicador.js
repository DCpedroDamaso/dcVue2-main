import axios from "axios";
// import { MANTENIMIENTOS_ROUTE } from './constants';
import Swal from "sweetalert2";
// import router from "../../router/router";
const axiosInstance = axios.create({
    // baseURL: MANTENIMIENTOS_ROUTE,
    baseURL:"http://192.10.1.201:8088/dcWS2/compras/indicadores/itemInforme",

});

axiosInstance.interceptors.request.use(config => {
    let token = localStorage.getItem("jwtToken");

    if (!token) {
        return config;
    }

    const tokenParsed = JSON.parse(atob(token.split('.')[1]));

    if (tokenParsed.exp * 1000 < Date.now()) {
        Swal.fire({
            icon: 'error',
            title: 'Ha ocurrido un error',
            text: "Ha caducado su sesion",
        });
        window.localStorage.removeItem("jwtToken");
        Promise.reject("Ya caduco su sesion");
        return navigateTo('/compras/mantenimientos/reporteRequerimientoV3/login');
    }

    config.headers['Authorization'] = 'Bearer ' + token;
    //config.headers['Content-Type'] = 'application/json';
    return config;

},
    error => {
        Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use(
    res => res,
    err => {
        //console.log(err);
        if (err.response) {
            if (err.response.status === 401 && err.response.data?.message?.includes("expired")) {
                throw new Error("Ha caducado su sesion");
            }
        } else if (err.request) {
            //console.log(err.request);
        } else {
            //return err;
        }

        return Promise.reject(err);

    }
);

export default axiosInstance;