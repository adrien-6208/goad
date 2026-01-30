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

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          <!-- Rarity filter -->
          <div>
            <label for="rarity" class="block text-sm font-medium text-gray-300 mb-2">
              Rareté
            </label>
            <select
              id="rarity"
              v-model="filters.rarityId"
              class="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toutes les raretés</option>
              <option v-for="rarity in rarities" :key="rarity.id" :value="rarity.id">
                {{ rarity.name }}
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
              <option value="">Tous les statuts</option>
              <option value="acquired">✅ Acquises</option>
              <option value="wanted">🔍 Recherchées</option>
              <option value="both">⭐ Les deux</option>
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
              <p class="text-sm font-semibold text-white line-clamp-3 mb-2">{{ card.name }}</p>
              <p v-if="card.seriesName" class="text-xs text-gray-400 line-clamp-2">
                📦 {{ card.seriesName }}
              </p>
              <p v-if="card.rarityName" class="text-xs text-gray-400">
                💎 {{ card.rarityName }}
              </p>
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
  rarityId: '',
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

  // Filter by rarity
  if (filters.value.rarityId) {
    result = result.filter(c => c.rarityId === filters.value.rarityId)
  }

  // Filter by status
  if (filters.value.status) {
    result = result.filter(c => c.status === filters.value.status)
  }

  return result
})

const getStatusIcon = (status) => {
  const icons = {
    acquired: '✅',
    wanted: '🔍',
    both: '⭐',
  }
  return icons[status]
}

const resetFilters = () => {
  filters.value = {
    search: '',
    seriesId: '',
    rarityId: '',
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
