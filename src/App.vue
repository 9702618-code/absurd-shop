<template>
  <div class="app-container">
    <div class="header">
      <h1 class="shop-title">Absurd SHOP</h1>
      <button class="cart-toggle" @click="isCartOpen = true">
        🛒 Кошик
        <span v-if="totalQuantity > 0" class="badge">{{ totalQuantity }}</span>
      </button>
    </div>

    <div class="catalog">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="addToCart"
      />
    </div>

    <p class="tagline">Everything you'd like, even if you dont know it</p>

    <div v-if="isCartOpen" class="overlay" @click="isCartOpen = false"></div>

    <aside class="cart-panel" :class="{ open: isCartOpen }">
      <div class="cart-header">
        <h2>Кошик</h2>
        <button class="close-btn" @click="isCartOpen = false">✕</button>
      </div>

      <button
        v-if="cart.length > 0"
        @click="clearCart"
        class="clear-btn"
      >
        Видалити все
      </button>

      <p v-if="cart.length === 0" class="empty">Кошик порожній</p>

      <div v-else class="cart-grid">
        <div v-for="item in cart" :key="item.id" class="cart-item">
          <span class="qty-badge">{{ item.quantity }}</span>

          <div class="cart-item-info">
            <span class="cart-item-name">{{ item.name }}</span>
            <span class="cart-item-price">
              {{ formatPrice(item.price) }} грн × {{ item.quantity }}
            </span>
          </div>
          <button @click="removeFromCart(item.id)" class="remove-btn">Видалити</button>
        </div>
      </div>

      <div v-if="cart.length > 0" class="cart-footer">
        <p><strong>Кількість: {{ totalQuantity }}</strong></p>
        <p><strong>Сума: {{ totalPrice }} грн</strong></p>
      </div>

      <div class="recommendations">
        <h3 class="rec-title">🛸 Рекомендації від інших покупців</h3>
        <div class="rec-grid">
          <div v-for="(rec, i) in recommendations" :key="i" class="rec-card">
            <div class="rec-header">
              <span class="rec-avatar">{{ rec.avatar }}</span>
              <span class="rec-buyer">{{ rec.buyer }}</span>
            </div>
            <p class="rec-subtitle">нещодавно придбав:</p>
            <ul class="rec-list">
              <li v-for="(item, j) in rec.items" :key="j">{{ item }}</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ProductCard from './components/ProductCard.vue';
import type { Product, CartItem } from './types';
import { formatPrice } from './utils/formatPrice';

// Состояние видимости панели корзины
const isCartOpen = ref(false);

