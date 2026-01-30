<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
    <!-- Header -->
    <header class="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">
            🃏 One Piece Card Collection
          </h1>
          <NuxtLink
            to="/search"
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            🔍 Recherche
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="container mx-auto px-6 py-8">
      <h2 class="text-3xl font-bold text-white mb-8">Séries</h2>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Chargement...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="series.length === 0" class="text-center py-12">
        <p class="text-gray-400">Aucune série pour le moment</p>
      </div>

      <!-- Series grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
        <div
          v-for="serie in series"
          :key="serie.id"
          class="flex flex-col items-center"
        >
          <NuxtLink
            :to="`/series/${serie.id}`"
            class="inline-block rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all group"
          >
            <img
              v-if="serie.image"
              :src="serie.image"
              :alt="serie.name"
              class="w-full h-auto max-w-full group-hover:scale-105 transition-transform duration-300"
              @error="handleImageError"
            />
            <div v-else class="bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 text-5xl w-48 h-48">
              🗂️
            </div>
          </NuxtLink>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900/50 backdrop-blur-sm border-t border-gray-800 mt-16">
      <div class="container mx-auto px-6 py-8 text-center text-gray-400">
        <p>© {{ new Date().getFullYear() }} One Piece Card Collection</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const series = ref([])
const loading = ref(true)

const handleImageError = (e: Event) => {
  const target = e.target as HTMLImageElement
  target.style.display = 'none'
}

onMounted(async () => {
  try {
    const response = await fetch('/data/series.json')
    series.value = await response.json()
  } catch (error) {
    console.error('Erreur lors du chargement des séries:', error)
  } finally {
    loading.value = false
  }
})
</script>
