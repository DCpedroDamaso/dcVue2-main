import axiosInstance from "@/commons/js/axiosConfig";
import axiosInstanceIndicador from "@/commons/js/axiosConfigIndicador";

class reporterequerimientov3service {
  getItemsAll = async (info) => {
    try {
      const { data } = await axiosInstanceIndicador.post("/RequerimientosV3/", info);
      return {
        err: "",
        data,
      };
    } catch (err) {
      return { err };
    }
  };

  busquedaItems = async (info) => {
    try {
      const { data } = await axiosInstance.post("/busquedaItems", info);
      return {
        err: "",
        data,
      };
    } catch (err) {
      return { err };
    }
  };

  getLineaNegocio = async () => {
    try {
      const { data } = await axiosInstance.get("/lineadeNegocio");
      return {
        err: "",
        data,
      };
    } catch (err) {
      return { err };
    }
  };

  getComprador = async () => {
    try {
      const { data } = await axiosInstance.get("/comprador");
      return {
        err: "",
        data,
      };
    } catch (err) {
      return { err };
    }
  };

  getEmpleadoColocacion = async () => {
    try {
      const data = await axiosInstance.get("/empleadoColocacion");
      return {
        err: "",
        data,
      };
    } catch (err) {
      return { err };
    }
  };

  getItemColocacion = async (datos = []) => {
    try {
      const data = await axiosInstance.post("/empleadoColocacion/items", datos);
      return {
        err: "",
        data,
      };
    } catch (err) {
      return { err };
    }
  };
  
  getDatosProveedor =async (datos ={})=>{
      try{
          const data= await axiosInstance.post("/proveedor",datos);
          return{
            err:"",
            data
          }
      } catch(err){
        return {err};
      }
  }
  

  getColocarItems =async (datos ={})=>{
    try{
        const data= await axiosInstance.post("/colocar/items",datos);
        return{
          err:"",
          data
        }
    } catch(err){
      return {err};
    }
}

getDatosMailOc =async (datos ={})=>{
  try{
      const data= await axiosInstance.post("/datosMailOc",datos);
      return{
        err:"",
        data
      }
  } catch(err){
    return {err};
  }
}


getEnviarCorreo = async (datos = {}) => {
  try {
    const data = await axiosInstanceIndicador.post("/colocacion/enviarCorreo", datos);
    return {
      err: "",
      data,
    };
  } catch (err) {
    return { err };
  }
};



}
export default new reporterequerimientov3service();
