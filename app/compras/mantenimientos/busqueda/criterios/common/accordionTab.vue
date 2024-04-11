<script>


export default {
    props: {
        header : String,
        id: String,
        position: Number,
        hasChild: {
            type: Boolean,
            default: true
        },
        isActive:Boolean
    },
    emits: ['on-toggle','change-prioridad'],
    watch: {

    },
    data() {
        return{
            isTabActive: false,
            isEnable:false,
        }
    }, 
    methods:{
        handleEnable(){
            this.$emit('on-toggle',{id:this.id});
        },
        toggleActive(){
            this.isEnable=!this.isEnable
        }
    },
    mounted(){
        this.isTabActive=this.isActive
        this.isEnable=this.isActive

    }   
    
}
</script>

<template>
    <v-card class="card pb-2 pt-2 rounded-0" elevation="0" style="border-bottom: 1px solid rgba(103, 103, 103, 0.611);">

        <!-- Card header -->
        <div class="card-header" role="tab" :id="id" style="display:flex;">
             
            <input style="opacity:1;pointer-events: auto;left: 5px;top: 20px;" 
                type="checkbox" v-model="isTabActive" @change="handleEnable"/>

            <input type="text" style="width:20px;height:30px;" disabled maxlength="1" size="1" class="form-control" :value="position+1">
            
            <div class="text-h6 mb-0 text-blue" style="" data-toggle="collapse" 
                data-parent="#accordionCriterios"
                aria-expanded="false" :aria-controls="`collapseMarcas${id}`"
                @click="toggleActive"
                >

                <!-- <h5 style="text-align:right;display:flex;flex-wrap:nowrap;" class=""> -->
                    {{ header }}
                    <v-icon v-if="hasChild" icon="mdi-chevron-left" :class="['icon', {'rotate': isEnable}]" color="blue"></v-icon>
                <!-- </h5> -->
                </div>
        </div>

        <!-- Card body -->
        <transition name="slide-down">
        <v-card elevation="0" v-if="hasChild && isEnable" :id="`collapseMarcas${id}`" style="font-size: 15px;" role="tabpanel" :aria-labelledby="id"
            data-parent="#accordionCriterios" class="list-container rounded-0">
            <div elevation="0" class="ml-2 rounded-0">
                <slot :shouldWork="isTabActive"></slot>
            </div>
        </v-card>
        </transition>
    </v-card>
</template>

<style>
.family-container {
  cursor: pointer;
}
.icon {
  display: inline-block;
  transition: transform 0.3s;

}

.rotate {
  transform: rotate(-90deg);
}

</style>