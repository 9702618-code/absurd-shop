<template>
  <div 
    class="card" 
    :class="{ 'out-of-stock': !product.inStock, 'rare': product.rare }"
  >
    <h3>{{ product.name }}</h3>
    <p class="desc">{{ product.description }}</p>
    <p class="price">Ціна: {{ formatPrice(product.price) }} грн</p>

    <p v-if="!product.inStock" class="status">Немає в наявності</p>

    <button
      :disabled="!product.inStock"
      @click="$emit('add-to-cart', product)"
      class="add-btn"
    >
      Додати до кошика
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '../types';
import { formatPrice } from '../utils/formatPrice';

defineProps<{
  product: Product;
}>();

defineEmits<{
  (e: 'add-to-cart', product: Product): void;
}>();
</script>

<style scoped>
.card {
  background-color: #ffffff;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 8px;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 13px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

.card:hover {
  animation: shake 0.18s linear infinite;
  z-index: 5;
}

@keyframes shake {
  0%   { transform: translate(0, 0) rotate(0deg) scale(1); }
  10%  { transform: translate(-6px, 3px) rotate(-3deg) scale(1.03); }
  20%  { transform: translate(6px, -3px) rotate(3deg) scale(1.03); }
  30%  { transform: translate(-7px, -2px) rotate(-4deg) scale(1.04); }
  40%  { transform: translate(7px, 3px) rotate(4deg) scale(1.04); }
  50%  { transform: translate(-5px, 5px) rotate(-3deg) scale(1.03); }
  60%  { transform: translate(5px, -5px) rotate(3deg) scale(1.03); }
  70%  { transform: translate(-4px, 2px) rotate(-2deg) scale(1.02); }
  80%  { transform: translate(4px, -2px) rotate(2deg) scale(1.02); }
  90%  { transform: translate(-2px, 1px) rotate(-1deg) scale(1.01); }
  100% { transform: translate(0, 0) rotate(0deg) scale(1); }
}

.card h3 {
  margin: 0 0 6px;
  font-size: 15px;
  color: #00CED1;
}

.desc {
  margin: 0 0 6px;
  color: #555;
  font-size: 12px;
  min-height: 30px;
}

.out-of-stock {
  background-color: #ececec;
  color: #888;
  opacity: 0.7;
}

.price {
  font-weight: bold;
  margin: 0 0 6px;
  color: #3F51B5;
}

.status {
  color: #c00;
  font-size: 12px;
  margin: 0 0 6px;
}

.add-btn {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  margin-top: auto;
  transition: 0.3s;
}

.add-btn:hover:not(:disabled) {
  background-color: #b71c1c;
}

.add-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* === Редкие карточки (за гранью реальности) === */
.card.rare {
  background-color: #e6d9f7;
  border: 1px solid #b39ddb;
  box-shadow: 0 2px 10px rgba(179, 157, 219, 0.5);
}

.card.rare h3 {
  color: #4a148c;
}

.card.rare .desc {
  color: #5e35b1;
}

.card.rare .price {
  color: #311b92;
}

.card.rare .add-btn {
  background-color: #f8bbd0;
  color: #4a148c;
  font-weight: bold;
}

.card.rare .add-btn:hover:not(:disabled) {
  background-color: #f48fb1;
}
</style>