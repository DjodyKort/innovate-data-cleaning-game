<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import DataColumn from './DataColumn.vue';
import ResultsFeedback from './ResultsFeedback.vue';

const props = defineProps({
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
  },
  gameNumber: {
    type: Number,
    default: 1
  },
  totalGames: {
    type: Number,
    default: 1
  }
});

// Keep track of which record we're currently on
const currentRecordIndex = ref(0);
const totalRecords = computed(() => props.userCleanedData?.length || 0);

// Flag to check if all challenges are completed
const isLastChallenge = computed(() => props.gameNumber === props.totalGames);

const emit = defineEmits(['submit', 'reset', 'back-to-menu', 'continue', 'update:userCleanedData', 'update:finalScore']);

// Computed properties to filter data to just the current record with additional checks
const currentDirtyData = computed(() => {
  if (!props.currentChallenge?.dirtyData ||
      currentRecordIndex.value >= props.currentChallenge.dirtyData.length) {
    return [];
  }
  return [props.currentChallenge.dirtyData[currentRecordIndex.value]];
});

const currentUserData = computed(() => {
  if (!props.userCleanedData ||
      currentRecordIndex.value >= props.userCleanedData.length) {
    return [];
  }
  return [props.userCleanedData[currentRecordIndex.value]];
});

const currentFeedback = computed(() => {
  if (!props.feedback || !props.feedback.results) return null;

  // Check if the current index is valid
  if (currentRecordIndex.value >= props.feedback.results.length) {
    return { ...props.feedback, results: [] };
  }

  // Create a copy of the feedback but only include the current record's results
  const filteredFeedback = {...props.feedback};
  filteredFeedback.results = [filteredFeedback.results[currentRecordIndex.value]];
  return filteredFeedback;
});

// Update the challenge score when feedback changes
watch(
    () => props.feedback,
    (newFeedback) => {
      if (newFeedback && newFeedback.results && newFeedback.success) {
        // Just notify the parent component that this challenge is completed successfully
        // The parent will handle scoring
        if (isLastChallenge.value) {
          emit('continue');
        }
      }
    }
);

// Reset the current record index when challenge changes
watch(
    () => props.currentChallenge?.id,
    () => {
      currentRecordIndex.value = 0;
    }
);

function handleSubmit() {
  emit('submit');// Don't pass the index parameter to submit all records
}

function handleReset() {
  emit('reset', currentRecordIndex.value);
}

function backTomMenu() {
  emit('back-to-menu');
}

function handleNextChallenge() {
  emit('continue');
}

function handleNext() {
  if (currentRecordIndex.value < totalRecords.value - 1) {
    currentRecordIndex.value++;
  } else if (props.feedback && props.feedback.success) {
    handleNextChallenge();
  }
}

function handlePrevious() {
  if (currentRecordIndex.value > 0) {
    currentRecordIndex.value--;
  }
}

function updateUserData(newData) {
  if (!newData || newData.length === 0 || !props.userCleanedData) return;

  // Copy the updated item back to the full array
  const updatedData = [...props.userCleanedData];
  if (currentRecordIndex.value < updatedData.length && newData[0]) {
    updatedData[currentRecordIndex.value] = newData[0];
    emit('update:userCleanedData', updatedData);
  }
}
</script>

<template>
  <div class="game-container">
    <button @click="backTomMenu" class="exit-button">
      Exit Challenge
    </button>
    <div class="challenge-header">
      <h2>Challenge {{ currentChallenge.id }}: {{ currentChallenge.name }}</h2>
      <div class="progress-indicator">
        Challenge {{ gameNumber }} of {{ totalGames }}
      </div>
      <div class="record-indicator">
        Record {{ currentRecordIndex + 1 }} of {{ totalRecords }}
      </div>
    </div>

    <!-- Only render data columns if we have valid data -->
    <div v-if="currentDirtyData.length > 0 && currentUserData.length > 0" class="data-container">
      <!-- Original Data Column -->
      <DataColumn
          title="Original Data"
          :data="currentDirtyData"
          :editable="false"
      />
      <!-- User's Cleaned Data Column -->
      <DataColumn
          title="Clean the Data"
          :data="currentUserData"
          :editable="true"
          :feedback="currentFeedback"
          @update:data="updateUserData"
      />
    </div>
    <div v-else class="loading">
      Loading data...
    </div>

    <div class="controls">
      <button
          v-if="currentRecordIndex > 0"
          @click="handlePrevious"
          class="previous-btn"
          :disabled="currentRecordIndex === 0"
      >
        Previous Record
      </button>
      <button @click="handleReset" class="reset-btn">Reset</button>
      <button
          v-if="currentRecordIndex < totalRecords - 1 || (feedback && feedback.success)"
          @click="handleNext"
          class="continue-btn"
      >
        {{ currentRecordIndex < totalRecords - 1 ? 'Next Record' : 'Continue to Next Challenge' }}
      </button>
      <button
          v-else
          @click="handleSubmit"
          class="submit-btn"
          :disabled="feedback && feedback.success">Submit
      </button>
    </div>
    <ResultsFeedback
        v-if="feedback"
        :feedback="feedback"
        :showScore="false"
        @continue="handleNextChallenge"
    />
  </div>
</template>

<style scoped>
.game-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.challenge-header {
  display: flex;
  flex-direction: column;
  gap: 5px;
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
.previous-btn {
  background-color: #9e9e9e;
  color: white;
}
.continue-btn {
  background-color: #4CAF50;
  color: white;
}
.record-indicator {
  font-size: 16px;
  color: #666;
  margin-top: 5px;
}
.exit-button {
  align-self: flex-start;
  background-color: #f44336;
  color: white;
  margin-bottom: 10px;
}
</style>