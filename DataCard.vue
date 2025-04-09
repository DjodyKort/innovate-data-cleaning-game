<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
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

const emit = defineEmits(['update:item']);

// Enhanced function to check if a value is not empty
const isNotEmpty = (value) => {
  console.log('Checking value:', value);
  // Handle null, undefined
  if (value === null || value === undefined) return false;

  // Handle empty strings and whitespace
  if (typeof value === 'string' && value.trim() === '') return false;

  // Handle numeric zeros (optional - remove if you want to show zero values)
  if (value === 0 || value === '0') return true;

  // Handle NaN values
  if (typeof value === 'number' && isNaN(value)) return false;

  return true;
};

// Function to handle input changes
const updateField = (key, value) => {
  const updatedItem = { ...props.item, [key]: value };
  emit('update:item', updatedItem);
};
</script>

<template>
  <div
      class="data-card"
      :class="{
        'has-feedback': feedback,
        'success-card': feedback && feedback.correct,
        'error-card': feedback && feedback.errors && feedback.errors.length > 0
      }"
  >
    <div class="data-id">ID: {{ item.id }}</div>
    <div
        class="data-field"
        v-for="(value, key) in item"
        :key="key"
        v-if="key !== 'id' && isNotEmpty(value)"
    >
      <template v-if="key !== 'id'">
        <span>{{ key }}: </span>
        <template v-if="editable">
          <input
              :value="item[key]"
              @input="updateField(key, $event.target.value)"
              :class="{'error-field': feedback && feedback.errors && feedback.errors.includes(key)}"
          />
        </template>
        <template v-else>
          {{ value }}
        </template>
      </template>
    </div>
    <div
        v-if="feedback && feedback.errors && feedback.errors.length > 0"
        class="feedback error"
    >
      Errors in: {{ feedback.errors.join(', ') }}
    </div>
    <div
        v-else-if="feedback && feedback.correct"
        class="feedback success"
    >
      Correct!
    </div>
  </div>
</template>

<style scoped>
  .data-card {
    border: 1px solid #ddd;
    border-radius: 5px;
    padding: 15px;
    background-color: #f9f9f9;
  }
  .data-id {
    font-weight: bold;
    margin-bottom: 10px;
  }
  .data-field {
    margin-bottom: 8px;
  }
  input {
    padding: 5px;
    border: 1px solid #ddd;
    border-radius: 3px;
    width: 100%;
  }
  .error-field {
    border-color: #ff5252;
    background-color: #ffeeee;
  }
  .feedback {
    margin-top: 10px;
    padding: 5px;
    border-radius: 3px;
  }
  .success {
    color: green;
    background-color: #e8f5e9;
  }
  .error {
    color: #c62828;
    background-color: #ffebee;
  }
  .success-card {
    border: 2px solid green;
    background-color: #f0fff0;
  }
  .error-card {
    border: 2px solid #ff5252;
    background-color: #fff8f8;
  }
</style>
