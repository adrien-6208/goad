<template>
  <div class="flex flex-col items-center text-center">
    <div
      class="w-full aspect-[2/3] overflow-hidden rounded-lg shadow-lg"
    >
      <img
        :src="game.cover"
        :alt="game.title"
        class="w-full h-full object-cover rounded-lg"
      />
    </div>
    <div class="mt-2 text-l font-medium text-gray-100 w-full">
      {{ game.title }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  game: Object
})
</script>
