<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;
const highScores = ref([]);
const loading = ref(true);
const error = ref(null);

async function fetchHighScores() {
  loading.value = true;
  error.value = null;

  try {
    const response = await axios.get(`${API_URL}/highscores`);
    highScores.value = response.data;
  } catch (err) {
    console.error('Error fetching high scores:', err);
    error.value = 'Failed to load high scores. Please try again later.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchHighScores();
});
</script>

<template>
  <div class="highscores-container">
    <h1 class="highScores">High Scores</h1>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading high scores...</p>
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="highScores.length === 0" class="no-scores-message">
      No high scores available yet. Be the first to play!
    </div>

    <div v-else class="scores-table-container">
      <table class="scores-table">
        <thead>
          <tr>
            <th class="rank-header">RANK</th>
            <th class="player-header">PLAYER</th>
            <th class="score-header">SCORE</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(highScore, index) in highScores" :key="highScore.id">
            <td class="rank-cell">{{ index + 1 }}</td>
            <td class="player-cell">{{ highScore.name }}</td>
            <td class="score-cell">{{ highScore.score }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  
  font-size: 2vh;
}

.highscores-container {
  max-width: 41.6vw;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.highScores {
  font-size: 2.5rem;
  margin-bottom: 2.78vh;
  text-align: center;
  color: #333;
}

.exit-button {
  font-family: "Sixtyfour", sans-serif;
  width: 10.4vw;
  height: 3.7vh;
  font-size: 20px;
  padding: 12px 24px;
  cursor: pointer;
  margin-bottom: 30px;
  margin-left: 30px;
  margin-right: 1800px;
}


.scores-table-container {
  width: 100%;
  max-width: 80vw;
  overflow-x: auto;
}

.scores-table {
  width: auto;
  min-width: 600px;
  border-collapse: collapse;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

.scores-table th, .scores-table td {
  padding: 15px 20px;
  text-align: left;
}

.scores-table thead {
  background-color: #8D101F;
  color: white;
}

.scores-table tbody tr:nth-child(even) {
  background-color: #f5f5f5;
}

.scores-table tbody tr:nth-child(odd) {
  background-color: #ffffff;
}

.rank-header, .player-header, .score-header {
  padding: 12px 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.rank-cell, .rank-header {
  width: 5vw;
  text-align: center;
}

.player-cell, .player-header {
  width: 40vw;
  text-align: left;
}

.score-cell, .score-header {
  font-weight: bold;
  text-align: right;
  width: 10vw;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #8D101F;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  color: #f44336;
  margin: 40px 0;
  text-align: center;
  padding: 15px;
  background-color: #ffebee;
  border-radius: 5px;
  width: 100%;
}

.no-scores-message {
  margin: 40px 0;
  text-align: center;
  color: #666;
  font-style: italic;
}
</style>