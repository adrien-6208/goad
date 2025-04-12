<template>
  <div class="min-h-screen bg-white text-gray-900 p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-4xl font-bold">🎮 Mes jeux</h1>
      <div class="flex gap-2">
        <button
          @click="viewMode = 'grid'"
          :class="buttonClass(viewMode === 'grid')"
        >
          🔳 Cover
        </button>
        <button
          @click="viewMode = 'list'"
          :class="buttonClass(viewMode === 'list')"
        >
          📋 Liste
        </button>
      </div>
    </div>

    <!-- Affichage Mosaïque -->
    <div
      v-if="viewMode === 'grid'"
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
    >
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
      />
    </div>

   <!-- Affichage Liste -->
<ul v-else class="space-y-3">
  <li
    v-for="game in games"
    :key="game.id"
    class="flex items-center gap-4 px-4 py-3 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition"
  >
    <div class="text-lg font-medium text-gray-800">{{ game.title }}</div>
  </li>
</ul>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GameCard from '@/components/GameCard.vue'

const games = ref([])
const viewMode = ref('grid') // 'grid' ou 'list'

const buttonClass = (isActive) =>
  `px-4 py-1 rounded font-medium border ${
    isActive
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
  }`

  onMounted(async () => {
  try {
    const res = await fetch('/data/games.json')
    const data = await res.json()
    games.value = data.sort((a, b) =>
      a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' })
    )
  } catch (err) {
    console.error('Erreur en chargeant les jeux :', err)
  }
})
</script>

<style scoped>
</style>
