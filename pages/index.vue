<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 p-6">
    <h1 class="mb-4 text-4xl font-extrabold leading-none tracking-tight text-center md:text-5xl lg:text-6xl text-white mt-5">Ma Bibliothèque</h1>

    <div class="flex justify-between items-center mb-8 flex-wrap gap-4 mt-10">
      <!-- Barre de recherche dynamique -->
      <div class="flex-1">
        <input
          type="text"
          v-model="search"
          placeholder="🔎 Rechercher un jeu..."
          class="w-full px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
        />
      </div>

      <!-- Boutons d'affichage -->
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
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6"
    >
      <GameCard
        v-for="game in filteredGames"
        :key="game.id"
        :game="game"
      />
    </div>

    <!-- Affichage Liste -->
    <ul v-else class="space-y-3">
      <li
        v-for="game in filteredGames"
        :key="game.id"
        class="flex items-center gap-4 px-4 py-3 border border-gray-700 rounded-lg bg-gray-800 hover:bg-gray-700 transition"
      >
        <div class="text-lg font-semibold">{{ game.title }}</div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import GameCard from '@/components/GameCard.vue'

const games = ref([])
const viewMode = ref('grid')
const search = ref('')

const buttonClass = (isActive) =>
  `px-4 py-1 rounded font-semibold transition border ${
    isActive
      ? 'bg-neon-blue text-white border-neon-blue shadow shadow-neon'
      : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
  }`

// Fonction de filtrage
const filteredGames = computed(() => {
  const terms = search.value.toLowerCase().split(' ').filter(Boolean)
  if (terms.length === 0) return games.value

  return games.value.filter((game) =>
    terms.every((term) => game.title.toLowerCase().includes(term))
  )
})

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
