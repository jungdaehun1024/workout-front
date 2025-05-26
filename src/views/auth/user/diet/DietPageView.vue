<template>
  <div class="meal-tracker">

    <!-- 요일 선택 헤더 -->
    <div class="day-header">
      <div
        v-for="(day, index) in days"
        :key="index"
        class="day-circle"
        :class="{ selected: day.selected }"
        @click="selectDay(day.label)"
      >
        <div class="check-icon">
          <span v-if="day.selected"></span>
        </div>
        <div class="day-label">{{ day.label }}</div>
      </div>
    </div>

    <!-- 식사 블럭 -->
    <div v-for="meal in mealTypes" :key="meal" class="meal-block">
      <div class="meal-header">
        <div class="meal-info" @click="toggleMeal(meal)">
          <div class="meal-name">{{ meal }}</div>
          <div class="meal-kcal">{{ getTotalCalories(meal) }} kcal</div>
        </div>
        <div class="header-actions">
          <span class="toggle-arrow" @click="toggleMeal(meal)">
            {{ mealExpanded[meal] ? '▲' : '▼' }}
          </span>
        </div>
      </div>

      <div v-if="mealExpanded[meal]" class="meal-content">
        <div class="meal-records">
          <div
            v-for="(food, idx) in mealRecords[meal]"
            :key="idx"
            class="food-item"
          >
            <div class="food-name">{{ food.name }}</div>
            <div class="food-desc">{{ food.amount }}</div>
            <div class="food-cal">{{ food.kcal }} kcal</div>
          </div>
        </div>

        <div class="add-btn-wrapper">
          <button class="add-btn" @click="mvFoodSearchPage(meal)">+</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()
const today = dayjs().format("YYYY-MM-DD"); // 오늘 
const weeklyFoodInfo  = ref([]);

const mealRecords = ref({
  "아침 식사" : [],
  "점심 식사" : [],
  "저녁 식사": [],
  "간식/기타" : []
});

onMounted(async()=>{
  console.log("[DietPageView]onMounted");
  try{
    const response =await axios.get("/api/getMyDiet",{withCredentials : true}); // 이번 주 음식 데이터 전부 가져옴
    weeklyFoodInfo.value  = response.data.data;
    weeklyFoodInfo.value.forEach((item)=>{
      console.log(item.foodRecordedDate)
      if(item.foodRecordedDate === today){
        console.log(item.foodName);
       
      }
    })
    // mealRecords.value['아침 식사'].push()
  }catch(err){
    console.log(err.message);
  }
  })



// 요일 정보
const days = ref([
  { label: '월', selected: false },
  { label: '화', selected: false },
  { label: '수', selected: false },
  { label: '목', selected: false },
  { label: '금', selected: false },
  { label: '토', selected: false },
  { label: '일', selected: false }
])

const selectDay = (label) => {
  days.value.forEach(day => {
    day.selected = day.label === label
  })
}

const mvFoodSearchPage = (meal) => {
  localStorage.setItem('dietCategory', meal)
  router.push('/auth/diet/foodSearchPage')
}

const mealTypes = ['아침 식사', '점심 식사', '저녁 식사', '간식/기타']

const mealExpanded = ref({
  '아침 식사': false,
  '점심 식사': false,
  '저녁 식사': false,
  '간식/기타': false
})

const toggleMeal = (meal) => {
  mealExpanded.value[meal] = !mealExpanded.value[meal]
}

// const mealRecords = {
//   '아침 식사': [],
//   '점심 식사': [
//     // { name: 'Tuna in Water (Canned)', amount: '100g', kcal: 116 },
//     // { name: 'Taco Bell Avocado Ranch', amount: '2 tbsp, 29g', kcal: 110 }
//   ],
//   '저녁 식사': [],
//   '간식/기타': []
// }

const getTotalCalories = (meal) => {
  return mealRecords[meal]?.reduce((sum, item) => sum + item.kcal, 0) || 0
}
</script>

<style lang="scss" scoped>
.meal-tracker {
  background-color: #0e0e0e;
  color: #ffffff;
  padding: 1rem;
  min-height: 100vh;
  font-family: sans-serif;
}

.day-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  .day-circle {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    .check-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #2a2a2a;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #00c853;
      font-size: 18px;
      margin-bottom: 4px;
    }

    &.selected .check-icon {
      background-color: #00c853;
      color: #0e0e0e;
    }

    .day-label {
      font-size: 12px;
      color: #ccc;
    }
  }
}

.meal-block {
  background: #1e1e1e;
  margin-bottom: 1rem;
  border-radius: 10px;
  overflow: hidden;
}

.meal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #2c2c2c;
}

.meal-info {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.meal-name {
  font-weight: bold;
  font-size: 16px;
}

.meal-kcal {
  font-size: 12px;
  color: #ccc;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-arrow {
  font-size: 14px;
  color: #ccc;
  cursor: pointer;
}

.meal-content {
  background: #1e1e1e;
  padding: 0.5rem 1rem 1rem;
}

.meal-records {
  margin-bottom: 0.5rem;
}

.food-item {
  border-bottom: 1px solid #333;
  padding: 0.5rem 0;
}

.food-name {
  font-weight: bold;
}

.food-desc {
  font-size: 12px;
  color: #999;
}

.food-cal {
  font-size: 14px;
  color: #00c853;
}

.add-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.5rem;
}

.add-btn {
  background: #00c853;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
}
</style>
