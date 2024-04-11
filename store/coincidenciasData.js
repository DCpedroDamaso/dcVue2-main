import { defineStore } from 'pinia'

export const useCoincidenciasData = defineStore({
    id: 'coincidencias-data',
    state: () => {
      return {
        countKeywords: 0,
        countSinonimos: 0,
        countMatchmultiples: 0,
      }
    },
    actions: {
      incrementCountKeywords() {
        this.countKeywords++;
      },
      incrementCountSinonimos(){
        this.countSinonimos++;
      },
      incrementCountMatchmultiples(){
        this.countMatchmultiples++;
      },
      resetCounts() {
        this.countKeywords=0;
        this.countSinonimos=0;
        this.countMatchmultiples=0;
      }
    },
    getters: {
        refreshHome: state => state.refresHome,
    },
  })
  