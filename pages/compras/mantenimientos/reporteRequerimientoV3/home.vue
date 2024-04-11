<script>
import ExcelJS from 'exceljs';
import AuthService from "@/auth/service/Auth.js";
import { useRefreshData } from "@/store/refreshData";
import { mapState } from "pinia";
import loader from "@/commons/vue/loader.vue";
import reporteService from "@/app/compras/mantenimientos/reporterequerimientov3/services/reporterequerimientov3service.js";
import { CallTracker } from "assert";
import Swal from "sweetalert2";
export default {
  computed: {
    ...mapState(useRefreshData, ["refresHome"]),
    pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      }

  },
  name: "layout",
  props: {},
  data() {
    return {
      pagination: {},
      contador:0,
      seleccionClass:false,
      toggle:[
  "'+'",
  "'1'",
  "'B'",
  "'C'",
  "'N'",
  "'L'",
  "'D'",
  "'O'",
  "'R'"
],
      loading3: false,
      selected:[],
      singleSelect: false,
        
      dialog6:false,
      datosOcMail:[],
      mensaje:'',
      dialog2:false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      a: 0,
      search: "",
      isLoading: false,
      lineaNegocio: [],
      lineaNegocioSelected: "",
      comprador: [],
      compradorSelected: "",
      articuloSelected: "",
      proveedorSelected: "",
      almacen: [
        { almacen: "TI", codigo: 1 },
        { almacen: "PAPELERÍA", codigo: 2 },
      ],
      almacenSelected: "",
      bodega: [
        { bodega: "ANÁHUAC", codigo: "'01','02'" },
        { bodega: "CEYLAN", codigo: "'03','04'" },
      ],
      bodegaSelected: "",
      colocacion: [],
      colocacionSelected: "",
      itemsCollection: [],
      infoBusqueda: [],
      clases: ["+", "1", "B", "C", "N", "L", "D", "O", "R", "TODOS"],
      claseAll: false,
      verComprar: false,

      headers2: [
          {
            text: 'Dessert (100g serving)',
            align: 'left',
            sortable: false,
            value: 'name'
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' }
        ],
      headers: [
        { title: "Almacén", style: "  background-color:#4b515d ;" },
        { title: "Comprador", style: "  background-color:#4b515d ;" },
        { title: "Línea", style: "  background-color:#4b515d ;" },
        { title: "Articulos DCM", style: "  background-color:#4b515d ;" },
        { title: "Descripción", style: "  background-color:#4b515d ;" },
        { title: "Clave Prov ", style: "  background-color:#4b515d ;" },
        { title: "UPC", key: "upc", style: " background-color:#4b515d ;" },
        { title: "No. Prov", style: "  background-color:#4b515d ;" },
        { title: "Clas", style: "  background-color:#4b515d ;" },
        { title: "Rank", key: "rank", style: "  background-color:#4b515d ;" },
        { title: "Plt", key: "pallet", style: "  background-color:#4b515d ;" },
        { title: "Mlt", key: "mlt", style: "  background-color:#4b515d ;" },
        { title: "$Ult Cto", style: "  background-color:#4b515d ;" },
        { title: "$Cto Prom", style: "  background-color:#4b515d ;" },
        { title: "$Cto Vta", style: "  background-color:#4b515d ;" },
        { title: "$Cto Prot", style: "  background-color:#4b515d ;" },
        //almacen
        { title: "Res", style: "  background-color:#f44336 ;" },
        { title: "Exit", style: "  background-color:#f44336 ;" },
        { title: "Disp", style: "  background-color:#f44336 ;" },
        { title: "Dias Inv", style: "  background-color:#f44336 ;" },
        { title: "Inv Prom", style: "  background-color:#f44336 ;" },
        { title: "Dias 0", style: "  background-color:#f44336 ;" },
        //VENTAS
        { title: "VPA", style: "  background-color:#4caf50 ;" },
        { title: "VPH", style: "  background-color:#4caf50 ;" },
        { title: "VP365", style: "  background-color:#4caf50 ;" },
        { title: "Picos", style: "  background-color:#4caf50 ;" },
        { title: "Piezas", style: "  background-color:#4caf50 ;" },
        { title: "Ctes DC", style: "  background-color:#4caf50 ;" },
        { title: "Ctes OP", style: "  background-color:#4caf50 ;" },
        //ETIQUETADO
        { title: "Min.D", style: "  background-color:#0000ff ;" },
        { title: "Max.D", style: "  background-color:#0000ff ;" },
        { title: "Min.P", style: "  background-color:#0000ff ;" },
        { title: "Max.P", style: "  background-color:#0000ff ;" },
        { title: "Com", style: "  background-color:#0000ff ;" },
        { title: "Trp", style: "  background-color:#0000ff ;" },
        { title: "Ult Etiq", style: "  background-color:#0000ff ;" },
        //LOGISTICA #795548
        { title: "Max Log", style: "  background-color:#795548 ;" },
        { title: "Exced", style: "  background-color:#795548 ;" },
        //COLOCACION
        { title: "Calendario", style: "  background-color:#f5c211 ;" },
        { title: "Ultima OC", style: "  background-color:#f5c211 ;" },
        { title: "X Rex OC", style: "  background-color:#f5c211 ;" },
        { title: "Fill Rate 1", style: "  background-color:#f5c211 ;" },
        { title: "Fill Rate 2", style: "  background-color:#f5c211 ;" },
        { title: "T.E. Prov", style: "  background-color:#f5c211 ;" },
        { title: "Sugerido OC", style: "  background-color:#f5c211 ;" },
        { title: "Dias Inv OC", style: "  background-color:#f5c211 ;" },
        { title: "Monto OC", style: "  background-color:#f5c211 ;" },
        { title: "Generar OC", style: "  background-color:#f5c211 ;" }, //check
        //TRASPASOS
        { title: "Ultimo TRP", style: "  background-color:#673ab7 ;" },
        { title: "X Rec TRP", style: "  background-color:#673ab7 ;" },
        { title: "Sugerido TRP", style: "  background-color:#673ab7 ;" },
        { title: "Dias Inv TRP", style: "  background-color:#673ab7 ;" }, //*
        { title: "Monto TRP", style: "  background-color:#673ab7 ;" }, //** */
        { title: "Generar TRP", style: "  background-color:#673ab7 ;" }, //*** */
      ],
      tablaCompras: [
        "ARTICULOS",
        "PALLET",
        "MULTIPLO",
        "BODEGA",
        "VP",
        "$",
        "SUG",
        "FINAL",
        "DI",
      ],
      compraAnahuac: [],
      compraCeylan: [],
      totalAna: 0,
      totalCey: 0,
      anaOc: 0,
      ceyOc: 0,

      numeroProveedorAnahuac:null,
      razonSocialAnahuac:null,
      campraMinimoAnahuac:null,
      montoAnahuac:null,

      numeroProveedorCeylan:null,
      razonSocialCeylan:null,
      campraMinimoCeylan:null,
      montoCeylan:null,
      dataPoveedor:[],
      proveedorAnahuac:{},
      proveedorCeylan:{}
    };
  },

  computed: {
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      let end = start + this.pageSize;
      if (this.pageSize === "Todos") {
        end = this.filteredData.length;
      }
      return this.filteredData.slice(start, end);
    },
    totalPages() {
      if (this.pageSize === "Todos") {
        return 1;
      }
      return Math.ceil(this.filteredData.length / this.pageSize);
    }
  },

  methods: {
    async getLineaNegocio() {
      const response = await reporteService.getLineaNegocio();
      if (response.err === "") {
        this.lineaNegocio = response.data;
      }
    },

    async getComprador() {
      const response = await reporteService.getComprador();
      if (response.err === "") {
        this.comprador = response.data;
      }
    },

    async getEmpleadoColocacion() {
      const response = await reporteService.getEmpleadoColocacion();
      if (response.err === "") {
        this.colocacion = response.data.data;
      }
    },

    setClass(valor) {
      if (valor == "TODOS") {
        this.claseAll = this.claseAll == true ? false : true;
      }
      this.clases.forEach((c) => {
        if (valor == "TODOS") {
          document.getElementById(c).style.backgroundColor =
            this.claseAll == true ? "#f5f5f5" : "#212121";
          document.getElementById(c).style.color =
            this.claseAll == true ? "black" : "white";
        } else {
          if (c == valor) {
            this.classSelected = valor;
            document.getElementById(valor).style.backgroundColor = "#f5f5f5";
            document.getElementById(valor).style.color = "black";
            // document.getElementById(valor).style.borderColor = "black";
          } else {
            document.getElementById(c).style.backgroundColor = "#212121";
            document.getElementById(c).style.color = "white";
            //document.getElementById(c).style.borderColor = "white";
          }
        }
      });
    },

    async buscarInfo() {
      this.isLoading = true;
      let items = [];

      if (this.colocacionSelected != ""&&this.colocacionSelected!=null) {
        //se selecciono empleadocolo
        items = await this.getItemColocacion();
      }
      //console.log(items);
      await this.busquedaItems(items);

      if (this.itemsCollection.length > 0) {
        console.log(this.itemsCollection.length);
        await this.getItemsAll(this.itemsCollection);
        console.log(this.infoBusqueda);
      }

      this.isLoading = false;
    },

    async busquedaItems(items) {

      let clas=null;

this.toggle.forEach(function(datos){
                if(clas===null)
                {
                  clas=datos  
                } 
                else{
                clas=clas+","+datos;}
      });

      console.log(clas);

      let datos = {
        item: this.articuloSelected,
        lineaNegocio: this.lineaNegocioSelected,
        buyerNum: this.compradorSelected,
        vendorNum: this.proveedorSelected,
        abcClass: clas, //this.classelected
        bodega: this.bodegaSelected,
        papeleriati: this.almacenSelected,
        classSelected: "",
        items: items,
      };

      console.log("DATOS A BUSCAR "+datos);

  
      const response = await reporteService.busquedaItems(datos);
      console.log("tamaño"+response.data.length);
       if(response.data.length===0){
          this.dialog2=true;
          this.mensaje="NO HAY DATOS QUE COINCIDAN CON SU BUSQUEDA!";
       }

      if (response.err === "") {
        this.itemsCollection = response.data;
      }
    },
    //ejemplo
    async getItemColocacion() {
      let datos = {
        numeroEmpleado: parseInt(this.colocacionSelected),
        nombre: "",
      };

      console.log(datos);
      const response = await reporteService.getItemColocacion(datos);
      if (response.err === "") {
        return response.data.data;
      } else {
        return [];
      }
    },

    async getItemsAll(info) {
      this.totalAna = 0;
      this.totalCey = 0;
      this.anaOc = 0;
      this.ceyOc = 0;
      const response = await reporteService.getItemsAll(info);
      if (response.err === "") {
        this.infoBusqueda = response.data;

        for (let i = 0; i < this.infoBusqueda.length; i++) {
          const e = this.infoBusqueda[i];
          if (e.whseCode == "01" || e.whseCode == "02") {
            this.anaOc += e.sugeridoOC * e.ultCto;
            this.totalAna += e.existencia * e.ultCto;
          } else if (e.whseCode == "03" || e.whseCode == "04") {
            this.ceyOc += e.sugeridoOC * e.ultCto;
            this.totalCey += e.existencia * e.ultCto;
          }
        }
        this.anaOc = this.formatoMoneda(this.anaOc);
        this.totalAna = this.formatoMoneda(this.totalAna);
        this.ceyOc = this.formatoMoneda(this.ceyOc);
        this.totalCey = this.formatoMoneda(this.totalCey);
      }
    },

    formatoMoneda(value) {
      const formatter = new Intl.NumberFormat("es-MX", {
        style: "currency",
        currency: "MXN",
        minimumFractionDigits: 2,
      });
      //return formatter.format(parseFloat(value));

      return new Intl.NumberFormat("en-US").format(parseFloat(value).toFixed(3)); 

    },

    showCompra() {
      this.verComprar = true;
      let n1 = 0;
      let n2 = 0;
      for (let i = 0; i < this.infoBusqueda.length; i++) {
        const e = this.infoBusqueda[i];
        if (e.sugeridoOC > 0) {
          //regresdar
          if ((e.whseCode == "01" || e.whseCode == "02" )&& e.seleccionChec) {
            this.compraAnahuac.push({
              articulo: e.itemNum,
              pallet: e.pallet,
              multiplo: e.mlt,
              bodega: e.whseCode,
              vp: Number.parseFloat(e.ventaPromedio).toFixed(3), ///revisrar
              precio: Number.parseFloat(e.ultCto).toFixed(3),
              sug: Number.parseFloat(e.sugeridoOC).toFixed(1),
              final: Number.parseInt(e.sugeridoOC),
              di: Number.parseFloat(
                (e.sugeridoOC / parseFloat(e.ventaPromedio).toFixed(3)) + e.diasInventario
              ).toFixed(3),
              diaInv: e.diasInventario,
              num: n1,
            });
            n1++;
          } else {
            if(e.seleccionChec){
            this.compraCeylan.push({
              articulo: e.itemNum,
              pallet: e.pallet,
              multiplo: e.mlt,
              bodega: e.whseCode,
              vp: Number.parseFloat(e.ventaPromedio).toFixed(3), ///revisrar
              precio: Number.parseFloat(e.ultCto).toFixed(3),
              sug: Number.parseFloat(e.sugeridoOC).toFixed(1),
              final: Number.parseInt(e.sugeridoOC),
              di: Number.parseFloat(
                (e.sugeridoOC /parseFloat( e.ventaPromedio).toFixed(3)) + e.diasInventario
              ).toFixed(3),
              diaInv: e.diasInventario,
              num: n2,
            });
          
            n2++;
              }
          }
        }
      }
      console.log(this.compraAnahuac);
    },

    cerrarCompra() {
      this.compraAnahuac = [];
      this.compraCeylan = [];
      this.verComprar = false;
    },

    async copiarInfo() {
      var aux = document.createElement("div");
      aux.setAttribute("contentEditable", true);
      aux.innerHTML = document.getElementById("infoTabla").innerHTML;
      aux.setAttribute(
        "onfocus",
        "document.execCommand('selectAll',false,null)"
      );
      try {
        document.body.appendChild(aux);
        aux.focus();
        document.execCommand("copy");
        document.body.removeChild(aux);
        Swal.fire({
          icon: "success",
          title: "Texto Copiado",
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Error al copiar: ", err);
      }

      /*let texto = document.getElementById("infoTabla").dataTable;
      console.log(texto);

      try {
        await navigator.clipboard.writeText(texto);
        console.log("Contenido copiado al portapapeles");
      } catch (err) {
        console.error("Error al copiar: ", err);
      }*/
    },

    async generarExcel() {
      
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporterequerimientov3');

      worksheet.addRow();
      const he=[];
      let contenido=[];
      this.headers.forEach(head=>{
        he.push(head.title);
      });
      
      worksheet.addRow(he);

      
      
    
      this.infoBusqueda.forEach(datos => {
         
          contenido.push(datos.whseCode);
          contenido.push(datos.comprador);
          contenido.push(datos.lineaNegocio);
          contenido.push(datos.itemNum);
          contenido.push(datos.descripcion);
          contenido.push(datos.claveprov);
          contenido.push(datos.upc);
          contenido.push(datos.vendorNum);
          contenido.push(datos.abcClass);
          contenido.push(datos.rank);
          contenido.push(datos.pallet);
          contenido.push(datos.mlt);
          contenido.push(this.formatoMoneda(datos.ultCto));
          contenido.push(this.formatoMoneda(datos.ctoPromedio));
          contenido.push(this.formatoMoneda(datos.ctoVenta));
          if(datos.costo_prot!=='-')
          contenido.push(this.formatoMoneda(datos.costo_prot));
          else
          contenido.push(datos.costo_prot);
          //almacen

          contenido.push(datos.reservado);
          contenido.push(datos.existencia);
          contenido.push(datos.disponible);
          contenido.push(datos.diasInventario);
          contenido.push(this.formatoMoneda(datos.inventarioProm));
          contenido.push(datos.diasSinInventario);
          //ventas

          contenido.push(this.formatoMoneda(datos.ventaPromedio));
          contenido.push(this.formatoMoneda(datos.ventaPromedioHabil));
          contenido.push(this.formatoMoneda(datos.ventaPromedio365));
          contenido.push(datos.picos2);
          contenido.push(datos.piezasOC);
          contenido.push(datos.clientes);
          contenido.push(datos.clientesOperadora);

          //etiquetado
          contenido.push(datos.diasMinimo);
          contenido.push(datos.diasMaximo);
          contenido.push(datos.pzasMinimo);
          contenido.push(datos.pzasMaximo);
          if(datos.enBodega==="S")
               contenido.push("SI");
            else
              contenido.push("NO");
          if(datos.enTraspaso==="S")
            contenido.push("SI");
          else
          contenido.push("NO");

          contenido.push(datos.ulFechaEtiquetado);

          //logistica 
          contenido.push(datos.maxLogistica);
          contenido.push(datos.excedente);

          //colocacion
          contenido.push(datos.diasColocacion);
          contenido.push(datos.fechaOC);
          contenido.push(datos.xrecOc);
          if(datos.fillRate!==null)
          contenido.push(datos.fillRate);
          else
          contenido.push("0");

          contenido.push(this.formatoMoneda(datos.fillRate2));
          contenido.push(datos.teprov);
          contenido.push(datos.sugeridoOC);
          contenido.push(this.formatoMoneda(datos.diasInventarioOC));
          contenido.push(" ");
          if(datos.seleccionChec)
          contenido.push("SI");
          else
          contenido.push("NO");
        //TRASPASO

          contenido.push(datos.fechaTraspaso);
          contenido.push(datos.xrecTRP);
          contenido.push("");
          contenido.push("");

          contenido.push("");
          contenido.push("");


          




          worksheet.addRow(contenido);
          contenido=[];

      });

      workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'reporterequerimientov3.xlsx');
        document.body.appendChild(link);
        link.click();
      });
      
       

    },
    
    async calculaDi(row, tipo) {
      //var dif = (f/vp)+parseFloat(dia);

      row.di=parseFloat((row.final/row.vp)+row.diaInv).toFixed(3);

 

      var error=document.getElementById("errorANAHUAC");
          if(row.di>60){

              this.dialog3=true;

          }
      //row.di=0;
     
    },
    //regresar
    async getDatosProveedorCeylan() {

                        
                        
                        this.razonSocialCeylan ='';
                        this.proveedorCeylan={};
                        this.montoCeylan=null;
                        this.campraMinimoCeylan =null

                      

          
  if(event.keyCode === 13 || event.code === 'Enter')
      {
              let  datos ={
                          numeroProveedor:this.numeroProveedorCeylan
                          }
                      
                      const datosProveedor= await reporteService.getDatosProveedor(datos);
                      const keys = Object.keys(datosProveedor.data.data);
                      const tamaño = keys.length;
                      this.proveedorCeylan=datosProveedor.data.data;
          




                      if(tamaño>0){
                            this.razonSocialCeylan =datosProveedor.data.data.razonSocial;
                            this.campraMinimoCeylan =datosProveedor.data.data.montoMinimoCompra;

                                        var total=0;
                                                this.compraCeylan.forEach(function(compra) {
                                                  total=(compra.precio*compra.final)+total;
                                                  });
                                                  this.montoCeylan=parseFloat(total).toFixed(3);
                      }else{
                      
                        this.montoCeylan=null;
                        this.razonSocialCeylan =null;
                        this.campraMinimoCeylan =null
                        this.dialog4=true;           

                      }

            }
    },
    async getDatosProveedorAnahuac() {

      this.razonSocialAnahuac ='';
      this.proveedorAnahuac={};
      this.montoAnahuac=null;
      this.campraMinimoAnahuac =null;
      
  if(event.keyCode === 13 || event.code === 'Enter')
  {
                  let  datos ={
                          numeroProveedor:this.numeroProveedorAnahuac
                          }
                      
                      const datosProveedor= await reporteService.getDatosProveedor(datos);
                      const keys = Object.keys(datosProveedor.data.data);
                      const tamaño = keys.length;
                      this.proveedorAnahuac=datosProveedor.data.data;
           
        if(tamaño>0){         

                                this.razonSocialAnahuac=datosProveedor.data.data.razonSocial;
                                this.campraMinimoAnahuac=datosProveedor.data.data.montoMinimoCompra;
                                
                                var total=0;
                                this.compraAnahuac.forEach(function(compra) {
                                                        
                                                        total=(compra.precio*compra.final)+total;

                                                  });

                                                  this.montoAnahuac=parseFloat(total).toFixed(3);

                        

                    }else{

                        this.campraMinimoAnahuac=null;
                        this.razonSocialAnahuac=null;
                        this.montoAnahuac=null;
                        this.dialog4=true;           
                      }


                  

              }

    }
