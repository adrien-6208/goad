<template>
    <div
    class="absolute window-border bg-[#C0C0C0] w-fit h-fit"
    :style="{ top: `${position.y}px`, left: `${position.x}px`, zIndex: zIndex }"
    ref="windowRef"
    >
      <!-- Title Bar -->
      <div
        class="bg-[#000080] text-white flex justify-between items-center px-2 h-6 cursor-move text-xs font-bold title-bar"
        @mousedown="startDrag"
      >
        <slot name="title">Fenêtre</slot>
        <div class="flex items-center gap-1">
          <button @click="onMinimize" class="btn-sys text-black">_</button>
          <button @click="onClose" class="btn-sys text-black">X</button>
        </div>
      </div>
  
      <!-- Window Content -->
      <div class="p-3 text-sm font-sans text-black">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const emit = defineEmits(['close', 'minimize', 'focus', 'update:position'])
  
  const props = defineProps({
    position: {
      type: Object,
      required: true
    }
  })
  
  const windowRef = ref(null)
  const zIndex = ref(Date.now())
  
  function bringToFront() {
    zIndex.value = Date.now()
    emit('focus')
  }
  
  function onClose() {
    emit('close')
  }
  
  function onMinimize() {
    emit('minimize')
  }
  
  // Drag logic
  let offset = { x: 0, y: 0 }
  let dragging = false
  
  function startDrag(e) {
    bringToFront()
    dragging = true
    offset.x = e.clientX - props.position.x
    offset.y = e.clientY - props.position.y
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }
  
  function onDrag(e) {
    if (!dragging) return
  
    const el = windowRef.value
    const winW = window.innerWidth
    const winH = window.innerHeight
    const w = el.offsetWidth
    const h = el.offsetHeight
  
    let x = e.clientX - offset.x
    let y = e.clientY - offset.y
  
    x = Math.max(0, Math.min(x, winW - w))
    y = Math.max(0, Math.min(y, winH - h - 40)) // -40 pour la barre des tâches
  
    emit('update:position', { x, y })
  }
  
  function stopDrag() {
    dragging = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
  }
  </script>
  
  <style scoped>
  * {
    font-family: 'Tahoma', sans-serif;
    user-select: none;
  }
  
  /* Bordure effet relief rétro */
  .window-border {
    border: 2px solid #fff;
    box-shadow:
      inset -1px -1px 0 #000,
      inset 1px 1px 0 #808080,
      inset -2px -2px 0 #c0c0c0,
      inset 2px 2px 0 #404040,
      4px 4px 0 #000;
  }
  
  /* Bandeau titre style Win98 */
  .title-bar {
    border-bottom: 2px solid #000;
  }
  
  /* Boutons système */
  .btn-sys {
    width: 20px;
    height: 16px;
    font-size: 12px;
    line-height: 12px;
    background: #c0c0c0;
    border: 1px solid #808080;
    box-shadow: inset -1px -1px 0 #fff, inset 1px 1px 0 #404040;
    padding: 0;
  }
  </style>
  