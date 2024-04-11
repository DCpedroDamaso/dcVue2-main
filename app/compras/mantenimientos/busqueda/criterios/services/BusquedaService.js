import axiosInstance from "@/commons/js/axiosConfig"

class BusquedaService {

    existeRegla=async(keyword)=>{
        const URL= '/criteriosBusqueda/regla/existe/'+keyword
        try {
            const {data} = await axiosInstance.get(URL)
            return {err: '', data}
        } catch (err) {
            const message =  err.response.data.message;
            return { err : message }
        }
    }
    searchWord = async (palabra,isEdit=false) => {
        let URI =  '/criteriosBusqueda';
        const dat = {
            cadena:palabra,
            isEdit:isEdit
        }
        try{
            const { data } = await axiosInstance.post(URI,dat);
            return {err: '', data}
        }catch(err){
            const message =  err.response.data.message;
            return { err : message }
        }

    }


    saveItems = async (criterios,items=[]) => {
        let URI = '/criteriosBusqueda/reglas/save';
        console.log(items)
        try {
            const { data } = await axiosInstance.post(URI, criterios);
            return {
                err: '',
                data
            }
        } catch (error) {
            //console.log(error);
            const message =  error.response.data.message;
            return { err : message }
        }
    };

    getRegla= async(keyword)=>{
        const URL = '/criteriosBusqueda/regla/'+keyword
        try {
            const {data} = await axiosInstance.get(URL)
            return {err: '', data}
        } catch (err) {
            const message =  err.response.data.message;
            return { err : message }
        }
    }



}
export default new BusquedaService();