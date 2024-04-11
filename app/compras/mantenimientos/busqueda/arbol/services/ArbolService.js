import axiosInstance from "@/commons/js/axiosConfig"

const ROUTE_ARBOL = '/arbol';

class ArbolService {
    getAllArbol = async () => {
        let URI = ROUTE_ARBOL + `?articulos=true`;

        try {
            const { data } = await axiosInstance.get(URI);
            return { err: '', data }
        } catch (err) {
            return { err }
        }

    }

    crearNuevoNodo = async (nodo,atributos=[]) => {
        const tipo = (nodo.nivel !== 0) ? (nodo.nivel!==1) ? 'subfamilias' : "familias" : "lineas";
        let URI = ROUTE_ARBOL + `/${tipo}/save`;

        if(atributos.length==0){

            try {
                const { data } = await axiosInstance.post(URI, nodo);
                return { err: '', data }
            } catch (err) {
                return { err }
            }
        }else{
            const datos = {
                "nodo":nodo,
               "atributos": atributos
            }
            console.log(datos)
            try {
                const { data } = await axiosInstance.post(URI, datos);
                return { err: '', data }
            } catch (err) {
                return { err }
            }
        }


    }

    deleteNodo = async (nodo) => {
        const tipo = (nodo.nivel !== 0) ? (nodo.nivel!==1) ? 'subfamilias' : "familias" : "lineas";
        let URI = ROUTE_ARBOL + `/${tipo}/${nodo.id}`;
        
        try {
            const { data } = await axiosInstance.delete(URI);
            return { err: '', data }
        } catch (err) {
            return { err }
        }
    }

}
export default new ArbolService();