,
    async getColocarItems(bodega){
      let token = localStorage.getItem("jwtToken");
      const tokenParsed = JSON.parse(atob(token.split('.')[1]));  
      const numEmpleado= tokenParsed.numEmpleado;

              if(bodega==='anahuac')
              {

                                  const keys = Object.keys(this.proveedorAnahuac);
                                  const tamaño = keys.length;
                                  console.log("numero de prov"+this.numeroProveedorAnahuac);
                                  const regex = /\S+/;

                      
                  if(tamaño>0&& this.numeroProveedorAnahuac!==null&&this.numeroProveedorAnahuac!==''){
                      
                      if(this.montoAnahuac>this.campraMinimoAnahuac)
                          {
                                  var listaItem=[];
                                  var items={}
                                  this.compraAnahuac.forEach(function(compra) {

                                            items={
                                                itemNum: compra.articulo,
                                                  whseCode:compra.bodega,
                                                  precio:compra.precio,
                                                  cantidad:compra.final
                                                  
                                            }
                                            listaItem.push(items);
                                            

                                    });

                                    console.log(listaItem);

                                      let datos={
                                                  proveedor:this.numeroProveedorAnahuac,
                                                  minimo:this.campraMinimoAnahuac,
                                                  total:this.montoAnahuac,
                                                  numerEmplead:numEmpleado,
                                                  articulo:listaItem
                                        
                                        };

                                        console.log(datos);

                                          //realizamos la colocacion
                                          const datosColocados =await reporteService.getColocarItems(datos) 
                                          const d=datosColocados.data;
                                          console.log("colocar.."+datosColocados.data);
                                          const poNum = datosColocados.data.data[2].poNum;
                                          console.log("poNum:", poNum);
                                          this.mensaje="La orden de compra "+poNum+" se genero con exito!";
                                          this.dialog2=true;
                                          
                                            

                                }
                                  else{

                                    this.mensaje="La compra actual no cubre el minimo de compra, minimo:"+this.campraMinimoAnahuac;
                                          this.dialog2=true;

                                  }
                          

                            }
                            else{
                              console.log("Debe seleccionar el proveedor para colocar!");
                              this.dialog5=true;
                            }

              }
                else{
                    if(bodega==='ceylan' ){


                                  const keys = Object.keys(this.proveedorCeylan);
                                  const tamaño = keys.length;
                                  console.log("numero de prov"+this.numeroProveedorCeylan);
                                  


                                  
                                              
                              if(tamaño>0&& this.numeroProveedorCeylan!==null&&this.numeroProveedorCeylan!==''){
                                  if(this.montoCeylan>this.campraMinimoCeylan)
                                    {
                                    var listaItem=[];
                                    var items={}
                                    this.compraCeylan.forEach(function(compra) {

                                                                  items={
                                                                        itemNum: compra.articulo,
                                                                        whseCode:compra.bodega,
                                                                        precio:compra.precio,
                                                                        cantidad:compra.final
                                                                       
                                                                  }
                                                                  listaItem.push(items);
                                                                  

                                                          });

                                                          console.log(listaItem);

                                                            let datos={
                                                                        proveedor:this.numeroProveedorCeylan,
                                                                        minimo:this.campraMinimoCeylan,
                                                                        total:this.montoCeylan,
                                                                        numerEmplead:numEmpleado,
                                                                        articulo:listaItem
                                                              
                                                              };



                                                              const datosColocados =await reporteService.getColocarItems(datos) 
                                                                    const d=datosColocados.data;
                                                                    console.log("colocar.."+datosColocados.data);
                                                                    const poNum = datosColocados.data.data[2].poNum;
                                                                    console.log("poNum:", poNum);
                                                                    this.mensaje="La orden de compra "+poNum+" se genero con exito!";
                                                                    this.dialog2=true; 


                                                                    console.log(datos);

                                                }else{

                                                    this.mensaje="La compra actual no cubre el minimo de compra, minimo:"+this.campraMinimoCeylan;
                                                    this.dialog2=true;
                                                }


                                    }
                                    else{
                              console.log("Debe seleccionar el proveedor para colocar!");
                              this.dialog5=true;
                            }


                }
           }

    },

    async getDatosOCMail(){

      let token = localStorage.getItem("jwtToken");
      const tokenParsed = JSON.parse(atob(token.split('.')[1]));  
      //const numEmpleado= tokenParsed.numEmpleado;
        
          let  datos ={
            numeroEmpleado:tokenParsed.numEmpleado,
                          };

                          let dat= await reporteService.getDatosMailOc(datos);              
            
            this.datosOcMail=dat.data.data;

            console.log("numero de empleado datos"+ datos.numeroEmpleado);
            console.log("-------------------s");
            console.log("data: "+ dat);
            this.dialog6=true;


    },async enviarMailOC(){
          this.datosOcMail
          let po_nums="";
          
          this.datosOcMail.forEach(function(occ) {
              if(occ.checkbox){
                po_nums += "_"+occ.oc;
              }
          });
         
          console.log(" oc "+po_nums);
          if(po_nums!=="")
          {
                let datos={
                  ordenDecompra: po_nums,
                }
                
                try {
                  this.loading3=true;
                    const  mensaje   = await reporteService.getEnviarCorreo(datos);
                  this.loading3=false;

                    this.mensaje=mensaje.data.data.respuesta;            
                } catch (error) {
                  this.mensaje="!Ocurrio un error¡";            
                }
              }else {
                this.mensaje="!Debe seleccionar una OC !";            
              }
         
          this.dialog2=true;

    },async selectClass(){


        if(this.toggle.length<9){

          this.toggle=[
            "'+'",
            "'1'",
            "'B'",
            "'C'",
            "'N'",
            "'L'",
            "'D'",
            "'O'",
            "'R'"
          ];
        }
        else{
          this.toggle=[
    
          ];
        }
        console.log("tamaños"+this.toggle.length);
        

    }
    

  },//finmedos

  components: {
    loader,
  },
  async mounted() {
  
    await this.getLineaNegocio();
    await this.getComprador();
    await this.getEmpleadoColocacion();
    //await this.getDatosOCMail();
  },
};
</script>

