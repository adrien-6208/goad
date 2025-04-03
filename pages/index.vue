<template>
  <main class="min-h-screen bg-[#008080] text-black font-sans relative overflow-hidden">
    <!-- Desktop Icons -->
    <div class="absolute top-4 left-4 space-y-6 text-sm">
      <div class="flex flex-col items-center cursor-pointer">
        <img src="/icons/my-computer.png" alt="Poste de travail" class="w-10 h-10" />
        <span>Poste de travail</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer">
        <img src="/icons/my-documents.png" alt="Mes documents" class="w-10 h-10" />
        <span>Mes documents</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer">
        <img src="/icons/internet-explorer.png" alt="Internet Explorer" class="w-10 h-10" />
        <span>Internet Explorer</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer">
        <img src="/icons/network.png" alt="Voisinage réseau" class="w-10 h-10" />
        <span>Voisinage réseau</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer">
        <img src="/icons/recycle-bin.png" alt="Corbeille" class="w-10 h-10" />
        <span>Corbeille</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer" @click="toggleNotepad">
        <img src="/icons/wordpad.png" alt="Poste de travail" class="w-10 h-10" />
        <span>MyProject.txt</span>
      </div>
      <div class="flex flex-col items-center cursor-pointer" @click="toggleMinesweeper">
        <img src="/icons/minesweeper.png" alt="Démineur" class="w-10 h-10" />
        <span>Démineur</span>
      </div>
    </div>

    <!-- Notepad Window -->
    <RetroWindow
      v-if="showNotepad && !isMinimized"
      v-model:position="notepadPosition"
      @close="closeNotepad"
      @minimize="minimizeNotepad"
    >
      <template #title>Bloc-notes - DevClicker.txt</template>

      <div class="p-4">
        <p class="text-sm">Lignes de code : <strong>{{ lines }}</strong></p>
        <button @click="lines++" class="mt-4 bg-white border border-gray-400 px-3 py-2 hover:bg-gray-200">
          💻 Coder une ligne
        </button>
      </div>
    </RetroWindow>

    <RetroWindow
      v-if="showMinesweeper && !isMinesweeperMinimized"
      v-model:position="minesweeperPosition"
      @close="closeMinesweeper"
      @minimize="minimizeMinesweeper"
    >
      <template #title>Minesweeper</template>
      <Minesweeper />
    </RetroWindow>





    <!-- Taskbar -->
    <div class="fixed bottom-0 left-0 right-0 bg-gray-300 h-10 flex items-center justify-between px-2 text-sm border-t border-gray-400">
      <div class="flex items-center gap-1">
        <button class="bg-gray-200 border border-gray-400 px-2 py-1 flex items-center space-x-1">
          <img src="/icons/start.png" alt="Start" class="w-4 h-4" />
          <span>Démarrer</span>
        </button>
        <button
          v-if="showNotepad"
          @click="toggleMinimizeNotepad"
          :class="[
            isMinimized ? 'bg-gray-300 text-black' : 'bg-white',
            'border border-gray-400 px-2 py-1 hover:bg-gray-200'
          ]"
        >
          Bloc-notes - DevClicker.txt
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <img src="/icons/sound.png" alt="Sound" class="w-4 h-4" />
        <img src="/icons/network.png" alt="Network" class="w-4 h-4" />
        <span>{{ currentTime }}</span>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Minesweeper state
const showMinesweeper = ref(false)
const isMinesweeperMinimized = ref(false)
const minesweeperPosition = ref({ x: 300, y: 100 })

const toggleMinesweeper = () => {
  if (!showMinesweeper.value) {
    showMinesweeper.value = true
    isMinesweeperMinimized.value = false
  } else {
    isMinesweeperMinimized.value = !isMinesweeperMinimized.value
  }
}

const toggleMinimizeMinesweeper = () => {
  if (!showMinesweeper.value) {
    showMinesweeper.value = true
    isMinesweeperMinimized.value = false
  } else {
    isMinesweeperMinimized.value = !isMinesweeperMinimized.value
  }
}

const closeMinesweeper = () => {
  isMinesweeperMinimized.value = false
  showMinesweeper.value = false
}

const minimizeMinesweeper = () => {
  isMinesweeperMinimized.value = true
}

// Horloge dynamique
const currentTime = ref('')
const notepadPosition = ref({ x: 160, y: 80 })
function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

onMounted(() => {
  updateClock()
  setInterval(updateClock, 1000)
})

// Notepad window state
const showNotepad = ref(false)
const isMinimized = ref(false)
const lines = ref(0)
const notepadZ = ref(10)

// Gestion de l'icône du bureau
const toggleNotepad = () => {
  if (!showNotepad.value) {
    showNotepad.value = true
    isMinimized.value = false
  } else {
    isMinimized.value = !isMinimized.value
  }
  bringToFront()
}

// Gestion de la barre des tâches
const toggleMinimizeNotepad = () => {
  if (!showNotepad.value) {
    showNotepad.value = true
    isMinimized.value = false
  } else {
    isMinimized.value = !isMinimized.value
  }
  bringToFront()
}

// Bouton minimiser
const minimizeNotepad = () => {
  isMinimized.value = true
}

// Bouton fermer
const closeNotepad = () => {
  isMinimized.value = false
  showNotepad.value = false
}

// Focus fenêtre au-dessus
function bringToFront() {
  notepadZ.value = Date.now()
}

// Drag logic
const notepadRef = ref(null)
const position = ref({ x: 160, y: 80 })
let offset = { x: 0, y: 0 }
let dragging = false

function startDrag(e) {
  bringToFront()
  dragging = true
  offset.x = e.clientX - position.value.x
  offset.y = e.clientY - position.value.y
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e) {
  if (!dragging) return
  const el = notepadRef.value
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const elWidth = el.offsetWidth
  const elHeight = el.offsetHeight

  let newX = e.clientX - offset.x
  let newY = e.clientY - offset.y

  newX = Math.max(0, Math.min(newX, windowWidth - elWidth))
  newY = Math.max(0, Math.min(newY, windowHeight - elHeight - 40)) // évite la barre des tâches

  position.value.x = newX
  position.value.y = newY
}

function stopDrag() {
  dragging = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Tahoma&display=swap');

* {
  font-family: 'Tahoma', sans-serif;
  user-select: none;
}
</style>
