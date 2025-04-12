<template>
    <div class="flex flex-col items-center text-center">
      <img
        :src="game.cover"
        :alt="game.title"
        class="w-full max-w-[180px] h-[240px] object-cover transition-transform duration-300 hover:scale-105"
      />
      <h2 class="mt-2 text-base font-semibold text-gray-800">
        {{ game.title }}
      </h2>
    </div>
  </template>
  
  <script setup>
  defineProps({
    game: {
      type: Object,
      required: true
    }
  })
  </script>
  