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
            to="/"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            ← Accueil
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="container mx-auto px-6 py-8">
      <h2 class="text-3xl font-bold text-white mb-8">Recherche de cartes</h2>

      <!-- Filters -->
      <div class="bg-gray-800 rounded-lg p-6 mb-8 space-y-4">
        <!-- Search input -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-300 mb-2">
            Rechercher par nom ou numéro
          </label>
          <input
            id="search"
            v-model="filters.search"
            type="text"
            placeholder="Ex: Luffy, OP01-001..."
            class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <!-- Series filter -->
          <div>
            <label for="series" class="block text-sm font-medium text-gray-300 mb-2">
              Série
            </label>
            <select
              id="series"
              v-model="filters.seriesId"
              class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les séries</option>
              <option v-for="serie in series" :key="serie.id" :value="serie.id">
                {{ serie.name }}
              </option>
            </select>
          </div>

          <!-- Status filter -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-300 mb-2">
              Statut
            </label>
            <select
              id="status"
              v-model="filters.status"
              class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tous</option>
              <option value="duplicates">📦 Doubles</option>
              <option value="wanted">🔍 Recherchées</option>
            </select>
          </div>
        </div>

        <!-- Reset button -->
        <button
          @click="resetFilters"
          class="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Réinitialiser les filtres
        </button>
      </div>

      <!-- Results count -->
      <div class="mb-4">
        <p class="text-gray-400">
          {{ filteredCards.length }} carte(s) trouvée(s)
        </p>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-400">Chargement...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredCards.length === 0" class="text-center py-12 bg-gray-800 rounded-lg">
        <p class="text-gray-400">Aucune carte trouvée</p>
      </div>

      <!-- Cards grid -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <div
          v-for="card in filteredCards"
          :key="card.id"
          class="flex flex-col"
        >
          <!-- Image -->
          <div class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-blue-500 transition-all">
            <div class="aspect-[3/4] bg-gray-700 relative">
              <img
                v-if="card.image"
                :src="card.image"
                :alt="card.name"
                class="w-full h-full object-cover"
                :class="{ 'opacity-40 grayscale': card.status === 'wanted' }"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500 text-3xl">
                🃏
              </div>
            </div>
          </div>

          <!-- Card info -->
          <div class="mt-2 space-y-1">
            <p class="text-xs text-gray-400 font-mono">{{ card.cardNumber }}</p>
            <p class="text-sm font-semibold text-white line-clamp-2">{{ card.name }}</p>
            <div class="flex items-center gap-2 text-xs flex-wrap">
              <span
                v-if="card.status === 'wanted'"
                class="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 font-semibold"
              >
                🔍 Recherchée
              </span>
              <span
                v-if="card.duplicates > 0"
                class="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 font-semibold"
              >
                x{{ card.duplicates }} double{{ card.duplicates > 1 ? 's' : '' }}
              </span>
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
const cards = ref([])
const series = ref([])
const rarities = ref([])
const loading = ref(true)

const filters = ref({
  search: '',
  seriesId: '',
  status: '',
})

// Enriched cards with series and rarity names
const enrichedCards = computed(() => {
  return cards.value.map(card => {
    const serie = series.value.find(s => s.id === card.seriesId)
    const rarity = rarities.value.find(r => r.id === card.rarityId)
    return {
      ...card,
      seriesName: serie?.name || '',
      rarityName: rarity?.name || '',
    }
  })
})

const filteredCards = computed(() => {
  let result = enrichedCards.value

  // Filter by search
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      c =>
        c.name.toLowerCase().includes(search) ||
        c.cardNumber.toLowerCase().includes(search)
    )
  }

  // Filter by series
  if (filters.value.seriesId) {
    result = result.filter(c => c.seriesId === filters.value.seriesId)
  }

  // Filter by status
  if (filters.value.status === 'duplicates') {
    result = result.filter(c => c.duplicates > 0)
  } else if (filters.value.status === 'wanted') {
    result = result.filter(c => c.status === 'wanted')
  }

  return result
})

const resetFilters = () => {
  filters.value = {
    search: '',
    seriesId: '',
    status: '',
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const [cardsResponse, seriesResponse, raritiesResponse] = await Promise.all([
      fetch('/data/cards.json'),
      fetch('/data/series.json'),
      fetch('/data/rarities.json'),
    ])
    cards.value = await cardsResponse.json()
    series.value = await seriesResponse.json()
    rarities.value = await raritiesResponse.json()
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
})
</script>