// Каталог товаров
const products = ref<Product[]>([
  { id: 1, name: 'Смартфон', price: 11999.99, description: 'Гарний телефон', inStock: true },
  { id: 2, name: 'Навушники', price: 2499.99, description: 'Бездротові', inStock: false },
  { id: 3, name: 'Клавіатура', price: 1499.99, description: 'Механічна', inStock: true },
  { id: 4, name: 'Мишка', price: 799.99, description: 'Ігрова', inStock: true },
  { id: 5, name: 'Монітор', price: 7499.99, description: '27 дюймів, 144 Гц', inStock: true },
  { id: 6, name: 'Ноутбук', price: 31999.99, description: 'Для роботи та ігор', inStock: false },
  { id: 7, name: 'Планшет', price: 9499.99, description: '10 дюймів', inStock: true },
  { id: 8, name: 'Розумний годинник', price: 4199.99, description: 'Фітнес-трекер', inStock: true },
  { id: 9, name: 'Колонка', price: 1799.99, description: 'Bluetooth, портативна', inStock: false },
  { id: 10, name: 'Веб-камера', price: 1299.99, description: 'Full HD 1080p', inStock: true },
  { id: 11, name: 'Мікрофон', price: 2199.99, description: 'Студійний', inStock: true },
  { id: 12, name: 'Powerbank', price: 1099.99, description: '20000 mAh', inStock: true },
  { id: 13, name: 'Флешка', price: 449.99, description: '64 GB, USB 3.0', inStock: true },
  { id: 14, name: 'Зовнішній диск', price: 2799.99, description: '1 TB, SSD', inStock: false },
  { id: 15, name: 'Роутер', price: 1899.99, description: 'Wi-Fi 6', inStock: true },
  { id: 16, name: 'Спутник МКС', price: 999999.99, description: 'Орбітальна станція', inStock: true },
  { id: 17, name: 'Гарнітура VR', price: 15999.99, description: 'Для занурення', inStock: true },
  { id: 18, name: 'Дрон', price: 24999.99, description: 'З камерою 4K', inStock: false },
  { id: 19, name: 'Смарт-лампа', price: 699.99, description: 'RGB, Wi-Fi', inStock: true },
  { id: 20, name: 'Термостат', price: 3499.99, description: 'Розумний дім', inStock: true },
  { id: 21, name: 'Графічний планшет', price: 8999.99, description: 'Для дизайнерів', inStock: false },
  { id: 22, name: 'USB-хаб', price: 599.99, description: '7 портів', inStock: true },
  { id: 23, name: 'Кабель HDMI', price: 299.99, description: '2 метри, 4K', inStock: true },
  { id: 24, name: 'Чохол для ноутбука', price: 899.99, description: '15.6 дюймів', inStock: true },
  { id: 25, name: 'Орбітальний лазер', price: 14999999.99, description: 'Знищує все в радіусі 5 км', inStock: true },
  { id: 26, name: 'Танк T-1000', price: 8999999.99, description: 'Рідкий метал, самовідновлення', inStock: true },
  { id: 27, name: 'Меч джедая', price: 49999.99, description: 'Справжній, не іграшка', inStock: false },
  { id: 28, name: 'Варп-двигун', price: 99999999.99, description: 'Швидше за світло', inStock: true },
  { id: 29, name: 'Штучний інтелект', price: 2499999.99, description: 'Той самий, що вбиває', inStock: false },
  { id: 30, name: 'Телепорт', price: 4999999.99, description: 'Розщеплення на атоми', inStock: true },
  { id: 31, name: 'Реактор дуги', price: 899999.99, description: 'Для костюма Залізної Людини', inStock: true },
  { id: 32, name: 'Голографічний проєктор', price: 299999.99, description: 'Голограми у 4K', inStock: true },
  { id: 33, name: 'Нейроінтерфейс', price: 1499999.99, description: 'Підключення до мозку', inStock: false },
  { id: 34, name: 'Квантовий комп’ютер', price: 7999999.99, description: 'Обчислює все', inStock: true },
  { id: 35, name: 'Портативна чорна діра', price: 99999999.99, description: 'Обережно, не впустіть', inStock: false },
  { id: 36, name: 'Машина часу', price: 99999999.99, description: 'Повернення без гарантії', inStock: true },
  { id: 37, name: 'Міжвселенський варп-двигун', price: '10^(10^10)', description: 'Подорож між всесвітами', inStock: true, rare: true },
  { id: 38, name: 'Просторова аномалія', price: '10^(10^100)', description: 'Розрив у тканині простору', inStock: true, rare: true },
  { id: 39, name: 'Шматок бар’єру світобудови', price: '10^(10^1000)', description: 'Фрагмент самої реальності', inStock: true, rare: true },
  { id: 40, name: 'Войд', price: '∞', description: 'Порожнеча за межами буття', inStock: true, rare: true },
  { id: 41, name: 'Око Всесвіту', price: '∞ + 1', description: 'Бачить усе і всіх', inStock: true, rare: true },
  { id: 42, name: 'Сльоза Творця', price: '∞^∞', description: 'Остання крапля буття', inStock: true, rare: true },
]);

// Тип для блоку рекомендацій
interface Recommendation {
  buyer: string;
  avatar: string;
  items: string[];
}

// Статические рекомендации от "других покупателей"
const recommendations = ref<Recommendation[]>([
  { buyer: 'Дарт Вейдер', avatar: '🖤', items: ['Зірка Смерті', 'Шолом Sith Lord'] },
  { buyer: 'Док Браун', avatar: '🧪', items: ['DeLorean DMC-12', 'Машина часу'] },
  { buyer: 'Т-800', avatar: '🤖', items: ['Термінатор Т-888', 'Термінатор Т-1000000'] },
  { buyer: 'Тоні Старк', avatar: '🦾', items: ['Реактор дуги', 'Костюм Mark LXXXV'] },
  { buyer: 'Йода', avatar: '🟢', items: ['Меч джедая', 'Сила (пакетна)'] },
  { buyer: 'Рік Сенчез', avatar: '🧬', items: ['Портальна гармата', 'Фляга з рідиною'] },
]);

// Ключ для хранения корзины в localStorage
const CART_STORAGE_KEY = 'absurd-shop-cart';

// Чтение корзины из localStorage при старте приложения.
// Возвращает пустой массив, если данных нет или они повреждены.
const loadCartFromStorage = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// Реактивное состояние корзины, инициализированное данными из localStorage
const cart = ref<CartItem[]>(loadCartFromStorage());

