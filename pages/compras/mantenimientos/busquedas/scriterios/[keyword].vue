<!-- <style>
    [type="radio"]:not(:checked), [type="radio"]:checked {
        opacity: 1;
        pointer-events: auto;
        position: relative;
    }
</style> -->
<script>
import Swal from 'sweetalert2'; //listo
import {groupBy, partition, map, countBy} from 'lodash';
import draggable from 'vuedraggable';


import AuthService from '@/auth/service/Auth.js';
import busquedaService from '@/app/compras/mantenimientos/busqueda/criterios/services/BusquedaService'
import carta from '@/app/compras/mantenimientos/busqueda/common/cartaArticulo.vue'
import loader from '@/commons/vue/loader.vue';
import accordionTab from '@/app/compras/mantenimientos/busqueda/criterios/common/accordionTab.vue';
import cardItem from '@/app/compras/mantenimientos/busqueda/criterios/common/cardItem.vue';

import { useTheme } from "vuetify";
import { ref, onMounted } from 'vue';
import sinonimosService from '@/app/compras/mantenimientos/busqueda/sinonimos/services/SinonimosService.js';
import { useCoincidenciasData } from '@/store/coincidenciasData'
import {deburr} from 'lodash';
function showErrorModal(mensaje, theme) {
    Swal.fire({
        color: theme == "dark" ? '#F5F5F5' : '#212121',
        background: theme != "dark" ? "#F5F5F5" : "#212121",
        icon: 'error',
        title: 'Oops...',
        text: mensaje,
    });
}
function showSuccessModal(mensaje, theme) {
    Swal.fire({
        color: theme == "dark" ? '#F5F5F5' : '#212121',
        background: theme != "dark" ? "#F5F5F5" : "#212121",
        icon: 'success',
        title: 'Exito',
        text: mensaje,
    });
}
export default {
    setup(){
        //setup se ejecuta antes del mounted
        //se ocupa para obtener la ruta y saber que regla se va a editar
        const coincidenciasData = useCoincidenciasData()
        const {resetCounts} = coincidenciasData
        const route = useRoute()
        const routeParam=route.params.keyword
        const theme = useTheme();
        const result = ref(null)
        definePageMeta({
            layout: false,
            middleware: [
            function(to, from) {
                const isAuth = AuthService.isTokenValid();
                if (!isAuth) {
                    return navigateTo('/compras/mantenimientos/busquedas/login');
                }
                },
            ]
        });
        async function req(){
            if(routeParam == 'new'){
                result.value=true;
            }else{
                const res=await busquedaService.existeRegla(routeParam)
                if(!res.data){
                    return navigateTo('/compras/mantenimientos/busquedas/scriterios/new');
                }
            }
        }
        const container =ref(null)
        onMounted(() => {
            req();
        });
        return {routeParam,theme,resetCounts,container};
    },
    beforeRouteEnter(to, from) {
        // if(AuthService.isSistemas())
        if(true)
            return true;
        else
            return false;
    },
    data() {
        return {
            articulos: [],
            marcas: [],
            familias: [],
            subfamilias: [],
            isLoading: false,
            filters: [
                {filter:'familias', isActive: false},
                {filter:'subfamilias', isActive: false},
                {filter:'marcas', isActive: false},
                {filter:'protecciones', isActive: false},
                {filter:'nuevos', isActive: false},
                {filter:'bundles', isActive: false},
                {filter:'estatus', isActive: false}
            ],
            estatus: '1',
            palabraBuscada: '',
            articulosActivos: 0,
            sinonimos:[],
            criterios:[],
            pins:[],
            itemsLenght:0,
            totalSinonimos:[],
            scrollInterval: null,
            countKeywords:0,
            countSinonimos:0,
            countMatchmultiple:0,
            countMatches:{},
            autoScrollInterval: null,
            dragging:0
        }
    },
    components: {
        carta,
        loader,
        accordionTab,
        cardItem,
        draggable
    },
    computed: {
    dragOptions() {
      return {
        group: {
          name: 'g1'
        },
        scrollSensitivity: 200,
        forceFallback: true,
        scrollSpeed: 25
      };
    }
  },
    methods: {
        //metodo que controla el scroll al arrastrar elemento
        startScroll(event) {
        if(this.dragging){
            const container = this.$refs.container;
            const scrollSpeed = 30; 
            if (event.clientY < container.getBoundingClientRect().top + 50) {
                this.autoScrollInterval = setInterval(() => {
                container.scrollTop -= scrollSpeed;
                }, 10);
            } else if (event.clientY > container.getBoundingClientRect().bottom - 50) {

                this.autoScrollInterval = setInterval(() => {
                container.scrollTop += scrollSpeed;
                }, 10);
            }
        }

    },
        // contador para mostrar los match con palabra
        tieneCoincidenciaConPalabra(descripcion ){
            let existeCoincidencia =false;
            const palabras = this.palabraBuscada.toUpperCase().split(" ");

            let i = 0
            palabras.forEach((palabra)=>{
                
            });
            console.log(this.palabraBuscada)
            
            if(deburr(descripcion.toUpperCase()).includes(this.palabraBuscada.toUpperCase().trim()) ){
                existeCoincidencia = true
                    i++;
                }
            const sinonimos=this.sinonimos
            let a = 0
            sinonimos.forEach((sinonimo)=>{
                if(deburr(descripcion.toUpperCase()).includes(sinonimo) && !deburr(descripcion.toUpperCase()).includes(this.palabraBuscada.toUpperCase().trim())){
                    a++;
                    this.totalSinonimos[sinonimo] = this.totalSinonimos[sinonimo] +1
                }
                if(deburr(descripcion.toUpperCase()).includes(sinonimo) && deburr(descripcion.toUpperCase()).includes(this.palabraBuscada.toUpperCase().trim())){
                    this.countMatchmultiple++
                }
                
            });
            if(existeCoincidencia  && a ==0){
                this.countKeywords++
                
            }else if(existeCoincidencia && a >0){

            }else{
                this.countSinonimos++
                
            }
            return ""
        },
        handleToggle(data){
            this.filters.forEach((el)=>{if(el.filter===data.id) el.isActive = !el.isActive});
            this.sort();      
        },
        
        startFilters(articulos){
            //Se inicializan los filtros 
        
            // Se crean los mapas
            const familias = {};
            const subfamilias = {};
            const marcas = {};

            // Se recorre todos losarticulos
            for(let articulo of articulos){
                // Si la marca no existe en el mapa se agrega
                if(!marcas[articulo.marca])
                    marcas[articulo.marca] = {count:0,isActive: true};
                // Si la familia no existe en el mapa se agrega
                if(!familias[articulo.noFamilia])
                    familias[articulo.noFamilia] = {count:0, familia: articulo.familia,isActive: true};
                // Si la subfamilia no existe en el mapa se agrega
                if(!subfamilias[articulo.noSubfamilia])
                    subfamilias[articulo.noSubfamilia] = {
                        count: 0, 
                        noFamilia: articulo.noFamilia,
                        subfamilia: articulo.subfamilia,
                        isActive: true
                    };

                // Se incrementa el conteo
                familias[articulo.noFamilia].count++;
                subfamilias[articulo.noSubfamilia].count++;
                marcas[articulo.marca].count++;
            }

            // Se transforman los mapas a arreglos y se inicializan los filtros
            this.familias = map(familias, (val, key) => ({ noFamilia:key , ...val }));
            this.subfamilias = map(subfamilias, (val, key) => ({ noSubfamilia:key , ...val }));
            this.marcas = map(marcas, (val, key) => ({ marca:key , ...val }));
        },
        async buscarWord(event,isEdit,theme,resetCounts) {
            //busca las palabras que puedan coincidir 
            this.itemsLenght=0
            this.countKeywords =0;
            this.countSinonimos = 0;
            this.countMatchmultiple = 0
            this.articulos=[]
            const word = event.target.value;

            // Se reinician campos  
            this.palabraBuscada = word;
            
            const res = await sinonimosService.getSynonyms(this.palabraBuscada);
            if (res.err !== '') {
                showErrorModal(res.err,"dark")
                return
            }
            this.sinonimos = res.data;

            //inicializamos contador de coincidencias
            this.totalSinonimos={}
            this.sinonimos.forEach((sinonimo)=>{
                this.totalSinonimos={
                    ...this.totalSinonimos,
                    [sinonimo]:0
                }
            })


            this.filters.forEach((el)=>el.isActive=false);
            this.articulosActivos= 0;
            this.isLoading = true;
            // Se manda la peticion para buscar los articulos
            const response = await busquedaService.searchWord(word,isEdit);
            if (response.err !== '') {
                this.articulos=[]
				showErrorModal(response.err, theme);
				this.nombre=''
                this.isLoading = false;
				return;
			}
            this.isLoading = false;

            // Si hay error mandamos Swal y omitimos el resto
            if (response.err !== '') {
                Swal.fire({
                    icon: 'error',
                    title: 'Ha ocurrido un error',
                    text: response.err,
                });

                return;
            }

            const articulosArr = response.data;
            this.articulosActivos = articulosArr.length;
            // Partimos el arreglo en los que tienen disponibilidad y los que no
            let [sinDisponibilidad, conDisponibilidad] = partition(articulosArr, (el)=>el.disponibilidad===0);
            // Mandamos al final los que no tienen disp
            if(sinDisponibilidad.length>0)
                conDisponibilidad.push(...sinDisponibilidad)

            this.articulos = conDisponibilidad;

            // Inicializamos los filtros
            this.startFilters(conDisponibilidad);

            // Agregamo campos que nos van a ser utiles
            this.articulos.forEach((el)=>{
                el.hidden = false;
                el.fixedIndex =  -1;
            });
            this.articulos.forEach(articulo=>{
                this.tieneCoincidenciaConPalabra(articulo.descripcion)
            })
            //console.log(this.articulos)
            this.setRegla();
            this.itemsLenght = this.articulos.filter(el=>!el.hidden).map(articulo=>{return {fixedIndex : articulo.fixedIndex,itemNum: articulo.itemNum}}).length;
            console.log(this.totalSinonimos)
        },
        countMaxLevel(){
            return this.filters.filter((el)=>el.isActive).length - 1;
        },
        sort(){
            //Hace el sort de los items, este swe ejecuta cada que se mueve un elemento
            this.itemsLenght = this.articulos.filter(el=>!el.hidden).map(articulo=>{return {fixedIndex : articulo.fixedIndex,itemNum: articulo.itemNum}}).length;
            const sorts = [];

            // Se crea un arreglo con los ordenamientos que se deben realizar
            this.filters.forEach((elemento)=>{
                const division = this.getOrdenamiento(elemento);
                if(division !== '')
                    sorts.push(division);
            });

            // Si no se debe ordenar se regresa
            if(sorts.length === 0) return;

            // Se dividen los articulos en los que se deben mostrar y los que no
            let [hiddenItems, notHiddenItems] = partition(this.articulos, (item)=>item.hidden);

            // Se dividen los articulos en los que tienen pin y los que no
            let [fixedItems, notFixedItems] = partition(notHiddenItems, (item)=>item.fixedIndex >= 0);
            /*
                Se dividen los articulos que no tienen pin
                en los que no tienen disponibilidad y los que si
            */
            let [sinDisponibilidad, conDisponibilidad] = partition(notFixedItems, (el)=>el.disponibilidad===0);

            // Se ordenan los articulos con disponibilidad y que no tienen pin
            conDisponibilidad = sorts.shift()(conDisponibilidad,sorts);

            // Se ponen al final los articulos sin disponibilidad
            if(sinDisponibilidad.length>0)
                conDisponibilidad.push(...sinDisponibilidad);

            if(hiddenItems.length>0)
                conDisponibilidad.push(...hiddenItems);

            // Se insertan los articulos que tienen pin en sus posiciones correctas
            fixedItems.forEach((fixedItem)=>{
                conDisponibilidad.splice(fixedItem.fixedIndex,0,fixedItem);
            });

            // Se actualiza el DOM 
            this.articulos =  conDisponibilidad;
            console.log(this.filters)
        },
        sortFixed(){
            let [fixedItems, notFixedItems] = partition(this.articulos, (item)=>item.fixedIndex >= 0);
            fixedItems.forEach((fixedItem)=>{
                notFixedItems.splice(fixedItem.fixedIndex,0,fixedItem);
            });
            this.articulos =  notFixedItems;
        },
        getOrdenamiento(elemento){
            //trae los ordenamientos
            const {filter, isActive} = elemento;
            if(!isActive)
                return '';
            if(filter === 'marcas')
                return this.sortMarca;
            if(filter === 'familias')
                return this.sortFamilia;
            if(filter ===  'estatus')
                return this.sortEstatus;
            if(filter ===  'protecciones')
                return this.sortProtecciones;
            if(filter === 'nuevos')
                return this.sortNuevos;
            if(filter === 'bundles')
                return this.sortBundle;
            if(filter === 'subfamilias')
                return this.sortSubfamilia;
            return '';
        },
        getIndexSort(nombre){
            //el index del elemento que se mueve
            return this.filters.filter((el)=>el.isActive).findIndex((el)=>el.filter===nombre);
        },
        sortMarca(arr,sorts){
            //sort de la marca
            const indice = this.getIndexSort('marcas');
            const call = sorts[indice];
            const keyName = 'marca';
            return this.sortHelperGroups(arr,keyName, this.marcas, call, indice, sorts);
        },
        sortFamilia(arr,sorts){
            //sort de la familia
            const indice = this.getIndexSort('familias');
            const call = sorts[indice];
            const keyName = 'noFamilia';
            return this.sortHelperGroups(arr,keyName, this.familias, call, indice, sorts);
        },
        sortSubfamilia(arr,sorts){
            //sort de la subfamilia
            const indice = this.getIndexSort('subfamilias');
            const call = sorts[indice];
            const keyName = 'noSubfamilia';
            return this.sortHelperGroups(arr,keyName, this.subfamilias, call, indice, sorts);
        },
        sortHelperGroups(arr, key, desiredOrder, call, indice, sorts){
            //sort de los groups
            const grupos = groupBy(arr, articulo => articulo[key]);

            const reorder = [];
            for (const el of desiredOrder) {
                const currentKey = el[key];
                if (!el.isActive && grupos[currentKey]) {
                    grupos[currentKey].forEach((el) => (el.hidden = true));
                    reorder.push(...grupos[currentKey]);
                    continue;
                }

                if (this.countMaxLevel() !== indice && grupos[currentKey]) {
                    grupos[currentKey] = call(grupos[currentKey], sorts);
                }

                if (el !== undefined && currentKey !== undefined && grupos[currentKey]) {
                    reorder.push(...grupos[currentKey]);
                }
            }
            return reorder;
        },
        sortEstatus(arr,sorts){
            //sort del estatus
            if(this.estatus === '1' )
                return this.sortInventario(arr, sorts, true);
            if(this.estatus === '2')
                return this.sortInventario(arr, sorts, false);
            if(this.estatus === '3')
                return this.sortPrecio(arr, sorts, true);
            if(this.estatus === '4')
                return this.sortPrecio(arr, sorts, false);
        },
        sortNuevos(arr,sorts){
            // sort de los elementos nuevos
            let [nuevosArticulos, noNuevos] = partition(arr, (item)=>item.esNuevo);
            const indice = this.getIndexSort('nuevos');
            const call = sorts[indice];
            if(this.countMaxLevel() != indice){
                nuevosArticulos = call(nuevosArticulos, sorts);
                noNuevos = call(noNuevos, sorts);
            }
            nuevosArticulos.push(...noNuevos);
            return nuevosArticulos;
                
        },
        sortProtecciones(arr,sorts){
            // sort de las protecciones
            let [conProte, sinProte] = partition(arr, (item)=>item.tieneProteccion);
            const indice = this.getIndexSort('protecciones');
            const call = sorts[indice];
            if(this.countMaxLevel() != indice){
                sinProte = call(sinProte, sorts);
                conProte = call(conProte, sorts);
            }
            conProte.push(...sinProte);
            return conProte;
        },
        sortBundle(arr,sorts){
            //sort de los bundle
            let [con, sin] = partition(arr, (item)=>item.tieneBundle);
            const indice = this.getIndexSort('bundles');
            const call = sorts[indice];
            if(this.countMaxLevel() != indice){
                sin = call(sin, sorts);
                con = call(con, sorts);
            }
            con.push(...sin);
            return con;
        },
        sortInventario(arr,sorts,isAsc){
            //sort del inventario
            let mitadInferior = arr.sort((a,b)=>{return a.disponibilidad-b.disponibilidad});
            const indice = this.getIndexSort('estatus');
            const half = Math.floor(mitadInferior.length/2);
            let mitadSuperior = mitadInferior.splice(half);
            
            if(this.countMaxLevel() != indice){
                const call = sorts[indice]
                mitadInferior = call(mitadInferior,sorts);  
                if(mitadSuperior)
                    mitadSuperior = call(mitadSuperior,sorts);  
            }

            if(mitadSuperior)
                mitadInferior.push(...mitadSuperior);

            if(isAsc){
                return mitadInferior.reverse();
            }
            
            return mitadInferior;
        },
        sortPrecio(arr,sorts,isAsc){
            //sort de los precios
            let mitadInferior = arr.sort((a,b)=>{return a.precio-b.precio});
            const indice = this.getIndexSort('estatus');
            const half = Math.floor(mitadInferior.length/2);
            let mitadSuperior = mitadInferior.splice(half);
            if(this.countMaxLevel() != indice){
                const call = sorts[indice]
                mitadInferior = call(mitadInferior,sorts);  
                if(mitadSuperior)
                    mitadSuperior = call(mitadSuperior,sorts);  
            }
            if(mitadSuperior)
                mitadInferior.push(...mitadSuperior);
            if(isAsc){
                return mitadInferior.reverse();
            }
            return mitadInferior;
        },
        hideElements(){
            //
            let activos = 0;
            this.articulos.forEach((el)=>{
                const isM = this.familias.findIndex((familia)=>familia.isActive && el.familia === familia.familia);
                const isF = this.marcas.findIndex((marca)=>marca.isActive && el.marca === marca.marca);
                if(isM > -1 && isF > -1) {
                    el.hidden =  false;
                    activos++;
                }else{
                    el.hidden = true;
                    el.fixedIndex =  -1;
                }
            });
            this.articulosActivos =  activos;
            this.sort();
            this.itemsLenght = this.articulos.filter(el=>!el.hidden).map(articulo=>{return {fixedIndex : articulo.fixedIndex,itemNum: articulo.itemNum}}).length;
            
        },

        moveArticulos({ relatedContext, draggedContext }){
            //se ejecuta al movel el articulo
            const draggedElement = draggedContext.element;
            const relatedElement =  relatedContext.element;
            if(draggedElement.disponibilidad === 0 || relatedElement.disponibilidad === 0) {
                return false;
            }
            //draggedElement.fixedIndex =  draggedContext.futureIndex;
        },
        dropArticulo(evt){
            //se ejecuta el hacer el drop del articulo
            this.dragging=false
            let {newIndex, oldIndex} = evt;
            const baseIndex = this.articulos.findIndex(el=>!el.hidden);
            newIndex += baseIndex;
            oldIndex += baseIndex;
           
            if(newIndex === oldIndex) return;
            const otherElement = oldIndex - newIndex > 0 ? newIndex+1 : newIndex-1;
            
            if(this.articulos[newIndex]?.disponibilidad !== 0 && this.articulos[otherElement]?.disponibilidad !== 0){
                this.articulos[newIndex].fixedIndex =  newIndex;  
            }

            if(this.articulos[otherElement]?.fixedIndex !== -1 && this.articulos[otherElement]?.disponibilidad !== 0){
                this.articulos[otherElement].fixedIndex =  oldIndex;
            }

            this.sortFixed();
        },
        async guardarDatos(){
            //guarda los items y tambien la regla
            const items = this.articulos.filter(el=>!el.hidden).map(articulo=>{return {fixedIndex : articulo.fixedIndex,itemNum: articulo.itemNum}});
            const theme = "dark"
            if(this.sinonimos.length ==0){

                const segundaValidacion = await Swal.fire({
                    title: 'Estas seguro de quieres registrar una regla sin sinonimos?',
                    text: "Si se agrega un sinonimo despues de cargar la regla, esta se desactivara",
                    icon: 'info',
                    color: theme == "dark" ? '#F5F5F5' : '#212121',
                    background: theme != "dark" ? "#F5F5F5" : "#212121",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, aprobar'
                });
                if (segundaValidacion.isDismissed) {
                    return;
                }
            }
            const criterios = [];
            this.filters.forEach(filtro=>{
                if(!filtro.isActive){
                    return;
                }

                switch(filtro.filter){
                    case 'familias':
                        criterios.push({ 
                            datos: this.familias.filter(familia=>familia.isActive).map(fam=>fam.familia),
                            nombre: 'familias'
                        });
                    break;
                    case 'subfamilias':
                        criterios.push({ 
                            datos: this.subfamilias.filter(subfamilia=>subfamilia.isActive).map(sf=>sf.subfamilia),
                            nombre: 'subfamilias'
                        });
                    break;
                    case 'marcas':
                        criterios.push({ 
                            datos: this.marcas.filter(marca=>marca.isActive).map(marca=>marca.marca),
                            nombre: 'marcas'
                        });
                    break;
                    case 'estatus': 
                        criterios.push({ 
                            datos: [this.estatus],
                            nombre: 'estatus'
                        });
                    break;
                    default:
                        criterios.push({
                            datos: [],
                            nombre: filtro.filter
                        })
                    break;
                }

            });
            const exclusiones=[]
            this.filters.forEach(filtro=>{
                if(!filtro.isActive){
                    return;
                }

                switch(filtro.filter){
                    case 'familias':
                        exclusiones.push({ 
                            datos: this.familias.filter(familia=>!familia.isActive).map(fam=>fam.familia),
                            nombre: 'familias'
                        });
                    break;
                    case 'subfamilias':
                        exclusiones.push({ 
                            datos: this.subfamilias.filter(subfamilia=>!subfamilia.isActive).map(sf=>sf.subfamilia),
                            nombre: 'subfamilias'
                        });
                    break;
                    case 'marcas':
                        exclusiones.push({  
                            datos: this.marcas.filter(marca=>!marca.isActive).map(marca=>marca.marca),
                            nombre: 'marcas'
                        });
                    break;
                    default:
                        criterios.push({
                            datos: [],
                            nombre: filtro.filter
                        })
                    break;
                }
            });

            this.articulos.sort((a, b) => {
                const indexA = items.indexOf(a.itemNum)
                const indexB = items.indexOf(b.itemNum)
                return indexA - indexB
            })
            this.articulos.splice(items.length,this.articulos.length)
            console.log({"Articulos":this.articulos})
            const reglaBusqueda = {
                items :  items,
                itemsDTO:this.articulos,
                keyword :  this.palabraBuscada,
                criterios,
                exclusiones,
                divCodes: ['DCM']
            };
            this.isLoading = true;
            console.log({"reglas":reglaBusqueda})
             const response = await busquedaService.saveItems(reglaBusqueda);
              this.isLoading = false;
            if(response.err!==''){
                showErrorModal("Ha ocurrido un error","dark")
            }else{
                showSuccessModal("Se ha guardado con exito la regla","dark")
            }
        },
        async getReglas(keyword){
            const res = await busquedaService.getRegla(keyword)
            console.log(res.data)
            const event= {
                target:{
                    value:keyword
                }
            }
            this.criterios = res.data.criterios;
            this.pins =res.data.pins;
            this.buscarWord(event,true,this.theme)
           
        },
        setRegla(){
            //setea la reggla si es que se va a editar una regla
            //Se ordenan los filtros
            const arrCriteriosNombre=this.criterios.map(criterio => criterio.nombre)
            this.filters = this.filters.map(fil => {
                if(arrCriteriosNombre.includes(fil.filter)){
                    return {
                        ...fil,
                        isActive:true
                    }
                }
                return fil
            })
            this.filters.map(fil =>{
                if(!arrCriteriosNombre.includes(fil.filter)){
                    arrCriteriosNombre.push(fil.filter)
                }
            })
            this.filters.sort((a, b) => {
                const indexA = arrCriteriosNombre.indexOf(a.filter)
                const indexB = arrCriteriosNombre.indexOf(b.filter)
                return indexA - indexB
            })

            const helperFamilias =[]
            const criteriosFamilia = this.criterios.find(criterio => criterio.nombre ==='familias')
            if(!!criteriosFamilia){
                this.familias.map(fam =>{
                if(!criteriosFamilia.datos.includes(fam.familia)){
                    criteriosFamilia.datos.push(fam.familia)
                    fam.isActive = false;
                }
                })
                this.familias.sort((a,b)=>{
                    const indexA = criteriosFamilia.datos.indexOf(a.familia)
                    const indexB = criteriosFamilia.datos.indexOf(b.familia)
                    return indexA - indexB
                })
            }
            const criteriosSubfamilia = this.criterios.find(criterio => criterio.nombre ==='subfamilias')
            if(!!criteriosSubfamilia){
                this.subfamilias.map(subf =>{
                if(!criteriosSubfamilia.datos.includes(subf.subfamilia)){
                    criteriosSubfamilia.datos.push(subf.subfamilia)
                    subf.isActive = false
                }
                })
                this.subfamilias.sort((a,b)=>{
                    const indexA = criteriosSubfamilia.datos.indexOf(a.subfamilia)
                    const indexB = criteriosSubfamilia.datos.indexOf(b.subfamilia)
                    return indexA - indexB
                })
            }
            const criteriosMarcas = this.criterios.find(criterio => criterio.nombre ==='marcas')
            if(!!criteriosMarcas){
                this.marcas.map(mar =>{
                if(!criteriosMarcas.datos.includes(mar.marca)){
                    criteriosMarcas.datos.push(mar.marca)
                    mar.isActive=false
                }
                })
                this.marcas.sort((a,b)=>{
                    const indexA = criteriosMarcas.datos.indexOf(a.marca)
                    const indexB = criteriosMarcas.datos.indexOf(b.marca)
                    return indexA - indexB
                })
            }
            this.articulos = this.articulos.map(articulo =>{
                const pin =this.pins.find(pin => pin.itemNum == articulo.itemNum)
                if(!!pin){
                    return {
                        ...articulo,
                        fixedIndex: pin.fixedIndex 
                    }
                }else{
                    return {
                        ...articulo
                    }
                }
            })
            this.sort()
            this.hideElements()
        },
    },
    async mounted(){
        //solo si es una vista de edit
        if(this.routeParam != 'new' ){
            this.getReglas(this.routeParam)
        }
    }
}

