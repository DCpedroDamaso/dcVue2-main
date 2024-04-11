import axiosInstance from "@/commons/js/axiosConfig"


const ROUTE_ARTICULOSP = `/arbol/articulosP/`;
const ROUTE_ARTICULOS = `/arbol/articulos/`;


class ArticulosService {

    getItems = async (elemento) => {
        let liga = elemento.nivel == 0 ? 'linea/' : elemento.nivel == 1 ? 'familia/' : 'subfamilia/';
        liga += elemento.id;
        try{
            const {data} = await axiosInstance.get(ROUTE_ARTICULOSP + liga);
            return [null, data];
        }catch(err){
            return [err]
        }

    };

    saveItems = async (articulo, noSubfamilia,descripciones) => {
        let liga = ROUTE_ARTICULOS + 'subfamilia/' + noSubfamilia
        const datos = {
            articulo,
            descripciones
        }
        try {
            const {data} = await axiosInstance.post(liga, datos);
            return [null, data];
        } catch (err) {
            return [err]
        }

    };

    getArticulosNot =   async (elemento) => {
        let URI = `${ROUTE_ARTICULOS}missing`

        try{
            const {data} = await axiosInstance.get(URI);
            return {err:'', data};
        }catch(err){
            return {err}
        }

    };

    getAtributos = async()=>{
        const URL = ROUTE_ARTICULOS+"atributos";
        try{
            const {data} = await axiosInstance.get(URL);
            return [null, data];
        }catch(err){
            return [err]
        }
    }

    getAtributosBySubfamilia = async(noSubFamilia)=>{   
        const URL = ROUTE_ARTICULOS+'atributos/'+noSubFamilia
        try{
            const {data} = await axiosInstance.get(URL);
            return [null, data];
        }catch(err){
            return [err]
        }
    }

    updateAtributosBySubfamilia = async(noSubFamilia,atributos)=>{
        const URL = ROUTE_ARTICULOS+'atributos'
        const datos = {
            "noSubFamilia":noSubFamilia,
           "atributos": atributos
        }
        try{
            const {data} = await axiosInstance.put(URL,datos)
            return [null,data];
        }catch(err){
            return [err]
        }
    }

    getDescripciones = async(noSubFamilia)=>{   
        const URL = ROUTE_ARTICULOS+'descripciones/'+noSubFamilia
        try{
            const {data} = await axiosInstance.get(URL);
            return [null, data];
        }catch(err){
            return [err]
        }
    }
    existeArticulo = async(articulo)=>{
        const URL = ROUTE_ARTICULOS+'articulo/existe/'+articulo
        try{
            const {data} = await axiosInstance.get(URL);
            return [null, data];
        }catch(err){
            return [err]
        }
    }
    getEspecificaciones = async(articulo)=>{
        const URL = ROUTE_ARTICULOS+'articulo/'+articulo
        try{
            const {data} = await axiosInstance.get(URL);
            return [null, data];
        }catch(err){
            return [err]
        }
    }
}

export default new ArticulosService();

