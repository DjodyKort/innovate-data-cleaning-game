<script setup>
// ==== Imports ====
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import ChallengeGame from './components/ChallengeGame.vue';
import HighScores from "./components/HighScores.vue";
import GameScoreSubmission from "./components/GameScoreSubmission.vue";
import InfoPage from "./components/InfoPage.vue";

// ==== Declaring Variables ====
// Environment variables
const API_URL = process.env.VUE_APP_API_URL

/// Consts
const availableChallenges = ref([]);
const currentChallengeIndex = ref(0);
const currentChallenge = ref(null);
const userCleanedData = ref([]);
const feedback = ref(null);
const showHighScores = ref(false);
const showScoreSubmission = ref(false);
const gameInProgress = ref(false);
const gameCompleted = ref(false);
const finalScore = ref(0);
const challengeScores = ref({});
const gameScore = ref(0);
const showInfoPage = ref(false);


const currentGameNumber = computed(() => {
  if (!gameInProgress.value) return 0;
  return currentChallengeIndex.value + 1;
});
const totalGames = computed(() => {
  return availableChallenges.value.length;
});
const totalScore = computed(() => {
  return Object.values(challengeScores.value).reduce((sum, score) => sum + score, 0);
});


async function fetchChallenges() {
  try {
    const response = await axios.get(`${API_URL}/challenges`);
    availableChallenges.value = response.data;
  } catch (error) {
    console.error('Error fetching challenges:', error);
  }
}

async function startGame() {
  currentChallengeIndex.value = 0;
  gameInProgress.value = true;
  gameCompleted.value = false;
  showScoreSubmission.value = false;
  challengeScores.value = {}; // Reset challenge scores
  gameScore.value = 0; // Reset game score
  finalScore.value = 0; // Reset final score
  await loadCurrentChallenge();
}

async function loadCurrentChallenge() {
  try {
    const challengeId = availableChallenges.value[currentChallengeIndex.value].id;
    const response = await axios.get(`${API_URL}/challenge/${challengeId}`);
    currentChallenge.value = response.data;
    // Create a copy of the dirty data for user edits
    userCleanedData.value = JSON.parse(JSON.stringify(currentChallenge.value.dirtyData));
    feedback.value = null;
  } catch (error) {
    console.error('Error loading challenge:', error);
  }
}

async function submitData(recordIndex) {
  try {
    const dataToSubmit = recordIndex !== undefined
        ? { cleanedData: [userCleanedData.value[recordIndex]] }
        : { cleanedData: userCleanedData.value };

    const response = await axios.post(
        `${API_URL}/challenge/${currentChallenge.value.id}/submit`,
        dataToSubmit
    );
    feedback.value = response.data;

    if (feedback.value) {
      const challengeId = currentChallenge.value.id;
      challengeScores.value[challengeId] = calculateChallengeScore(feedback.value);

      gameScore.value = totalScore.value;
    }
  } catch (error) {
    console.error('Error submitting data:', error);
  }
}

function calculateChallengeScore(feedback) {
  if (!feedback || !feedback.results) {
    return 0;
  }

  // Base score calculation - 20 points per correct record
  const basePoints = 90;

  // Penalty per error in a record
  const errorPenalty = 30;

  const totalScore = feedback.results.reduce((sum, result, index) => {

    // Base points for the record
    let recordScore = basePoints;

    // Subtract points for errors
    if (!result.correct && result.errors) {
      const errorCount = result.errors.length;
      const totalPenalty = errorCount * errorPenalty;
      recordScore = Math.max(0, recordScore - totalPenalty);
    }
    return sum + recordScore;
  }, 0);

  return totalScore;
}

function advanceToNextGame() {
  currentChallengeIndex.value++;
  feedback.value = null; // Reset feedback when moving to next challenge

  if (currentChallengeIndex.value >= availableChallenges.value.length) {
    gameInProgress.value = false;
    gameCompleted.value = true;
    currentChallenge.value = null;
    showScoreSubmission.value = true;
    finalScore.value = gameScore.value; // Set the final score
    return;
  }

  loadCurrentChallenge();
}

function resetChallenge(recordIndex) {
  if (currentChallenge.value) {
    if (recordIndex !== undefined) {
      userCleanedData.value[recordIndex] = JSON.parse(
          JSON.stringify(currentChallenge.value.dirtyData[recordIndex])
      );
    } else {
      userCleanedData.value = JSON.parse(
          JSON.stringify(currentChallenge.value.dirtyData)
      );
    }
    feedback.value = null;
  }
}

function showHighScoresScreen() {
  showHighScores.value = true;
  showScoreSubmission.value = false;
}

function showInfoPageScreen() {
  showInfoPage.value = true;
  showHighScores.value = false;
  showScoreSubmission.value = false;
}

function backToMenu() {
  currentChallenge.value = null;
  showHighScores.value = false;
  showScoreSubmission.value = false;
  showInfoPage.value = false;
  gameInProgress.value = false;
}

function updateUserData(updatedData) {
  userCleanedData.value = updatedData;
}

