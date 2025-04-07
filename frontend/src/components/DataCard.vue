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

// Create local copies of item properties

// Function to handle input changes
const updateField = (key, value) => {
  const updatedItem = { ...props.item, [key]: value };
  emit('update:item', updatedItem);
};
</script>

<template>
  <div
      class="data-card"
      :class="{'has-feedback': feedback}"
  >
    <div class="data-id">ID: {{ item.id }}</div>
    <div
        class="data-field"
        v-for="(value, key) in item"
        :key="key"
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
</style>