<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  totalScore: {
    type: Number,
    required: true
  },
  apiUrl: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['back-to-menu', 'play-again']);

const playerName = ref('');
const isSubmitting = ref(false);
const submitSuccess = ref(false);
const submitError = ref(null);

async function submitScore() {
  submitError.value = null;
  isSubmitting.value = true;

  try {
    await axios.post(`${props.apiUrl}/highscores/`, {
      name: playerName.value,
      score: props.totalScore
    });

    submitSuccess.value = true;
    isSubmitting.value = false;
  } catch (error) {
    console.error('Error submitting score:', error);
    submitError.value = "Failed to submit your score. Please try again.";
    isSubmitting.value = false;
  }
}
function handlePlayAgain() {
  emit('play-again');
}

function handleBackToMenu() {
  emit('back-to-menu');
}
</script>

<template>
  <div class="score-submission-container">
    <h2>Game Complete!</h2>

    <div class="score-display">
      <h3>Your Final Score</h3>
      <div class="score-value">{{ totalScore }}</div>
    </div>

    <div v-if="!submitSuccess" class="name-submission">
      <h3>Submit Your Score</h3>
      <div class="input-group">
        <label for="player-name">Enter your name:</label>
        <input
            id="player-name"
            v-model="playerName"
            type="text"
            placeholder="Your name"
            :disabled="isSubmitting"
        />
      </div>

      <p v-if="submitError" class="error-message">{{ submitError }}</p>

      <button
          @click="submitScore"
          class="submit-score-btn"
          :disabled="isSubmitting || !playerName.trim()"
      >
        {{ isSubmitting ? 'Submitting...' : 'Submit Score' }}
      </button>
    </div>

    <div v-else class="submission-success">
      <h3>Score Submitted Successfully!</h3>
      <p>Your score has been added to the leaderboard.</p>
    </div>

    <div class="action-buttons">
      <button @click="handlePlayAgain" class="play-again-btn">Play Again</button>
      <button @click="handleBackToMenu" class="menu-btn">Back to Menu</button>
    </div>
  </div>
</template>

<style scoped>
.score-submission-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
}

h3 {
  color: #555;
  margin-bottom: 15px;
}

.score-display {
  margin-bottom: 30px;
}

.score-value {
  font-size: 48px;
  font-weight: bold;
  color: #2196F3;
  margin: 20px 0;
}

.name-submission {
  margin-bottom: 30px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  text-align: left;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #666;
}

input {
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.error-message {
  color: #f44336;
  margin-top: 5px;
  margin-bottom: 15px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.submit-score-btn {
  background-color: #4CAF50;
  color: white;
  width: 100%;
  margin-bottom: 15px;
}

.submit-score-btn:hover {
  background-color: #45a049;
}

.submit-score-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.play-again-btn {
  background-color: #2196F3;
  color: white;
}

.play-again-btn:hover {
  background-color: #0b7dda;
}

.menu-btn {
  background-color: #ff9800;
  color: white;
}

.menu-btn:hover {
  background-color: #e68a00;
}

.submission-success {
  margin-bottom: 30px;
  padding: 15px;
  background-color: #d4edda;
  border-radius: 5px;
  color: #155724;
}
</style>