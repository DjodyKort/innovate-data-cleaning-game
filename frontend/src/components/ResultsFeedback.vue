<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  feedback: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['continue']);

function handleContinue() {
  emit('continue');
}
</script>

<template>
  <div class="feedback-container">
    <h3>Results</h3>
    <div class="score">
      Score: {{ feedback.score }} / {{ feedback.totalPossible }}
      ({{ feedback.percentage }}%)
    </div>
    <button @click="handleContinue" class="continue-btn">Continue to Next Challenge</button>
  </div>
</template>

<style scoped>
.feedback-container {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  margin-top: 20px;
  background-color: #f9f9f9;
}

.score {
  font-size: 24px;
  margin-bottom: 20px;
}

.continue-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.continue-btn:hover {
  background-color: #45a049;
}
</style>