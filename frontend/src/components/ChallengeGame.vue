<script setup>
import { defineProps, defineEmits, ref, computed, watch } from 'vue';
import DataColumn from './DataColumn.vue';
import ResultsFeedback from './ResultsFeedback.vue';
import InfoPopup from './InfoPopup.vue';


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

const currentRecordIndex = ref(0);
const totalRecords = computed(() => props.userCleanedData?.length || 0);

const isLastChallenge = computed(() => props.gameNumber === props.totalGames);

const emit = defineEmits(['submit', 'reset', 'continue', 'update:userCleanedData', 'update:finalScore']);

let submitClicked = ref(false);

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

  if (currentRecordIndex.value >= props.feedback.results.length) {
    return { ...props.feedback, results: [] };
  }

  const filteredFeedback = {...props.feedback};
  filteredFeedback.results = [filteredFeedback.results[currentRecordIndex.value]];
  return filteredFeedback;
});

function handleSubmit() {
  submitClicked = true;
  emit('submit');
}

function handleReset() {
  submitClicked = false;
  currentRecordIndex.value = 0;
  emit('reset', currentRecordIndex.value);
}

function handleNextChallenge() {
  submitClicked = false;
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

  const updatedData = [...props.userCleanedData];
  if (currentRecordIndex.value < updatedData.length && newData[0]) {
    updatedData[currentRecordIndex.value] = newData[0];
    emit('update:userCleanedData', updatedData);
  }
}

watch(
    () => props.feedback,
    (newFeedback) => {
      if (newFeedback && newFeedback.results && newFeedback.success) {
        if (isLastChallenge.value) {
          emit('continue');
        }
      }
    }
);

watch(
    () => props.currentChallenge?.id,
    () => {
      currentRecordIndex.value = 0;
    }
);
</script>

<template>
  <div class="game-container">
    
    <div class="challenge-header">

      <div class="title-with-info">
        <h2>Challenge {{ currentChallenge.id }}: {{ currentChallenge.name }}</h2>
        <InfoPopup :description="currentChallenge.description" />
      </div>
      <div class="progress-indicator">
        Challenge {{ gameNumber }} of {{ totalGames }}
      </div>
      <div class="record-indicator">
        Record {{ currentRecordIndex + 1 }} of {{ totalRecords }}
      </div>
    </div>

    <div v-if="currentDirtyData.length > 0 && currentUserData.length > 0" class="data-container">
      <div class="column">
        <DataColumn
          title="Original Data"
          :data="currentDirtyData"
          :editable="false"
        />
      </div>
      <div class="column">
        <DataColumn
          title="Clean the Data"
          :data="currentUserData"
          :editable="true"
          :feedback="currentFeedback"
          @update:data="updateUserData"
        />
      </div>
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
        v-else-if="!submitClicked && currentRecordIndex === totalRecords - 1"
        @click="handleSubmit"
        class="submit-btn"
        :disabled="feedback && feedback.success"
      >
        Submit
      </button>
      <button
        v-if="submitClicked"
        @click="handleNextChallenge"
        class="continue-btn">Continue to Next Challenge</button>
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
  align-items: center;
  text-align: center;
  gap: 20px;
}

.challenge-header h2 {
  font-size: 4vh;
  font-weight: bold;
  color: rgb(0, 0, 0);
  text-transform: uppercase;
  margin-bottom: 0.5vh;
}

.progress-indicator {
  font-size: 2.5vh;
}

.record-indicator {
  font-size: 2vh;
  color: #666;
  margin-top: 5px;
}

.data-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  font-size: 1vw;
}

.column {
  flex: 1;
  padding: 10px;
  min-width: 20vw;
  line-height: 3vh;
  text-align: left;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
  width: 100%;
}

button:hover {
  transform: scale(1.05);
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

button {
    font-size: 1.2rem;
    padding: 14px 28px;
    border-radius: 8px;
}

.title-with-info {
  display: flex;
  align-items: center;

  justify-content: center;
  flex-wrap: wrap; 
}

.title-with-info h2 {
  margin: 0;
}


@media (max-width: 768px) {
  button {
    font-size: 1.2rem;
    padding: 14px 28px;
  }

  .controls {
    flex-direction: column;
    gap: 20px;
  }
}
</style>
