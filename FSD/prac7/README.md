# PG Finder - Vue.js

## Practical
FSD Practical 7

## Technologies
- Vue.js 3
- Vite
- JavaScript
- HTML and CSS

## Features
- Reactive PG and hostel search by name, locality, city, room type, and rent
- Gender filtering, sorting, recent searches, wishlist, and theme toggle
- Reusable property cards with property details
- Owner dashboard with statistics, search, status filtering, edit, and delete
- Add and edit property form with `v-model`, validation, facilities, and localStorage
- Location permission support for the student search page

## Vue Concepts Demonstrated
- `Navbar`, `SearchBar`, and `PropertyCard` are reusable components.
- Props pass property data and UI state from `App.vue` to child components.
- Emits handle wishlist, navigation, edit, delete, and view actions from children.
- `ref()` stores mutable UI state such as search text, properties, filters, and form data.
- `computed()` creates `filteredProperties` and dashboard statistics.
- `v-if` / `v-else` render page sections and empty states conditionally.
- `v-for` renders property cards, recent searches, and facility options.
- `v-model` powers search, filters, and the add-property form.
- `v-bind` binds images, classes, labels, and component props.
- Vue event handling uses `@click`, `@input`, `@change`, and `@submit.prevent`.

## Prac 5 Mapping
- `search.js` became reactive search, filtering, wishlist, recent searches, theme, and location state in `App.vue`.
- The Prac 5 property card template became `src/components/PropertyCard.vue`.
- `dashboard.js` became the dashboard section with computed statistics and owner actions.
- `add-property.js` became the form section with Vue `v-model` bindings.
- The six Prac 5 sample PG records are kept in `src/data/properties.js`.
- The existing `properties`, `wishlist`, `recentSearches`, and `theme` localStorage keys remain compatible.

## How to Run
```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The app is frontend-only and stores property changes in browser localStorage.
