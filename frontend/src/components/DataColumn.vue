<script setup>
import { defineProps, defineEmits } from 'vue';
import DataCard from './DataCard.vue';

const props = defineProps({
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

const emit = defineEmits(['update:data']);

function updateItem(updatedItem) {
  if (!props.editable) return;

  const newData = [...props.data];
  const index = newData.findIndex(item => item.id === updatedItem.id);

  if (index !== -1) {
    newData[index] = updatedItem;
    emit('update:data', newData);
  }
}
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
        @update:item="updateItem"
    />
  </div>
</template>

<style scoped>
.data-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

h3 {
  margin-top: 0;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ddd;
}
</style>