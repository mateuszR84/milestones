<script setup lang="ts">
defineEmits<{ zoomIn: []; zoomOut: [] }>()
</script>

<template>
  <div class="absolute left-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-2">
    <button
      class="flex h-9 w-9 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50"
      aria-label="Przybliż"
      @click="$emit('zoomIn')"
    >
      +
    </button>
    <button
      class="flex h-9 w-9 items-center justify-center rounded border border-neutral-300 bg-white text-neutral-700 shadow-sm hover:bg-neutral-50"
      aria-label="Oddal"
      @click="$emit('zoomOut')"
    >
      &minus;
    </button>
  </div>
</template>
