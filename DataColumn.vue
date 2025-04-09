<script setup>
import { defineProps } from 'vue';
import DataCard from './DataCard.vue';

 defineProps({
  title: {
    type: String,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  },
  feedback: {
    type: Object,
    default: null
  }
});
</script>

<template>
  <div class="data-column">
    <h3>{{ title }}</h3>
    <DataCard
        v-for="(item, index) in data"
        :key="item.id"
        :item="item"
        :index="index"
        :editable="editable"
        :feedback="feedback && feedback.results ? feedback.results[index] : null"
    />
  </div>
</template>

<style scoped>
.data-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>