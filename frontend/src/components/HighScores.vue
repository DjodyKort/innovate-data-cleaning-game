<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL;
const highScores = ref([]);
const loading = ref(true);
const error = ref(null);

const emit = defineEmits(['back-to-menu']);

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

function backToMenu() {
  emit('back-to-menu');
}

onMounted(() => {
  fetchHighScores();
});
</script>

<template>
  <button @click="backToMenu" class="exit-button">
    Exit HighScores
  </button>
  <h1>High Scores</h1>
  <div>
    <table>
      <tr>
        <th>PLAYER</th>
        <th>SCORE</th>
      </tr>
      <tr v-for="highScore in highScores" :key="highScore.id">
        <td>{{ highScore.name }}</td>
        <td>{{ highScore.score }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>

</style>