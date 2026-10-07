<script setup>
import { labels } from '../data/properties'

defineProps({
  property: { type: Object, required: true },
  favorite: { type: Boolean, default: false },
  ownerMode: { type: Boolean, default: false }
})

defineEmits(['toggle-favorite', 'edit', 'delete', 'view'])

const money = (value) => Number(value || 0).toLocaleString('en-IN')
</script>

<template>
  <article class="property-card">
    <div class="property-image">
      <img v-if="property.image" :src="property.image" :alt="property.propertyName" loading="lazy" />
      <div v-else class="image-placeholder">⌂</div>
      <button v-if="!ownerMode" class="heart-button" :class="{ liked: favorite }" :aria-label="favorite ? 'Remove from wishlist' : 'Add to wishlist'" @click="$emit('toggle-favorite', property.id)">{{ favorite ? '♥' : '♡' }}</button>
      <span class="status-badge" :class="`status-${property.availability}`">{{ labels.status[property.availability] || 'Available' }}</span>
    </div>
    <div class="property-body">
      <div class="property-heading"><h3>{{ property.propertyName }}</h3><span class="tag">{{ labels.gender[property.gender] || 'Unisex' }}</span></div>
      <p class="location">⌖ {{ property.location }}, {{ property.city }}</p>
      <div class="property-meta"><span>{{ labels.room[property.roomType] || property.roomType }}</span><span>{{ property.availableRooms || 0 }} rooms left</span></div>
      <p class="description">{{ property.description }}</p>
      <div class="property-footer"><strong>₹{{ money(property.monthlyRent) }} <small>/ month</small></strong><button v-if="!ownerMode" class="text-button" @click="$emit('view', property)">View details</button><div v-else class="card-actions"><button class="icon-button" title="Edit property" @click="$emit('edit', property.id)">✎</button><button class="icon-button danger" title="Delete property" @click="$emit('delete', property.id)">×</button></div></div>
    </div>
  </article>
</template>
