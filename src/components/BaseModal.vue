<template>
  <!-- .self: modal-overlay 자체를 클릭해야만 close 실행 -->
  <div v-if="visible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <slot name="diet" />
          <button class="close-btn" @click="close">X</button>
    </div>
   
  </div>

</template>

<script setup>
import { useFoodStore } from '@/stores/food/foodStore';
import { storeToRefs } from 'pinia';
import { defineEmits, defineProps, toRefs } from 'vue'

const props = defineProps({
  visible: Boolean
})

const { visible } = toRefs(props);
const emits = defineEmits(['update:visible']);
const foodStore = useFoodStore();
const {inputPastDate}  = storeToRefs(foodStore);

const close = () => {
  emits('update:visible', false);
  inputPastDate.value = "";
}
</script>

<style scoped lang="scss">
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  // z-index: 999;
  
  .modal-content {
    background: white;
    color: black;
    width:80vw;
    height: 70vh;
    padding: 20px;
    border-radius: 8px;
  }
  .close-btn{
    background-color: white;
    border: none;
    cursor: pointer;
  }
}

</style>
