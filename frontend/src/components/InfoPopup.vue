<script setup>
import { ref,defineProps,} from 'vue';

const props = defineProps({
  description: {
    type: String,
    required: true
  }
});

const isOpen = ref(false);

function togglePopup() {
  isOpen.value = !isOpen.value;
}

function closePopup() {
  isOpen.value = false;
}
</script>

<template>
  <div class="info-popup-container">
    <div class="info-icon" @click="togglePopup" title="Meer informatie">
      <img src="../assets/info.svg" alt="info icon" class="info-svg" />
    </div>

    
    <div v-if="isOpen" class="popup-content">
      <div class="popup-header">
        <span @click="closePopup" class="close-btn">&times;</span>
      </div>
      <div class="popup-body" v-html="description">
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-popup-container {
  position: relative;
  display: inline-block;
}

img{
  width: 57.5%;
  /* height: 20px; */
}

img:hover{
  cursor: pointer;
}

.popup-content {
  position: absolute;
  right: -10px;
  top: 30px;
  background-color: white;
  min-width: 300px;
  max-width: 400px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 100;
  padding: 15px;
  text-align: left;
}

.popup-header {
  display: flex;
  justify-content: flex-end;
}

.close-btn {
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
}

.popup-body {
  margin-top: 5px;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
}
</style>