<template>
  <link
    href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900"
    rel="stylesheet"
  />
  <link
    href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css"
    rel="stylesheet"
  />
  <NuxtLayout name="default" style="margin-bottom: 0px">


    <template #componen>

    

      <v-btn @click="getDatosOCMail()" color="red-dark-4">
        <v-icon icon="mdi-email" size="25px" color="red lighten-3"></v-icon>

      </v-btn>


    <v-dialog
                              v-model="dialog6"
                              width=35% persistent
                              scrollable
                                    >
                                      <v-card title="Envio mail OC.">
                                        

                                          <v-card-text>
                                          

                                              <table table id="example" class="display" style="width:100%">
                                                  <thead>
                                                    <th>Comprador</th>
                                                    <th>OC</th>
                                                    <th>Fecha</th>
                                                    <th>Enviar</th>
                                                  </thead>
                                                  <tbody  class="estilo">
                                                    <tr v-for="row in datosOcMail" class="border_bottom">

                                                      <td>{{ row.comprador}}</td>
                                                      <td>{{ row.oc}}</td>
                                                      <td>{{ row.fecha}}</td>
                                                      <td v-if="row.status==='3' &&  row.status!=='Y'" >
                                                        <input type="checkbox" id="cbox" v-model="row.checkbox"/>
                                                        </td>
                                                      <td v-else>
                                                        {{row.status}}                                                  
                                                          
                                                      </td>

                                                      

                      
                                                    </tr>

                                                  </tbody>
                                              </table>


                                             


                                            </v-card-text>

                                          
                                          <v-card-actions>
                                          <v-spacer></v-spacer>
                                          <v-btn
                                            :loading="loading3"
                                            :disabled="loading3"
                                            text="Enviar"
                                            variant="text"
                                            @click="enviarMailOC()"
                                          ></v-btn>

                                          <v-btn
                                            text="Cerrar"
                                            variant="text"
                                            @click="dialog6 = false"
                                          ></v-btn>
                                        </v-card-actions>
                                      </v-card>

                            <v-dialog
                              v-model="dialog2"
                              width="auto"
                              v-bind="activatorProps"
                                    >
                                      <v-card title="">

                                            <v-card-text>
                                              {{mensaje}}
                                            </v-card-text>
                                            <v-card-text>
                                            
                                            </v-card-text>
                                            


                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                            
                                            <br>

                                          <v-btn
                                            text="Cerrar"
                                            variant="text"
                                            @click="dialog2 = false"
                                          ></v-btn>
                                        </v-card-actions>
                                      </v-card>
                        </v-dialog>


              </v-dialog>
      

    </template>
    <template #body>
      <v-card class="my-4 content">
        <v-card-title class="bg-grey-darken-3 d-flex align-center">
          <v-icon icon="mdi-hand-coin" size="large"></v-icon>
          <div class="text-h7 pa-2 content">Reporte de Requerimientos</div>
        </v-card-title>
      </v-card>
    </template>
  </NuxtLayout>

  <div text="" color="white" style="margin-left: 2%;margin-right: 2%">
    <v-row
        class="py-0"
        cols="1"
        sm="11"
        >
      <v-col
      x-small
      
        >
        <v-autocomplete
          v-model="lineaNegocioSelected"
          :items="lineaNegocio"
          :item-title="'linea'"
          :item-value="'clave'"
          name="lineaNegocioSelected"
          label="LINEA DE NEGOCIO"
          clearable
          density="compact"
          x-small
          
          
        >
        </v-autocomplete>
      </v-col>

      <v-col >
        <v-autocomplete
          v-model="compradorSelected"
          :items="comprador"
          :item-title="'nombreComprador'"
          :item-value="'claveComprador'"
          name="compradorSelected"
          label="COMPRADOR"
          clearable
          density="compact"
        >
        </v-autocomplete>
      </v-col>

      <v-col>
        <v-text-field
          v-model="articuloSelected"
          label="ARTICULO"
          
          density="compact"
        ></v-text-field>
      </v-col>

      <v-col 
      density="compact">
        <v-text-field
          v-model="proveedorSelected"
          label="PROVEEDOR"
          style=""
          density="compact"
        ></v-text-field>
      </v-col>

      <v-col>
        <v-select
          v-model="almacenSelected"
          :items="almacen"
          :item-title="'almacen'"
          :item-value="'codigo'"
          name="almacenSelected"
          label="ALMACEN"
          dense
          clearable
          density="compact"
        >
        </v-select>
      </v-col>
      
      <v-col >
        <v-select
          v-model="bodegaSelected"
          :items="bodega"
          :item-title="'bodega'"
          :item-value="'codigo'"
          name="bodegaSelected"
          label="BODEGA"
          dense
          clearable
          density="compact"
          
        >
        </v-select>
      </v-col>

      <v-col>
        <v-autocomplete
        
        v-model="colocacionSelected"
          :items="colocacion"
          :item-title="'nombre'"
          :item-value="'numeroEmpleado'"
          name="colocacionSelected"
          label="COLOCACION"
          dense
          filled
          clearable
          density="compact"
        >
        
      </v-autocomplete>
      
      
      </v-col>

    </v-row>

    <div>
    
    

      <v-dialog
                              v-model="dialog2"
                              width="auto"
                              v-bind="activatorProps"
                                    >
                                      <v-card title="">

                                            <v-card-text>
                                              {{mensaje}}
                                            </v-card-text>
                                            <v-card-text>
                                            
                                            </v-card-text>
                                            


                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                            
                                            <br>

                                          <v-btn
                                            text="Cerrar"
                                            variant="text"
                                            @click="dialog2 = false"
                                          ></v-btn>
                                        </v-card-actions>
                                      </v-card>
                        </v-dialog>


    <!-- botones de las clases -->

  
    <div class="d-flex align-center flex-column justify-center">
