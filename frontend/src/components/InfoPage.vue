<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['back-to-menu']);

function handleBackToMenu() {
  emit('back-to-menu');
}
</script>

<template>
  <div class="info-page-container">
    <h1>Zuyd Lectoraat Data Intelligence</h1>

    <div class="info-section">
      <h2>Over Ons</h2>
      <p>
        Het Lectoraat Data Intelligence van Zuyd Hogeschool richt zich op onderzoek en onderwijs op het gebied van
        data science, kunstmatige intelligentie en de toepassingen hiervan in verschillende domeinen.
        Onze missie is het vergroten van kennis en het bevorderen van praktische toepassingen van
        data intelligence technieken binnen het onderwijs en het werkveld.
      </p>
    </div>

    <div class="info-section">
      <h2>Ons Onderzoek</h2>
      <p>
        We voeren onderzoek uit op verschillende gebieden, waaronder:
      </p>
      <ul>
        <li>Machine Learning en Predictive Analytics</li>
        <li>Natural Language Processing</li>
        <li>Data Visualisatie</li>
        <li>Business Intelligence</li>
        <li>Ethische AI en Data Privacy</li>
        <li>Smart Services en Digitale Transformatie</li>
      </ul>
    </div>

    <div class="info-section">
      <h2>Onderwijs & Samenwerking</h2>
      <p>
        Het lectoraat werkt nauw samen met het onderwijs en het bedrijfsleven in de regio. We bieden:
      </p>
      <ul>
        <li>Stage- en afstudeermogelijkheden voor studenten</li>
        <li>Onderzoeksprojecten met regionale partners</li>
        <li>Kennisdeling via workshops en seminars</li>
        <li>Innovatieve oplossingen voor datagestuurde vraagstukken</li>
      </ul>
    </div>

    <div class="info-section">
      <h2>Contactgegevens</h2>
      <p>
        Voor meer informatie over ons onderzoek en samenwerkingsmogelijkheden:
      </p>
      <p>
        E-mail: data.intelligence@zuyd.nl<br>
        Telefoon: +31 45 400 6400<br>
        Adres: Zuyd Hogeschool, Nieuw Eyckholt 300, 6419 DJ Heerlen
      </p>
    </div>

    <div class="action-buttons">
      <button @click="handleBackToMenu" class="back-btn">Terug naar Menu</button>
    </div>
  </div>
</template>

<style scoped>
.info-page-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  color: #8D101F;
  text-align: center;
  margin-bottom: 30px;
}

h2 {
  color: #ED1B34;
  margin-top: 30px;
  margin-bottom: 15px;
}

.info-section {
  margin-bottom: 30px;
}

p, ul {
  line-height: 1.6;
  color: #333;
}

ul {
  padding-left: 20px;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.back-btn {
  background-color: #ff9800;
  color: white;
}

.back-btn:hover {
  background-color: #e68a00;
}
</style>