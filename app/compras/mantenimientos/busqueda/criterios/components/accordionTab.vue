<script>

export default {
    props: {
        header : String,
        id: String,
        position: Number,
        hasChild: {
            type: Boolean,
            default: true
        }
    },
    emits: ['on-toggle','change-prioridad'],
    watch: {

    },
    data() {
        return{
            isTabActive: false,
        }
    }, 
    methods:{
        handleEnable(){
            this.$emit('on-toggle',{id:this.id});
        },
    }
}
</script>

<template>
    <div class="card">

        <!-- Card header -->
        <div class="card-header" role="tab" :id="id" style="display:flex;">
             
            <input style="opacity:1;pointer-events: auto;left: 5px;top: 20px;" 
                type="checkbox" v-model="isTabActive" @change="handleEnable"/>

            <input type="text" style="width:40px;height:30px;" disabled maxlength="1" size="1" class="form-control" :value="position+1">
            
            <a class="collapsed mx-1" data-toggle="collapse" 
                data-parent="#accordionCriterios" :href="`#collapseMarcas${id}`"
                aria-expanded="false" :aria-controls="`collapseMarcas${id}`"
                >
                <h5 style="text-align:right;display:flex;flex-wrap:nowrap;" class="mb-0">
                    {{ header }}
                    <i v-if="hasChild" class="fas fa-angle-down rotate-icon" style="margin:0px 10px;"></i>
                </h5>
            </a>
        </div>

        <!-- Card body -->
        <div v-if="hasChild" :id="`collapseMarcas${id}`" class="collapse" role="tabpanel" :aria-labelledby="id"
            data-parent="#accordionCriterios">
            <div class="card-body">
                <slot :shouldWork="isTabActive"></slot>
            </div>
        </div>

    </div>
</template>