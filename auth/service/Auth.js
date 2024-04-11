import axios from "axios";
// import { SERVER_ROUTE } from "../common/constants";
//const SERVER_ROUTE = "http://192.10.16.17:8079/dcWS2";
 const SERVER_ROUTE = "http://192.10.1.201:8088/dcWS2";
import Swal from "sweetalert2";

class AuthService {
  login = async (username, password) => {
    return await axios.post(SERVER_ROUTE + "/login", {
      username,
      password,
    });
  };

  logout() {
    window.localStorage.removeItem("jwtToken");
  }

  getUserLoggedIn() {
    const tokenString = window.localStorage.getItem("jwtToken");
    if (tokenString === null) {
      return;
    }
    const payload = JSON.parse(atob(tokenString.split(".")[1]))
    const user = {
      numEmpleado: payload.numEmpleado,
      puesto: payload.puesto,
      nombre: payload.nombre,
    }
    return user;
  }

  isTokenValid() {
    const tokenString = localStorage.getItem("jwtToken");
    if (tokenString === null) {
      return false;
    }
    const payload = JSON.parse(atob(tokenString.split(".")[1]));
    if (payload.exp * 1000 < Date.now()) {
      return false;
    }

    return true;
  }

  isAdmin(){
    if(!this.isTokenValid) return false;
    const user = this.getUserLoggedIn();

    if(user.puesto.includes("PROCUREMENT MANAGER") ||  user.puesto.includes("GERENTE") 
      || user.puesto.includes("GROUP PRODUCT MANAGER") 
    || user.numEmpleado === '2220' 
    || numEmpleado == "6879"
    || numEmpleado == "3647"
    ||numEmpleado=="2071"
    ||numEmpleado=="1651")
    {
      return true;
    }else{
      Swal.fire({
        title: 'Ooops',
        icon: 'error',
        text: 'No tienes permiso para acceder a esta opcion',
    })
      return false;
    }
  }

  isSistemas(){
    if(!this.isTokenValid) return false;
    const user = this.getUserLoggedIn();

    if(user.numEmpleado === '2220')
    {
      return true;
    }else{
      Swal.fire({
        title: 'Ooops',
        icon: 'error',
        text: 'No tienes permiso para acceder a esta opcion',
    })
      return false;
    }
  }
}
export default new AuthService();