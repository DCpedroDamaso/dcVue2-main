<script>
    export default{
        props: {
            nivel: Number,
            titleTooltip: String,
            isDisabled:Boolean,
        },
        data() {
            return {
                btnClass : 'btn-outline-danger',
            }
	    },
        mounted() {
            if(this.nivel){
                this.btnClass = this.getClassBtn(this.nivel);  
            }
        },
        emits: ["on-click"],
        methods:{
            handleClick(){
                this.$emit('on-click')
            },
            getClassBtn(nivel){
                return '' + this.getColor(nivel)
            },
            getColor(nivel){
                switch(nivel){
                    case 1:
                        return 'red'
                    case 2:
                        return 'success'
                    case 3:
                        return 'primary'
                    case 4: 
                        return 'blue-grey'
                    default:
                        return 'danger'
                    }
            },
        }
    }
</script>

<template>

    <v-btn
        class="ma-1"
            rounded="0" 
            variant="outlined" 
			:color=" nivel == 0  ? 'red' : nivel == 1 ? 'amber-darken-2' : 'green'"
            @click="handleClick()" 
            data-toggle="tooltip" 
            data-placement="top" 
            :title="titleTooltip"
            :disabled="isDisabled"
        >
        <slot ></slot>
    </v-btn>
    {{ console.log(isDisabled) }}
</template>

<style>
</style>