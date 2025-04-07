<script setup>
import { defineProps, defineEmits } from 'vue';
defineProps({
  challenges: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['selectChallenge']);

function selectChallenge(id) {
  emit('selectChallenge', id);
}
</script>

<template>
  <div>
    <h3>Select a Challenge:</h3>
    <div>
      <button
          v-for="challenge in challenges"
          :key="challenge.id"
          @click="selectChallenge(challenge.id)"
      >
        Challenge {{ challenge.id }}: {{ challenge.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>