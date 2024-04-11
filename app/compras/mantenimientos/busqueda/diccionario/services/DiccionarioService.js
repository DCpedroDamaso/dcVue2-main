import axiosInstance from "@/commons/js/axiosConfig"

class DiccionarioService {

    getReglas = async () => {
        let URI =  '/criteriosBusqueda/reglas';

        try{
            const { data } = await axiosInstance.get(URI);
            return {err: '', data}
        }catch(err){
            return { err }
        }

    }
    getItems = async (keyword)=>{
        const URL ='/criteriosBusqueda/items/'+keyword;
        try{
            const {data} = await axiosInstance.get(URL)
            return {err:'',data}
        }catch(err){
            return {err}
        }
    }

    getItemsConDescripcion=async(items)=>{
        const URL = '/criteriosBusqueda/descripcion/items'
        const datos={
            items
        }
        try{
            const {data} = await axiosInstance.post(URL,items)
            return {err:'',data}
        }catch(err){
            return {err}
        }
    }
    deleteRegla = async(keyword)=>{
        const URL = '/criteriosBusqueda/regla/'+keyword
        try {
            const {data} = await axiosInstance.delete(URL)
            return {err: '', data}
        } catch (err) {
            const message =  err.response.data.message;
            return { err : message }
        }
    }

}
export default new DiccionarioService();