<div >
    <v-btn-toggle
      v-model="toggle"
      multiple
      color="blue"
      divided
      mandatory
      shaped
      variant="outlined"
      
    >
      <v-btn  value="'+'">+</v-btn>
      <v-btn  value="'1'">1</v-btn>
      <v-btn  value="'B'">B</v-btn>
      <v-btn  value="'C'">C</v-btn>
      <v-btn  value="'N'">N</v-btn>
      <v-btn  value="'L'">L</v-btn>
      <v-btn  value="'D'">d</v-btn>
      <v-btn  value="'O'">o</v-btn>
      <v-btn  value="'R'">r</v-btn>
      
    </v-btn-toggle>

    <v-btn  v-model="toggle_exclusive" @click="selectClass()">todos</v-btn> 
  </div>
</div>
</div>

  






    <!--fin botones de clasificacion-->


    <div class="d-flex justify-center mb-6" height="48" variant="tonal">
      <v-btn @click="buscarInfo()" style="background-color: #212121">
        <v-icon icon="mdi-magnify" size="large" style="color: white"></v-icon
      ></v-btn>
    </div>
    <loader v-if="isLoading" />
    <!--  v-if="itemsCollection.length > 0 && isLoading == false" -->
    <div v-if="itemsCollection.length > 0 && isLoading == false">







      <v-row style="margin-bottom: 30px">
        <v-card
          class="mx-auto mt-5"
          width="40%"
          height="max-content"
          min-height="50px"
        >
          <v-row>
            <v-card
              class="mt-3 mx-auto"
              style="
                background-color: #ffbb33;
                width: 35%;
                text-align: center;
                padding-top: 3%;
                float: left;
              "
            >
              AN&Aacute;HUAC
            </v-card>
            <table width="50%" class="mr-5 mt-3 mx-auto">
              <tr>
                <th>Inventario Actual</th>
                <th>Colocar</th>
              </tr>
              <tr>
                <td align="right">
                  <center>
                    <div>{{ totalAna }}</div>
                  </center>
                </td>
                <td align="right">
                  <center>
                    <div>{{ anaOc }}</div>
                  </center>
                </td>
              </tr>
            </table>
          </v-row>
        </v-card>
        <v-card
          class="mx-auto mt-5"
          width="40%"
          height="max-content"
          min-height="50px"
          min-width="40%"
        >
          <v-row>
            <v-card
              class="mt-3 mx-auto"
              style="
                background-color: #00c851;
                width: 35%;
                text-align: center;
                padding-top: 3%;
              "
            >
              CEYLAN
            </v-card>
            <table width="50%" class="mr-5 mt-3 mx-auto">
              <tr>
                <th>Inventario Actual</th>
                <th>Colocar</th>
              </tr>
              <tr>
                <td align="right">
                  <center>{{ totalCey }}</center>
                </td>
                <td align="right">
                  <center>{{ ceyOc }}</center>
                </td>
              </tr>
            </table>
          </v-row>
        </v-card>
      </v-row>

      <v-row>
        <v-btn
          @click="generarExcel()"
          class="btn1"
          style="background-color: #39c769"
          >Excel</v-btn
        >
        <v-btn
          @click="copiarInfo()"
          class="btn1"
          style="background-color: #3f7bdf"
          >Copiar</v-btn
        >
        <v-btn
          @click="showCompra()"
          class="btn1"
          style="background-color: #e53040"
          >Comprar</v-btn
        >
        <!-- <div float="right">
          <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details style="float:right"></v-text-field>

        </div> -->
      </v-row>
      <!--TABLAAAAAAAAAAA-->

      <v-card class="mx-auto mt-5" max-width="100%">
        <!-- <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field> -->



        <!-- tabla add-->

          

        <!---fin tabla de prueba-->




        <!-- tabla-->

