import axiosInstance from "@/commons/js/axiosConfig"

class SinonimosService {

    getSynonyms = async (palabra) => {
        let URI =  `/sinonimos/${palabra}`;

        try{
            const { data } = await axiosInstance.get(URI);
            return {err: '', data}
        }catch(err){
            return { err }
        }

    }

    getKeywords = async () => {
        let URI = '/sinonimos/keywords';
        try {
            const { data } = await axiosInstance.get(URI);
            return {
                err: '',
                data
            }
        } catch (err) {
            return { err }
        }

    };

    saveItems = async (items) => {
        let URI = '/sinonimos/guardaLayout';
        try {
            const { data } = await axiosInstance.post(URI, items);
            return {
                err: '',
                data
            }
        } catch (err) {
            return { err : err.response.data }
        }
    };
    deleteSynonyms = async (sinonimo,keyword) => {
        let URI = `/sinonimos/eliminaSinonimo/${keyword}`;
        const dat =sinonimo
        try{
            const { data } = await axiosInstance.post(URI,sinonimo);
            return {err: '', data}
        }catch(err){
            return { err }
        }
    };
    addSinonimo = async(sinonimo,keyword)=>{

        let URI = `/sinonimos/agregarSinonimo/${keyword}`;
        const dat =sinonimo
        console.log(dat)
        try{
            const { data } = await axiosInstance.post(URI,sinonimo);
            return {err: '', data}
        }catch(err){
            return { err }
        }
    }
   
}
export default new SinonimosService();