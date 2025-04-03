<template>
    <div class="minesweeper-window">
      <!-- Header -->
      <div class="top-bar">
        <div class="led-counter">{{ remainingMines }}</div>
        <button class="smiley" @click="resetGame">{{ face }}</button>
        <div class="led-counter">{{ elapsedTime }}</div>
      </div>
  
      <!-- Grid -->
      <div class="grid" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
        <div
          v-for="(cell, index) in grid"
          :key="index"
          class="cell"
          :class="cellClasses(cell)"
          @click="reveal(index)"
          @contextmenu.prevent="toggleFlag(index)"
        >
          <span v-if="cell.flagged && !cell.revealed">🚩</span>
          <span v-else-if="cell.revealed && cell.mine">💣</span>
          <span
            v-else-if="cell.revealed && cell.adj > 0"
            :class="numberColor(cell.adj)"
          >
            {{ cell.adj }}
          </span>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
  
  const rows = 8
  const cols = 8
  const mineTotal = 10
  let timer = null
  
  const grid = reactive([])
  const face = ref('🙂')
  const elapsedTime = ref(0)
  const remainingMines = ref(mineTotal)
  const gameOver = ref(false)
  const gameWon = ref(false)
  
  function initGrid() {
    grid.length = 0
    for (let i = 0; i < rows * cols; i++) {
      grid.push({
        revealed: false,
        flagged: false,
        mine: false,
        adj: 0,
      })
    }
  
    // Place mines
    let placed = 0
    while (placed < mineTotal) {
      const i = Math.floor(Math.random() * grid.length)
      if (!grid[i].mine) {
        grid[i].mine = true
        placed++
      }
    }
  
    // Calculate adjacent counts
    for (let i = 0; i < grid.length; i++) {
      const adj = getAdjacent(i).filter(j => grid[j].mine).length
      grid[i].adj = adj
    }
  
    face.value = '🙂'
    gameOver.value = false
    gameWon.value = false
    elapsedTime.value = 0
    remainingMines.value = mineTotal
  
    clearInterval(timer)
    timer = setInterval(() => elapsedTime.value++, 1000)
  }
  
  function getAdjacent(index) {
    const row = Math.floor(index / cols)
    const col = index % cols
    const adj = []
  
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue
        const r = row + dr
        const c = col + dc
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          adj.push(r * cols + c)
        }
      }
    }
    return adj
  }
  
  function reveal(index) {
    const cell = grid[index]
    if (cell.revealed || cell.flagged || gameOver.value) return
  
    cell.revealed = true
  
    if (cell.mine) {
      face.value = '😵'
      gameOver.value = true
      grid.forEach(c => (c.revealed = true))
      clearInterval(timer)
      return
    }
  
    if (cell.adj === 0) {
      getAdjacent(index).forEach(reveal)
    }
  
    checkWin()
  }
  
  function toggleFlag(index) {
    const cell = grid[index]
    if (cell.revealed || gameOver.value) return
  
    cell.flagged = !cell.flagged
    remainingMines.value += cell.flagged ? -1 : 1
  }
  
  function checkWin() {
    if (grid.every(c => c.revealed || (c.mine && !c.revealed))) {
      face.value = '😎'
      gameWon.value = true
      clearInterval(timer)
    }
  }
  
  function resetGame() {
    initGrid()
  }
  
  function cellClasses(cell) {
    return {
      revealed: cell.revealed,
      mine: cell.revealed && cell.mine,
    }
  }
  
  function numberColor(n) {
    return `num-${n}`
  }
  
  onMounted(() => {
    initGrid()
  })
  
  onBeforeUnmount(() => {
    clearInterval(timer)
  })
  </script>
  
  <style scoped>
  .minesweeper-window {
    width: fit-content;
    border: 2px solid #808080;
    padding: 5px;
    background-color: #c0c0c0;
  }
  
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #bfbfbf;
    padding: 2px 6px;
    margin-bottom: 6px;
    border: inset 2px #fff;
  }
  
  .led-counter {
    background: black;
    color: red;
    font-family: monospace;
    font-size: 16px;
    padding: 2px 6px;
    border: inset 2px #fff;
    min-width: 40px;
    text-align: center;
  }
  
  .smiley {
    font-size: 18px;
    background: #c0c0c0;
    border: outset 2px #fff;
    cursor: pointer;
  }
  
  .grid {
    display: grid;
    gap: 2px;
    background: #808080;
    padding: 2px;
  }
  
  .cell {
    width: 24px;
    height: 24px;
    border: outset 2px #fff;
    background: #c0c0c0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }
  
  .cell.revealed {
    border: inset 2px #fff;
    background: #e0e0e0;
  }
  
  .num-1 {
    color: blue;
  }
  .num-2 {
    color: green;
  }
  .num-3 {
    color: red;
  }
  .num-4 {
    color: navy;
  }
  .num-5 {
    color: maroon;
  }
  .num-6 {
    color: teal;
  }
  .num-7 {
    color: black;
  }
  .num-8 {
    color: gray;
  }
  </style>
  