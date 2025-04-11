<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  feedback: {
    type: Object,
    required: true
  }
});


</script>

<template>
  <div class="feedback-container">
    <h3>Results</h3>
    <div class="score">
      Score: {{ feedback.score }} / {{ feedback.totalPossible }}
      ({{ feedback.percentage }}%)
    </div>

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


</style>