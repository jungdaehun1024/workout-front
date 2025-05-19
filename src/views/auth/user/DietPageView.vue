<template>
  <div class="meal-tracker">
    <!-- 요일 선택 -->
    <div class="weekdays">
      <div
        v-for="(day, index) in days"
        :key="day.label"
        class="weekday"
        :class="{ selected: day.selected }"
        @click="toggleDay(index)"
      >
        <div class="circle">
          <span v-if="day.selected">✔</span>
        </div>
        <div class="label">{{ day.label }}</div>
      </div>
    </div>

    <!-- 식사 리스트 -->
    <div class="meals">
      <div
        class="meal"
        v-for="meal in mealTypes"
        :key="meal"
      >
        <div class="meal-label">
          <span>{{ meal }}</span>
        </div>
        <button class="add-btn">+</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const days = ref([
  { label: '월', selected: false },
  { label: '화', selected: false },
  { label: '수', selected: false },
  { label: '목', selected: false },
  { label: '금', selected: false },
  { label: '토', selected: false },
  { label: '일', selected: false }
])

const toggleDay = (index) => {
  days.value[index].selected = !days.value[index].selected
}
const mealTypes = ['아침 식사', '점심 식사', '저녁 식사', '간식 / 기타']
</script>

<style lang="scss" scoped>
.meal-tracker {
  background-color: #0e0e0e;
  color: #ffffff;
  padding: 1rem;
  min-height: 100vh;
  font-family: sans-serif;
}

.weekdays {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  .weekday {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
      font-size: 12px;
    }

    &.selected .circle {
      background-color: #00c853;
      border-color: #00c853;
    }

    .label {
      font-size: 12px;
    }
  }
}

.meals {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  .meal {
    background-color: #1e1e1e;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .meal-label {
      font-size: 16px;
    }

    .add-btn {
      background-color: #00c853;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }
  }
}
</style>
