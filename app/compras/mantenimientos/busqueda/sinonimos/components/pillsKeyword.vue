<script>
export default {
    name:'pillKeyword',
    emits: ["on-click"],
    methods: {
        handleClick(){
            this.$emit('on-click', this.palabra);
        }
    },
    props:{
        palabra: String,
        palabraSelect: String
    }
}
</script>

<template>

        <!-- <a class="" @click="handleClick" :class="{'active' : palabra===palabraSelect}"> -->
            <v-radio @click="handleClick" class="" color="yellow-darken-1">
                <template v-slot:label>
          <div class="text-h5" > {{ palabra }}</div>
        </template>
    </v-radio>
        <!-- </a> -->

</template>