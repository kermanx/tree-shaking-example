<script setup lang="ts">
import { ref } from 'vue'
import Comp from './Comp.vue'

const counter = ref(0)
const name = ref('John Doe')
</script>

<template>
  <Comp msg="Your name:" v-model="name" />  

  <div>
    Hello {{ name }}
  </div>

  <button @click="counter++">{{ counter }}</button>
</template>
