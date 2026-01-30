<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
    <!-- Header -->
    <header class="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-10">
      <div class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">
            🃏 One Piece Card Collection
          </h1>
          <div class="flex gap-4">
            <NuxtLink
              to="/search"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              🔍 Recherche
            </NuxtLink>
            <NuxtLink
              to="/"
              class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              ← Accueil
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="container mx-auto px-6 py-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Chargement...</p>
      </div>

      <!-- Not found -->
      <div v-else-if="!serie" class="text-center py-12">
        <p class="text-gray-400 mb-4">Série introuvable</p>
        <NuxtLink
          to="/"
          class="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
        >
          Retour à l'accueil
        </NuxtLink>
      </div>

      <!-- Serie detail -->
      <div v-else>
        <!-- Serie header -->
        <div class="mb-8">
          <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 mb-4 inline-block">
            ← Retour aux séries
          </NuxtLink>

          <div class="bg-gray-800 rounded-lg p-6 flex items-center gap-6">
            <div v-if="serie.image" class="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <img
                :src="serie.image"
                :alt="serie.name"
                class="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 class="text-3xl font-bold text-white mb-2">{{ serie.name }}</h2>
              <p class="text-gray-400">{{ serieCards.length }} carte(s)</p>
            </div>
          </div>
        </div>

        <!-- Filters -->
        <div class="bg-gray-800 rounded-lg p-4 mb-6">
          <div class="flex gap-4 flex-wrap">
            <button
              v-for="status in statuses"
              :key="status.value"
              @click="selectedStatus = status.value"
              class="px-4 py-2 rounded-lg font-semibold transition-colors"
              :class="selectedStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              "
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <!-- Empty cards state -->
        <div v-if="filteredCards.length === 0" class="text-center py-12 bg-gray-800 rounded-lg">
          <p class="text-gray-400">Aucune carte trouvée</p>
        </div>

        <!-- Cards grid -->
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          <div
            v-for="card in filteredCards"
            :key="card.id"
            class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all relative group"
          >
            <!-- Image -->
            <div class="aspect-[3/4] bg-gray-700 relative">
              <img
                v-if="card.image"
                :src="card.image"
                :alt="card.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-3xl">
                🃏
              </div>

              <!-- Status badge -->
              <div class="absolute top-2 right-2">
                <span
                  class="px-2 py-1 rounded text-xs font-semibold text-white"
                  :class="{
                    'bg-green-500': card.status === 'acquired',
                    'bg-orange-500': card.status === 'wanted',
                    'bg-blue-500': card.status === 'both',
                  }"
                >
                  {{ getStatusIcon(card.status) }}
                </span>
              </div>

              <!-- Duplicates badge -->
              <div v-if="card.duplicates > 0" class="absolute top-2 left-2">
                <span class="px-2 py-1 rounded text-xs font-semibold bg-yellow-500 text-white">
                  x{{ card.duplicates }}
                </span>
              </div>

              <!-- Hover overlay with details -->
              <div class="absolute inset-0 bg-black bg-opacity-90 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-center">
                <p class="text-xs text-gray-400 mb-1">{{ card.cardNumber }}</p>
                <p class="text-sm font-semibold text-white line-clamp-3">{{ card.name }}</p>
              </div>
            </div>
          </div>
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
const route = useRoute()
const seriesId = route.params.id as string

const serie = ref(null)
const serieCards = ref([])
const loading = ref(true)
const selectedStatus = ref('all')

const statuses = [
  { value: 'all', label: 'Toutes' },
  { value: 'acquired', label: '✅ Acquises' },
  { value: 'wanted', label: '🔍 Recherchées' },
  { value: 'both', label: '⭐ Les deux' },
]

const filteredCards = computed(() => {
  if (selectedStatus.value === 'all') return serieCards.value
  return serieCards.value.filter(c => c.status === selectedStatus.value)
})

const getStatusIcon = (status) => {
  const icons = {
    acquired: '✅',
    wanted: '🔍',
    both: '⭐',
  }
  return icons[status]
}

onMounted(async () => {
  loading.value = true
  try {
    // Load series
    const seriesResponse = await fetch('/data/series.json')
    const allSeries = await seriesResponse.json()
    serie.value = allSeries.find(s => s.id === seriesId)

    // Load cards for this series
    const cardsResponse = await fetch('/data/cards.json')
    const allCards = await cardsResponse.json()
    serieCards.value = allCards.filter(c => c.seriesId === seriesId)
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
})
</script>
