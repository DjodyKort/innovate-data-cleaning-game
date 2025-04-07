<!-- ==== Script ==== -->
<script setup>
import { ref, onMounted,} from 'vue';
import axios from 'axios';
import ChallengeSelector from './components/ChallengeSelector.vue';
import ChallengeGame from './components/ChallengeGame.vue';
import HighScores from "./components/HighScores.vue";

// Constants
const API_URL = process.env.VUE_APP_API_URL

// Reactive state
const availableChallenges = ref([]);
const currentChallenge = ref(null);
const userCleanedData = ref([]);
const feedback = ref(null);
const showHighScores = ref(false);

// Functions
async function fetchChallenges() {
  try {
    const response = await axios.get(`${API_URL}/challenges`);
    availableChallenges.value = response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
  }
}

async function loadChallenge(id) {
  try {
    const response = await axios.get(`${API_URL}/challenge/${id}`);
    currentChallenge.value = response.data;
    // Create a copy of the dirty data for user edits
    userCleanedData.value = JSON.parse(JSON.stringify(currentChallenge.value.dirtyData));
    feedback.value = null;
  } catch (error) {
    console.error('Error loading challenge:', error);
  }
}

async function submitData() {
  try {
    const response = await axios.post(
        `${API_URL}/challenge/${currentChallenge.value.id}/submit`,
        { cleanedData: userCleanedData.value }
    );
    feedback.value = response.data;
  } catch (error) {
    console.error('Error submitting data:', error);
  }
}

function resetChallenge() {
  if (currentChallenge.value) {
    userCleanedData.value = JSON.parse(JSON.stringify(currentChallenge.value.dirtyData));
    feedback.value = null;
  }
}

function showHighScoresScreen() {
  showHighScores.value = true;
}

function backToMenu() {
  currentChallenge.value = null;
  showHighScores.value = false;
}

onMounted(() => {
  fetchChallenges();
});
</script>

<!-- ==== Template ==== -->
<template>
  <div id="app">
    <div>
      <div class="imageTopRight">
        <img src="" alt="logo-zuyd"/>
      </div>
      <div class="firstTopBorder">
      </div>
      <div class="secondTopBorder">
      </div>
    </div>
    <div v-if="!currentChallenge && !showHighScores">
      <div class="headers">
        <h3><i>Lectoraat Data intelligence en ICT-Academie in samenwerking met</i></h3>
        <hr/>
        <h2>ChatGPTeam</h2>
        <h1>Data Cleaning - ID Game</h1>
      </div>
      <div class="buttons">
        <ChallengeSelector
            :challenges="availableChallenges"
            @select-challenge="loadChallenge"
        />
        <button @click="showHighScoresScreen">High Scores</button>
      </div>
    </div>
    <ChallengeGame
        v-else-if="currentChallenge"
        :currentChallenge="currentChallenge"
        :userCleanedData="userCleanedData"
        :feedback="feedback"
        @submit="submitData"
        @reset="resetChallenge"
        @back-to-menu="backToMenu"
    />
    <HighScores
        v-else-if="showHighScores"
        @back-to-menu="backToMenu"
    />
  </div>
</template>

<!-- ==== Style ==== -->
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>