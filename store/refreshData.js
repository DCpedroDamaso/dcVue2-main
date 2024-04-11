import { defineStore } from 'pinia'

export const useRefreshData = defineStore({
  //nombre del gestor
    id: 'refresh-data',
    state: () => {
      //estado inicial
      return {
        refresHome: 1,
      }
    },
    //Son los metos quue puede modifcar mi estado
    actions: {
      changeRefreshHome(value) {
        this.refresHome = this.refresHome+1
      },
    },
    //aqui se pone que es lo que se va a sacar para consumir
    getters: {
        refreshHome: state => state.refresHome,
    },
  })
  