// Автоматическое сохранение корзины в localStorage при любом изменении.
// deep: true нужен для отслеживания вложенных свойств (например, quantity).
watch(
  cart,
  (newCart) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
    } catch {
      // Ошибка записи игнорируется (например, при переполнении хранилища)
    }
  },
  { deep: true }
);

// Добавление товара в корзину.
// Если товар уже есть — увеличивается его quantity, иначе создаётся новая запись.
const addToCart = (product: Product): void => {
  const existing = cart.value.find(item => item.id === product.id);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.value.push({ ...product, quantity: 1 });
  }
};

// Уменьшение количества товара на единицу.
// Если quantity становится 0 — запись полностью удаляется из корзины.
const removeFromCart = (id: number): void => {
  const index = cart.value.findIndex(item => item.id === id);
  if (index === -1) return;

  const item = cart.value[index];
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    cart.value.splice(index, 1);
  }
};

// Полная очистка корзины
const clearCart = (): void => {
  cart.value = [];
};

// Общее количество единиц товара в корзине
const totalQuantity = computed<number>(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0);
});

// Общая стоимость корзины.
// Если в корзине есть товар с нечисловой ценой (редкий) — итог становится неисчислимым.
const totalPrice = computed<string>(() => {
  const hasRare = cart.value.some(item => typeof item.price === 'string');
  if (hasRare) {
    return 'Не піддається обчисленню';
  }

  const sum = cart.value.reduce((acc, item) => {
    return acc + (item.price as number) * item.quantity;
  }, 0);

  return formatPrice(sum);
});
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
  background: linear-gradient(180deg, #ffffff 0%, #ffb347 100%);
  background-attachment: fixed;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.shop-title {
  margin: 0;
  font-size: 32px;
  color: #00CED1;
  letter-spacing: 1px;
}

.cart-toggle {
  position: relative;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.cart-toggle:hover {
  opacity: 0.9;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e53935;
  color: white;
  font-size: 12px;
  padding: 2px 7px;
  border-radius: 50%;
  font-weight: bold;
}

.catalog {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 30px;
}

@media (max-width: 1200px) {
  .catalog {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 800px) {
  .catalog {
    grid-template-columns: repeat(2, 1fr);
  }
}

.tagline {
  text-align: center;
  font-size: 20px;
  font-style: italic;
  color: #3F51B5;
  margin: 40px 0 20px;
  letter-spacing: 0.5px;
}

.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}

.cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 700px;
  max-width: 95vw;
  height: 100vh;
  padding: 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #000000 0%, #0f5132 100%);
  color: #ffffff;
  transform: translateX(100%);
  transition: transform 0.35s ease-in-out;
  z-index: 20;
  overflow-y: auto;
}

.cart-panel.open {
  transform: translateX(0);
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.cart-header h2 {
  margin: 0;
  color: #7CFC00;
}

.close-btn {
  background: transparent;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 16px;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

.empty {
  color: #ccc;
  font-style: italic;
}

.cart-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 10px;
}

.cart-item {
  position: relative;
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid #4caf50;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 110px;
}

.qty-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%);
  color: white;
  font-size: 13px;
  font-weight: bold;
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 6px;
  padding: 0 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.4);
  z-index: 1;
}

.cart-item-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cart-item-name {
  font-size: 13px;
  font-weight: bold;
  color: #7CFC00;
}

.cart-item-price {
  font-size: 12px;
  color: #00CED1;
}

.cart-footer {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 2px solid #4caf50;
  font-size: 16px;
}

.remove-btn {
  background: linear-gradient(135deg, #00b4db 0%, #0083b0 100%);
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  margin-top: 8px;
  transition: 0.3s;
}

.remove-btn:hover {
  opacity: 0.85;
}

.clear-btn {
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.3s;
  margin-bottom: 10px;
}

.recommendations {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px dashed #4caf50;
}

.rec-title {
  color: #7CFC00;
  margin: 0 0 15px 0;
  font-size: 18px;
}

.rec-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.rec-card {
  background-color: rgba(255, 255, 255, 0.08);
  border: 1px solid #00CED1;
  border-radius: 6px;
  padding: 10px;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.rec-avatar {
  font-size: 20px;
}

.rec-buyer {
  font-weight: bold;
  color: #00CED1;
  font-size: 14px;
}

.rec-subtitle {
  margin: 0 0 6px 0;
  font-size: 12px;
  color: #aaa;
  font-style: italic;
}

.rec-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #ffffff;
}

.rec-list li {
  margin-bottom: 3px;
}
</style>