<!--tabla-->





  <div>
    <v-data-table
      :headers="headers2"
      :items="desserts"
      hide-actions
      :pagination.sync="pagination"
      class="elevation-1"
    >
      <template v-slot:items="props">

      </template>
    </v-data-table>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
  </div>




        <v-data-table :items="infoBusqueda" :search="search" id="infoTabla"
      hide-actions
          
          fixed-header
          height="350px"
          
        >
          <thead>
            <td
              colspan="16"
              style="background-color: #4b515d"
              class="encabezado"
            >
              Productos
            </td>
            <td
              colspan="6"
              style="background-color: #f44336"
              class="encabezado"
            >
              Almac&eacute;n
            </td>
            <td
              colspan="7"
              style="background-color: #4caf50"
              class="encabezado"
            >
              Ventas
            </td>
            <td
              colspan="7"
              style="background-color: #0000ff"
              class="encabezado"
            >
              Etiquetado
            </td>
            <td
              colspan="2"
              style="background-color: #795548"
              class="encabezado"
            >
              Log&iacute;stica
            </td>
            <td
              colspan="10"
              style="background-color: #f5c211"
              class="encabezado"
            >
              Colocaci&oacute;
            </td>
            <td
              colspan="6"
              style="background-color: #673ab7"
              class="encabezado"
            >
              Traspasos
            </td>
          </thead>
          
          <thead>
            <tr>
              <th v-for="h in headers" :style="h.style">
                <span class="letra">{{ h.title }}</span>
              </th>
            </tr>
          </thead>

          
          <!--modificar-->
          
          <tr v-for="(row, index) in infoBusqueda" :key="index" :class="{ 'row-even': index % 2 === 0, 'row-odd': index % 2 !== 0 }">
            <td >
              <label v-if="row.whseCode == '01' || row.whseCode == '02'"
                >ANÁHUAC</label
              >
              <label v-else>CEYLAN</label>
            </td>
            
            <td >{{ row.comprador }}</td>
            <td >{{ row.lineaNegocio }}</td>
            <td >{{ row.itemNum }}</td>
            <td >{{ row.descripcion }}</td>
            <td >{{ row.claveprov }}</td>

            <td>{{ row.upc }}</td>
            <td>{{ row.vendorNum }}</td>
            <td>{{ row.abcClass }}</td>
            <td>{{ row.rank }}</td>
            <td>{{ row.pallet }}</td>
            <td>{{ row.mlt }}</td>
            <td>{{ formatoMoneda(row.ultCto) }}</td>
            <td>{{ formatoMoneda(row.ctoPromedio) }}</td>
            <td>{{ formatoMoneda(row.ctoVenta )}}</td>
            <td>{{ row.costo_prot }}</td>
            <!--ALMACEN-->
            <td :class="{ 'row-oddalmacen': index % 2 === 0 }">{{ row.reservado }}</td>
            <td :class="{  'row-oddalmacen': index % 2 === 0 }">{{ row.existencia }}</td>
            <td  :class="{ 'row-oddalmacen': index % 2 === 0 }">{{ row.diasInventario}}</td>
            <td  :class="{ 'row-oddalmacen': index % 2 === 0 }">{{ row.diasInventario }}</td>
            <td :class="{  'row-oddalmacen': index % 2 === 0 }">{{ formatoMoneda(row.inventarioProm )}}</td>
            <td :class="{ 'row-oddalmacen': index % 2 === 0 }">{{ row.diasSinInventario }}</td>
            <!--VENTAS-->
            <td :class="{ 'row-oddventa': index % 2 === 0 }" >{{ formatoMoneda(row.ventaPromedio )}}</td>
            <td :class="{ 'row-oddventa': index % 2 === 0 }">{{ formatoMoneda(row.ventaPromedioHabil) }}</td>
            <td :class="{ 'row-oddventa': index % 2 === 0 }">{{ formatoMoneda(row.ventaPromedio365) }}</td>
            <td :class="{ 'row-oddventa': index % 2 === 0 }">{{ row.picos2 }}</td>
            <td :class="{ 'row-oddventa': index % 2 === 0 }">{{ row.piezasOC }}</td>
            <td :class="{ 'row-oddventa': index % 2 === 0 }">{{ row.clientes }}</td>
            <td :class="{ 'row-oddventa': index % 2 === 0 }">{{ row.clientesOperadora }}</td>
            <!--ETIQYUETAD-->
            <td :class="{ 'row-oddetiquetado': index % 2 === 0 }">{{ row.diasMinimo }}</td>
            <td :class="{ 'row-oddetiquetado': index % 2 === 0 }">{{ row.diasMaximo }}</td>
            <td :class="{ 'row-oddetiquetado': index % 2 === 0 }">{{ row.pzasMinimo }}</td>
            <td :class="{ 'row-oddetiquetado': index % 2 === 0 }">{{ row.pzasMaximo }}</td>
            <td :class="{ 'row-oddetiquetado': index % 2 === 0 }">
              <label v-if="row.enBodega == 'S'">Si</label>
              <label v-else>No</label>
            </td>
            <td :class="{ 'row-oddetiquetado': index % 2 === 0 }">
              <label v-if="row.enTraspaso == 'S'">Si</label>
              <label v-else>No</label>
            </td>
            <td :class="{ 'row-oddetiquetado': index % 2 === 0 }">{{ row.ulFechaEtiquetado }}</td>
            <!--LOGISTICA-->
            <td :class="{ 'row-oddlogistica': index % 2 === 0 }">{{ row.maxLogistica }}</td>
            <td :class="{ 'row-oddlogistica': index % 2 === 0 }">{{ row.excedente }}</td>
            <!--COLOCACION-->
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{ row.diasColocacion }}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{ row.fechaOC }}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{ row.xrecOc }}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{ row.fillRate }}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{ formatoMoneda(row.fillRate2 )}}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{ row.teprov }}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{ row.sugeridoOC }}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">{{formatoMoneda(row.diasInventarioOC) }}</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">*</td>
            <td :class="{ 'row-oddcolocacion': index % 2 === 0 }">
              <input type="checkbox" id="cbox" v-model="row.seleccionChec" />
            </td>
            <!--TRASPASOS-->
            <td :class="{ 'row-oddtraspaso': index % 2 === 0 }">{{ row.fechaTraspaso }}</td>
            <td :class="{ 'row-oddtraspaso': index % 2 === 0 }">{{ row.xrecTRP }}</td>
            <td :class="{ 'row-oddtraspaso': index % 2 === 0 }">*</td>
            <td :class="{ 'row-oddtraspaso': index % 2 === 0 }">*</td>
            <td :class="{ 'row-oddtraspaso': index % 2 === 0 }">*</td>
            <td :class="{ 'row-oddtraspaso': index % 2 === 0 }">*</td>
          </tr>
        
        </v-data-table>
      </v-card>
    </div>


    <!--COMPRAR-->




    <v-lazy transition="fade-transition">
      <v-dialog v-model="verComprar" width="80%" persistent>
        <v-card>

          <!--alertas -->




       


          <v-dialog
                              v-model="dialog3"
                              width="auto"
                                    >
                                      <v-card title="No se recomiendan compras a mas de 60 DI!">
                                        <v-card-actions>
                                          <v-spacer></v-spacer>

                                          <v-btn
                                            text="Close"
                                            variant="text"
                                            @click="dialog3 = false"
                                          ></v-btn>
                                        </v-card-actions>
                                      </v-card>
                        </v-dialog>


                      <v-dialog
                              v-model="dialog5"
                              width="auto"
                                    >
                                      <v-card title="Debe seleccionar el proveedor para colocar!">
                                        <v-card-actions>
                                          <v-spacer></v-spacer>

                                          <v-btn
                                            text="Close"
                                            variant="text"
                                            @click="dialog5 = false"
                                          ></v-btn>
                                        </v-card-actions>
                                      </v-card>
                        </v-dialog>
                        

                        <!--dialo que se muestra en caso de ingresar la clave del proveedor  que no existe -->
                      <v-dialog
                              v-model="dialog4"
                              width="auto"
                                    >
                                      <v-card title="El proveedor es Incorrecto favor de validar!">
                                        <v-card-actions>
                                          <v-spacer></v-spacer>

                                          <v-btn
                                            text="Cerrar"
                                            variant="text"
                                            @click="dialog4 = false"
                                          ></v-btn>
                                        </v-card-actions>
                                      </v-card>
                        </v-dialog>

                        <v-dialog
                              v-model="dialog2"
                              width="auto"
                              v-bind="activatorProps"
                                    >
                                      <v-card title="">

                                            <v-card-text>
                                              {{mensaje}}
                                            </v-card-text>
                                            <v-card-text>
                                            
                                            </v-card-text>
                                            


                                        <v-card-actions>
                                          <v-spacer></v-spacer>
                                            
                                            <br>

                                          <v-btn
                                            text="Cerrar"
                                            variant="text"
                                            @click="dialog2 = false"
                                          ></v-btn>
                                        </v-card-actions>
                                      </v-card>
                        </v-dialog>






          <!--fin alertas -->

          <div class="modal-header">
            <h3>DETALLE COLOCACI&Oacute;N</h3>
            <v-icon
              icon="mdi-close"
              @click="cerrarCompra"
              style="float: right"
            ></v-icon>
          </div>
          <v-card-text>
            <div
              id="modalLayout"
              tabindex="-1"
              role="dialog"
              aria-labelledby="modalLayout"
              aria-hidden="true"
            >
              <div role="document">
                <div id="com">
                  <div class="modal-body" style="min-width: 400px">
                    <div v-if="compraAnahuac.length > 0">
                      <table width="100%">
                        <thead>
                          <td
                            colspan="16"
                            style="
                              background-color: #4b515d;
                              text-align: center;
                            "
                            class="encabezado"
                          >
                            AN&Aacute;HUAC
                          </td>
                        </thead>
                        <thead>
                          <tr>
                            <th
                              v-for="h in tablaCompras"
                              style="background-color: #4b515d"
                            >
                              <span class="letra">{{ h }}</span>
                            </th>
                          </tr>
                        </thead>
                        <tr v-for="row in compraAnahuac" class="border_bottom">
                          <td>{{ row.articulo }}</td>
                          <td>{{ row.pallet }}</td>
                          <td>{{ row.multiplo }}</td>
                          <td>{{ row.bodega }}</td>
                          <td>{{ row.vp }}</td>
                          <td>{{ row.precio }}</td>
                          <td>{{ row.sug }}</td>
                          <td width="10%">
                            
                            <input
                            v-on:keyup="calculaDi(row, 'ANAHUAC')"
                            v-model="row.final" 
                              type="number"
                              style="
                                border: 0.5px solid #f2f2f2;
                                border-radius: 5px;
                                width: 60%;
                                text-align: right;
                              "
                              
                              :id="'ana' + row.num"
                              
                            />
                          </td>

                          <td>{{ formatoMoneda(row.di) }}</td>
                  
                        </tr>
                        
                      
                      </table>

                      
                        

  

                      <br />
                      <v-spacer class="mt-5"></v-spacer>
                      <v-row>
                        <v-icon icon="mdi-account" size="large"></v-icon>
                        <!-- regresar -->

                        <input
                          v-model="numeroProveedorAnahuac"
                          v-on:keyup="getDatosProveedorAnahuac()"
                          
                          class="inp"
                          type="text"
                          placeholder="No."
                          style="width: 5%"
                        />
                        <input
                        v-model="razonSocialAnahuac"
                          class="inp"
                          type="text"
                          placeholder="Razon Social"
                          style="width: 25%"
                        />
                        <v-icon icon="mdi-currency-usd" size="large"></v-icon>
                        <input
                          v-model="campraMinimoAnahuac"
                          class="inp"
                          type="text"
                          placeholder="Minimo de Compra"
                        />
                        <v-icon icon="mdi-cash" size="large"></v-icon>
                        <input 
                         v-model="montoAnahuac"
                        class="inp" type="text" placeholder="Monto" />
                        <label id="msgError"></label>
                      </v-row>
                      <br />
                      <v-btn
                        @click="getColocarItems('anahuac')"
                        style="background-color: #ffbb33; color: white"
                        >COLOCAR AN&Aacute;HUAC</v-btn
                      >
                      <br /><v-spacer class="mt-5"></v-spacer>
                    </div>
                    <div v-if="compraCeylan.length > 0">
                      <table width="100%">
                        <thead>
                          <td
                            colspan="16"
                            style="
                              background-color: #4b515d;
                              text-align: center;
                            "
                            class="encabezado"
                          >
                            CEYLAN
                          </td>
                        </thead>
                        <thead>
                          <tr>
                            <th
                              v-for="h in tablaCompras"
                              style="background-color: #4b515d"
                            >
                              <span class="letra">{{ h }}</span>
                            </th>
                          </tr>
                        </thead>
                        <tr v-for="row in compraCeylan" class="border_bottom">
                          <td>{{ row.articulo }}</td>
                          <td>{{ row.pallet }}</td>
                          <td>{{ row.multiplo }}</td>
                          <td>{{ row.bodega }}</td>
                          <td>{{ row.vp }}</td>
                          <td>{{ row.precio }}</td>
                          <td>{{ row.sug }}</td>
                          <td width="10%">
                            <input
                            v-on:keyup="calculaDi(row, 'CEYLAN')"
                            v-model="row.final" 
                              type="number"
                              style="
                                border: 0.5px solid #f2f2f2;
                                border-radius: 5px;
                                width: 60%;
                                text-align: right;
                              "
                              :id="'cey' + row.num"
                              
                              @onkeypress="calculaDi(row, 'CEYLAN')"
                            />
                          </td>
                          <td>{{ formatoMoneda(row.di) }}</td>
                          
                        </tr>
                      </table>
                      <br />
                      <v-spacer class="mt-5"></v-spacer>
                      <v-row>
                        <input
                        v-model="numeroProveedorCeylan"
                        v-on:keyup="getDatosProveedorCeylan()"
                          class="inp"
                          type="text"
                          placeholder="No."
                          style="width: 60px"
                        />
                        <input
                          v-model ="razonSocialCeylan"
                          class="inp"
                          type="text"
                          placeholder="Razon Social"
                        />
                        <input
                        v-model="campraMinimoCeylan"
                          class="inp"
                          type="text"
                          placeholder="Minimo de Compra"
                        />
                        <input
                        
                        v-model="montoCeylan"
                         class="inp" type="text" placeholder="Monto" />
                      </v-row>
                      <br />
                      <v-btn
                        @click="getColocarItems('ceylan')"
                        style="background-color: #00c851; color: white"
                        >COLOCAR CEYLAN</v-btn
                      >
                      <br />
                    </div>
                    <div v-if="compraCeylan.length == 0 && compraAnahuac == 0">
                      <br />
                      <strong style="color: #e53040">
                        <center>NO EXISTEN DATOS PARA COLOCAR OC'S.</center>
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-lazy>
  </div>
