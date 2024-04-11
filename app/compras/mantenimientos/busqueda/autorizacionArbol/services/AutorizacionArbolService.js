import axiosInstance from "@/commons/js/axiosConfig"
const ROUTE_ARTICULOS = `/arbol/articulos/`;

class AutorizacionArbolAtributoService {


    getAbolAtributosPorAprobar = async () => {
        const url = ROUTE_ARTICULOS+ "descripcionesPorAprobarParaArbol"
        try{
            const {data} = await axiosInstance.get(url);
            return data;
        }catch(err){
            return [err]
        }
    }

    updateArbolDescripciones=async(descripciones)=>{
            const url = ROUTE_ARTICULOS+ "actualizarEstatusDescripcion"
            const date={
                "estatus":"A",
                "descripciones": descripciones
            }
            console.log(date)
            try{
                const {data} = await axiosInstance.post(url,date);
                return data;
            }catch(err){
                return [err]
            }

    }
}

export default new AutorizacionArbolAtributoService();