</script>

<template>
    <NuxtLayout name="default">
    <template #body>
        <v-card class="sombra ma-5" style="border-radius:5px" elevation="15" >
            <v-card-title  class="bg-grey-darken-3 d-flex  align-center">
                    <v-icon icon="mdi-upload" size="large"></v-icon>
                <div class="text-h7 pa-2 content" v-if="routeParam=='new'" > Criterios </div>
                <div class="text-h7 pa-2 content" v-else>Editar regla</div>
            </v-card-title>
    <v-card class="sombra ma-5 pa-5" style="border-radius:5px">

        <v-row class="d-flex justify-center justify-space-between">
            <!-- <div class="px-5" style="display:flex;justify-content:space-around;align-items: center;"> -->
                <v-col cols="3" class="d-flex justify-center align-self-center">
                    <v-text-field v-if="routeParam=='new'"
                        label="Buscar"
                        id="palabra"
                        @keydown.enter.prevent="buscarWord($event,false,'dark',resetCounts)">
                    </v-text-field>
                    <!-- <input type="text" @keydown.enter.prevent="buscarWord($event)" id="palabra" class="form-control">
                    <label for="palabra">Buscar</label> -->
                </v-col> 

                <v-col cols="5" v-if="sinonimos.length==0" class="d-flex justify-center align-self-center">
                    <div v-if="palabraBuscada!==''">
                        <h5>Esta configurando la busqueda de la palabra: </h5>
                        <v-chip style=" display: inline-block;" class='bg-yellow-darken-1  rounded pa-1 text-black'>{{ palabraBuscada }} ({{ itemsLenght }})</v-chip>
                    </div>
                </v-col>
                <v-card cols="7" style="width:600px; border:1px solid rgb(128, 128, 128);" v-if="sinonimos.length!=0" class="d-flex justify-center">
                    <v-row>
                    <v-col cols="4" v-if="sinonimos.length!=0" class="d-flex justify-center align-self-center">
                        <div v-if="palabraBuscada!==''">
                            <h5>Palabra : </h5>
                            <v-chip style="display: inline-block;" class='bg-yellow-darken-1  rounded pa-1 text-black'>{{ palabraBuscada.toUpperCase() }} ({{countKeywords}})</v-chip>
                        </div>
                    </v-col>
                    <v-col cols="4" v-if="sinonimos.length!=0" class="d-flex justify-center align-self-center">
                        <div v-if="palabraBuscada!==''">
                            <h5>Sinonimos:</h5>
                        <v-chip  v-for="(cantidad, nombre) in totalSinonimos" :key="nombre" style=" display: inline-block;" class='bg-pink-lighten-1 rounded pa-1 text-black mr-1' >{{ nombre }} ({{ cantidad }})</v-chip>
                        
                    </div>

                    </v-col>
                    <v-col cols="4" v-if="sinonimos.length!=0" class="d-flex justify-center align-self-center">
                        <div v-if="palabraBuscada!==''">
                            <h5>Match multiple: </h5>
                            <v-btn variant="outlined" color="green-lighten-2 text-black"   style="cursor: default">
                                Items ({{ countMatchmultiple }})
                            </v-btn>
                        </div>
                    </v-col>
                </v-row>
                </v-card>
                <v-col cols="2" class="d-flex justify-center align-self-center">
                    <div class="col-2">
                        <v-btn @click="guardarDatos"  color="blue-darken-1" variant="outlined" :disabled="isLoading || articulosActivos==0">Guardar</v-btn>
                    </div>
                </v-col>
            <!-- </div> -->
        </v-row>
    </v-card>

    <loader v-if="isLoading" />
    <v-card v-if="articulos.length>0 && !isLoading" class="sombra ma-5 pa-5 rounded-0"  ref="container" elevation="0"
     >
        <v-row>
        <v-col  cols="2">
            <v-card id="accordionCriterios" role="tablist" aria-multiselectable="true" class="rounded-0" elevation="0">

                <draggable v-model="filters"   group="filters" item-key="filter" @start="drag=true" @end="()=>sort()" >
                <template #item="{ element, index }">
                    <template v-if="element.filter==='marcas'"> 
                    <accordionTab  :header="'Marcas'" :id="'marcas'" v-slot="props" :position="index"
                        @on-toggle="handleToggle" :isActive="element.isActive">
                        <draggable v-model="marcas" group="marcas" item-key="marca" 
                            :move="()=>{return props.shouldWork}" 
                            @end="()=>{if(props.shouldWork) sort()}" style="cursor:pointer;">
                            <template #item="{ element }">
                                <v-card style="display:flex;align-items:baseline;" class="rounded-0" elevation="0">
                                    <input type="checkbox" style="opacity:1;pointer-events: auto;position:relative;" v-model="element.isActive"
                                        :disabled="!props.shouldWork"  @change="hideElements(element.marca)" />
                                    <p>
                                        {{ element.marca }}({{ element.count }})
                                    </p>
                                </v-card>
                            </template>
                        </draggable>
                    </accordionTab>
                    </template>

                   
                    <template v-else-if="element.filter==='familias'" >
                    <accordionTab :header="'Familias'" :id="'familias'" v-slot="props" :position="index" 
                        @on-toggle="handleToggle" :isActive="element.isActive">
                        <draggable v-model="familias" group="familia" 
                            :move="()=>{return props.shouldWork}" 
                            @end="()=>{if(props.shouldWork) sort()}"
                            item-key="familia" style="cursor:pointer;" >
                            <template #item="{ element }">
                                <v-card style="display:flex;align-items:baseline;" class="rounded-0" elevation="0">
                                    <input type="checkbox" style="opacity:1;pointer-events: auto;position:relative;" :disabled="!props.shouldWork" v-model="element.isActive" @change="hideElements(element.familia)"/>
                                    <p>
                                        {{ element.familia }} - {{ element.noFamilia }}  ({{ element.count }})
                                        <span v-if="element.familia === 'SIN'" title="Los articulos SIN no aparecen en el arbol"><i class="fas fa-exclamation-triangle text-danger" ></i></span>
                                    </p>
                                </v-card>
                            </template>
                        </draggable>
                    </accordionTab>
                    </template>

                    <template v-else-if="element.filter==='subfamilias'" >
                        <accordionTab :header="'Subfamilias'" :id="'subfamilias'" v-slot="props" :position="index"
                            @on-toggle="handleToggle" :isActive="element.isActive">
    
                            <draggable v-model="subfamilias" group="subfamilia" 
                                :move="()=>{return props.shouldWork}" 
                                @end="()=>{if(props.shouldWork) sort()}"
                                item-key="subfamilia" style="cursor:pointer;">
                                <template #item="{ element }">
                                    <v-card style="display:flex;align-items:baseline;" class="rounded-0" elevation="0">
                                        <input type="checkbox" style="opacity:1;pointer-events: auto;position:relative;" :disabled="!props.shouldWork" v-model="element.isActive" @change="hideElements(element.subfamilia)"/>
                                        <p>
                                            {{ element.subfamilia }} - {{ element.noSubfamilia }} ({{ element.count }})
                                            <span v-if="element.subfamilia === 'SIN'" title="Los articulos SIN no aparecen en el arbol"><i class="fas fa-exclamation-triangle text-danger" ></i></span>
                                        </p>
                                    </v-card>
                                </template>
                            </draggable>
                        </accordionTab>
                    </template>

                    <template v-else-if="element.filter==='estatus'">
                    <accordionTab  :header="'Estatus'" :id="'estatus'" v-slot="props" :position="index"
                        @on-toggle="handleToggle" :isActive="element.isActive">

                        <v-card class="btn-group rounded-0" style="display: flex;flex-flow:column nowrap">
                            <v-card class=" rounded-0" elevation="0">
                                <input  v-model="estatus" :disabled="!props.shouldWork" @change="sort" name="removelines" type="radio" class="cheker" v-bind:value="'1'" >
                                Inventarios de mayor a menor
                            </v-card>
                            <v-card class="rounded-0" elevation="0" >
                                <input v-model="estatus" :disabled="!props.shouldWork" @change="sort" name="removelines" type="radio" class="cheker" v-bind:value="'2'">
                                Inventarios de menor a mayor
                            </v-card>
                            <v-card class="rounded-0" elevation="0" >
                                <input v-model="estatus" :disabled="!props.shouldWork" @change="sort" name="removelines" type="radio" class="cheker" v-bind:value="'3'">
                                Precios de mayor a menor
                            </v-card>
                            <v-card class="rounded-0" elevation="0">
                                <input v-model="estatus" :disabled="!props.shouldWork" @change="sort" name="removelines" type="radio" class="cheker" v-bind:value="'4'">
                                Precios de menor a mayor
                            </v-card>
                        </v-card>

                    </accordionTab>
                    </template>

                    <template v-else-if="element.filter==='protecciones'">
                        <accordionTab  :header="'Protecciones'" :id="'protecciones'" v-slot="props" :position="index"
                            @on-toggle="handleToggle" :has-child="false" :isActive="element.isActive">
                        </accordionTab>
                    </template>

                    <template v-else-if="element.filter==='nuevos'">
                        <accordionTab  :header="'Nuevos'" :id="'nuevos'" v-slot="props" :position="index"
                            @on-toggle="handleToggle" :has-child="false" :isActive="element.isActive">
                        </accordionTab>
                    </template>

                    <template v-else-if="element.filter==='bundles'">
                        <accordionTab  :header="'Bundles'" :id="'bundles'" v-slot="props" :position="index"
                            @on-toggle="handleToggle" :has-child="false" :isActive="element.isActive">
                        </accordionTab>
                    </template>

                </template>
                </draggable>
                
                
            </v-card>
        </v-col>


        
        <v-col>
            <div        
            class="container"
            ref="container"
            @mousedown="startScroll"
            @mouseup="startScroll">
                <draggable v-bind="dragOptions" v-model="articulos" group="articulos" item-key="itemNum"  
                style="display:flex;flex-flow:row wrap;flex-basis:80%"
                @start="dragging =true"
                :move="moveArticulos" @end="dropArticulo"
                >
                <template #item="{ element }">
                    <cardItem :articulo="element" :sinonimos="sinonimos" :palabraBuscada="palabraBuscada" @on-free="()=>{element.fixedIndex=-1;sort()}"/>
                    </template>
                </draggable>
            </div>
        </v-col>
    </v-row>
    </v-card>
    </v-card>
    </template>
</NuxtLayout>
</template>

<!-- <script setup>

</script> -->

<style>
    .sombra{
        -webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.30);
        -moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.30);
        box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.30);
    }
</style>