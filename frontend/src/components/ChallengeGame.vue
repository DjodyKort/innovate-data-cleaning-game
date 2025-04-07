<script setup>
import { defineProps, defineEmits } from 'vue';
import DataColumn from './DataColumn.vue';
import ResultsFeedback from './ResultsFeedback.vue';

defineProps({
  currentChallenge: {
    type: Object,
    required: true
  },
  userCleanedData: {
    type: Array,
    required: true
  },
  feedback: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['submit', 'reset', 'back-to-menu']);

function handleSubmit() {
  emit('submit');
}

function handleReset() {
  emit('reset');
}

function backTomMenu() {
  emit('back-to-menu');
}
</script>

<template>
  <div class="game-container">
    <button @click="backTomMenu" class="exit-button">
      Exit Challenge
    </button>
    <h2>Challenge {{ currentChallenge.id }}</h2>

    <div class="data-container">
      <!-- Original Data Column -->
      <DataColumn
          title="Original Data"
          :data="currentChallenge.dirtyData"
          :editable="false"
      />

      <!-- User's Cleaned Data Column -->
      <DataColumn
          title="Clean the Data"
          :data="userCleanedData"
          :editable="true"
          :feedback="feedback"
      />
    </div>

    <div class="controls">
      <button @click="handleSubmit" class="submit-btn">Submit</button>
      <button @click="handleReset" class="reset-btn">Reset</button>
    </div>

    <ResultsFeedback
        v-if="feedback"
        :feedback="feedback"
    />
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.data-container {
  display: flex;
  gap: 40px;
  margin-bottom: 20px;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 20px 0;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn {
  background-color: #2196F3;
  color: white;
}

.reset-btn {
  background-color: #ff9800;
  color: white;
}
</style>