function updateFinalScore(score) {
  finalScore.value = score;
}

onMounted(() => {
  fetchChallenges();
});
</script>

<template>
  <div id="app">
    <div class="topBorder">
      <div class="imageTopRight">
        <img src="./assets/zuyd_logo.png" alt="logo-zuyd"/>
      </div>
      <div class="firstTopBorder">
        <div v-if="currentChallenge || showHighScores || showScoreSubmission || showInfoPage">
          <button @click="backToMenu" class="exit-button home-button">
            <img src="@/assets/home.svg" alt="Home" class="home-icon">
          </button>
        </div>
      </div>
      <div class="secondTopBorder">
      </div>
    </div>
    <div v-if="!currentChallenge && !showHighScores && !showScoreSubmission && !showInfoPage">
      <div class="headers">
        <h3 class="lectoraatText"><i>Lectoraat Data intelligence en ICT-Academie in samenwerking met</i></h3>
        <div class="divvy"></div>
        <div class="chatGPTeam">
          <h2 class="chatGPTeamText" style="display: inline-block; margin-right: 0.5vw;">ChatGPTeam</h2>
          <img
            src="./assets/cat_clean_icon.png"
            alt="logo-chatgpteam"
            class="catCleanIcon"
            style="display: inline-block; width: 7vw; height: auto; vertical-align: middle;"
          />
        </div>
        <h1 class="idGameText">Data Cleaning - ID Game</h1>
      </div>
      <div class="buttons">
        <div class="start-game-container">
          <button @click="startGame" class="start-game-btn">Start Game</button>
          <button @click="showHighScoresScreen" class="high-scores-btn">High Scores</button>
          <button @click="showInfoPageScreen" class="info-btn">Lectoraat</button>
        </div>
      </div>
    </div>
    <ChallengeGame
        v-else-if="currentChallenge"
        :currentChallenge="currentChallenge"
        :userCleanedData="userCleanedData"
        :feedback="feedback"
        :gameNumber="currentGameNumber"
        :totalGames="totalGames"
        @submit="submitData"
        @reset="resetChallenge"
        @back-to-menu="backToMenu"
        @continue="advanceToNextGame"
        @update:userCleanedData="updateUserData"
        @update:finalScore="updateFinalScore"
    />
    <GameScoreSubmission
        v-else-if="showScoreSubmission"
        :totalScore="finalScore"
        :apiUrl="API_URL"
        @back-to-menu="backToMenu"
        @play-again="startGame"
    />
    <HighScores
        v-else-if="showHighScores"
    />
    <InfoPage
        v-else-if="showInfoPage"
        @back-to-menu="backToMenu"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jersey+10&display=swap');

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif; /*Jersey 10*/
  /* max-width: 1200px;
  margin: 0 auto; */
  padding: 0px;
  overflow: hidden;
}

body {
  margin: 0;
}

.imageTopRight {
    position: absolute;
    top: 2.3vh;
    right: 2.3vw;
    width: 10vw;
    height: auto; /* 17.8vh */
}

.firstTopBorder {
  width: 100vw;
  height: 8.34vh;
  z-index: 0;
  background-color: #8D101F;
}

.home-button {
  position: absolute;
  top: 1vw;
  left: 1.04vw;
  z-index: 10;
  background-color: transparent;
  border: none;
  border-bottom: none;
  border-right: none;
}

.home-icon {
  width: 2.5vw;
  height: 4.44vh;
}

.secondTopBorder {
  width: 100vw;
  height: 5.55vh;
  z-index: -1;
  background-color: #ED1B34;
}

.headers {
  text-align: center;
  font-size: 4vw;
}

.lectoraatText {
  margin-bottom: 3vh;
  font-size: 2vw;
}

.divvy {
  margin: auto;
  width: 41.7vw;
  height: 0.3vh;
  border-radius: 50px;
  background-color: black;
}

.chatGPTeam {
  margin-top: 1.5vh;
  position: relative;
}

.chatGPTeamText {
  font-size: inherit;
  margin-top: 0;
  margin-right: 0.5vw;
  display: inline-block;
}

.catCleanIcon {
  width: 5vw;
  height: auto;
  display: inline-block;
  vertical-align: middle;
}

.idGameText {
  margin-top: 10vh;
  margin-bottom: 5vh;
  font-size: inherit;
}

.buttons {
  display: block;
  margin-top: 30px;
}

.buttons button {
  font-family: "Jersey 10", sans-serif;
  display: block;
  width: 21vw;
  height: 10vh;
  font-size: 3.5vw;
  padding: 12px 24px;
  border-radius: 0.6vw;
  border: solid #aaa;
  border-bottom: 0.37vh solid #000000;
  border-right: 0.2vw solid #000000;
  border-left: 0.2vw inherit;
  border-top: 0.37vh inherit;
  cursor: pointer;
  margin-bottom: 2.78vh;
  margin-top: auto;
  margin-left: auto;
  margin-right: auto;
  background-color: #eddddb;
}

.info-btn {
  background-color: #8D101F;
  color: black;
}

</style>