</template>





<style>
#infoTabla, thead th tr{
  border : 1px solid black;
}
.content {
  width: 97%;
  height: 100%;
  margin: 0 auto;
  border-radius: 10px;
}
.encabezado {
  font-weight: bold;
  color: white;
  padding-left: 10px;
}
.letra {
  color: white;
}
tr.border_bottom td {
  border-bottom: 0.5px solid grey;
  text-align: center;
}
.btn1 {
  color: white;
  margin-left: 20px;
}
.inp {
  border: 0.5px solid #f2f2f2;
  border-radius: 5px;
  margin-left: 10px;
}
.modal-header {
  padding: 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 0.5px solid rgb(172, 171, 171);
}

.border_bottom tr:nth-child(odd) {
  background-color: #ff33cc;
}



.row-even {
  background-color:  rgba(0, 0, 0, 0.07);

}

 .row-oddalmacen {
  background-color:  rgb(255, 205, 210);
}

.row-oddventa {
  background-color:  rgb(200, 230, 201);
}

.row-oddetiquetado {
  background-color:  rgb(197, 202, 233);
}
.row-oddlogistica {
  background-color:  rgb(215, 204, 200);
}
.row-oddcolocacion {
  background-color:  rgba(255, 249, 196,0.9);
}

.row-oddtraspaso {
  background-color:  rgb(209, 196, 233)
}




.pagination {
  margin-top: 10px;
}

.pagination button {
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
  margin: 0 5px;
}

.pagination button[disabled] {
  background-color: #ddd;
  color: black;
  cursor: not-allowed;
}

.export-buttons {
  margin-bottom: 10px;
}

.export-buttons button {
  background-color: #008CBA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 10px 20px;
  margin-right: 10px;
}

.search {
  margin-bottom: 10px;
}

.search label {
  margin-right: 5px;
}


</style>
<script setup>
definePageMeta({
  layout: false,
  middleware: [
    function (to, from) {
      const isAuth = AuthService.isTokenValid();
      if (!isAuth) {
        return navigateTo("/compras/mantenimientos/busquedas/login");
      }
    },
  ],
});
</script>
