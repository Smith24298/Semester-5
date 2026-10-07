<script setup>
defineProps({
  view: { type: String, required: true },
  wishlistCount: { type: Number, default: 0 },
  dark: { type: Boolean, default: false }
})

defineEmits(['navigate', 'toggle-theme'])
</script>

<template>
  <header class="site-nav">
    <div class="nav-inner">
      <button class="brand" @click="$emit('navigate', 'home')"><span class="brand-mark">⌂</span> PG Finder</button>
      <nav class="nav-links" aria-label="Main navigation">
        <button :class="{ active: view === 'home' || view === 'search' }" @click="$emit('navigate', 'search')">Search PG</button>
        <button :class="{ active: view === 'wishlist' }" @click="$emit('navigate', 'wishlist')">Wishlist <span v-if="wishlistCount" class="count">{{ wishlistCount }}</span></button>
        <button :class="{ active: view === 'dashboard' }" @click="$emit('navigate', 'dashboard')">Dashboard</button>
        <button :class="{ active: view === 'add' || view === 'edit' }" @click="$emit('navigate', 'add')">Add Property</button>
        <button class="theme-button" aria-label="Toggle theme" @click="$emit('toggle-theme')">{{ dark ? '☀' : '☾' }}</button>
      </nav>
    </div>
  </header>
</template>
