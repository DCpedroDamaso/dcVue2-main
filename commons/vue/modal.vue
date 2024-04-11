<script>
export default {
  props: {
    isOpen: Boolean
  },
  emits: ['on-close'],
  methods: {
    onClose() {
      this.$emit('on-close', true);
    }
  }
}
</script>

<template>

  <Teleport  to="body">

    <div v-if="isOpen" class="overlay" @click="onClose">
      <div class="modal-custom" @click.stop>

        <div class="modal-header">
          
          <slot name="header"></slot>
          <v-icon icon="mdi-close" @click="onClose"></v-icon>
        </div>

        <div class="modal-body">
          <slot name="content"></slot>
        </div>

      </div>
    </div>

  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.772);
  z-index: 5;
  display: flex;
  justify-content: center;
  padding: 10% 0px;
  cursor: pointer;
}


.modal-custom {
  z-index: 5;
  flex-grow: 0.5;
  display: flex;
  flex-direction: column;
  cursor: default;
  border-radius: 1%;
}

.modal-header{
  display: flex;
  justify-content:space-between;
  align-items: center;
  background-color: rgb(29, 147, 197);
}

.close-modal{
  cursor: pointer;
  font-size: larger;
}

.modal-body{
  overflow: auto;
}

</style>