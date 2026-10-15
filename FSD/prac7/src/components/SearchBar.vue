<script setup>
defineProps({ query: { type: String, default: '' }, locating: { type: Boolean, default: false } })
defineEmits(['update:query', 'search', 'locate'])
</script>

<template>
  <div class="search-panel">
    <div class="search-row"><span class="search-icon">⌕</span><input v-focus :value="query" type="search" placeholder="Search by PG name, area or city..." aria-label="Search PGs" @input="$emit('update:query', $event.target.value)" @keyup.enter="$emit('search')" /><button class="primary-button" @click="$emit('search')">Search</button></div>
    <div class="search-divider"><span>or</span><button class="outline-button" :disabled="locating" @click="$emit('locate')">⌖ {{ locating ? 'Locating...' : 'Use My Location' }}</button></div>
  </div>
</template>
