import axiosInstance from "@/commons/js/axiosConfig"
const ROUTE_ARTICULOS = `/arbol/articulos/`;
class AutorizacionAtributoService {


    getDescripcionesPorAprobar = async () => {
        const url = ROUTE_ARTICULOS+ "descripcionesPorAprobar"
        try{
            const {data} = await axiosInstance.get(url);
            return data;
        }catch(err){
            return [err]
        }
    }

    updateDescripciones=async(descripciones)=>{
            const url = ROUTE_ARTICULOS+ "actualizarEstatusDescripcion"
            const date={
                "estatus":"Z",
                "descripciones": descripciones
            }
            // console.log(data)
            try{
                const {data} = await axiosInstance.post(url,date);
                return data;
            }catch(err){
                return [err]
            }

    }
}

export default new AutorizacionAtributoService();