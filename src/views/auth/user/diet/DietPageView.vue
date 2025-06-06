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

    <!--일일 총 칼로리 섭취량-->
    <div class ="total-header">
      <div v-for="(item,index) in totalDailyKcal" :key="index" class="nutrition-category">
        {{ index }}
        <div class="nutrition-amount">
          {{ item }}
        </div>
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
            @click="getFoodDetailRequset(food)"
          >
            <div class="food-name">{{ food.foodName }}</div>
            <div class="food-desc">{{ food.foodWeight }}g</div>
             <div class="food-nutrition">     
                <div class="food-desc1">탄수화물:{{ food.foodCarbo }}</div> 
                <div class="food-desc1">단백질:{{ food.foodProtein }}</div>
                <div class="food-desc1">지방:{{ food.foodFat }}</div>
            </div> 
            <div class="food-cal">{{ food.foodKcal }}kcal</div>
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
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek);

// 요일 정보
const days = ref([
  { label: '월', dayNum: 1,dateTime:'',selected: false},
  { label: '화', dayNum: 2,dateTime:'',selected: false},
  { label: '수', dayNum: 3,dateTime:'',selected: false},
  { label: '목', dayNum: 4,dateTime:'',selected: false},
  { label: '금', dayNum: 5,dateTime:'',selected: false },
  { label: '토', dayNum: 6,dateTime:'',selected: false },
  { label: '일', dayNum: 7,dateTime:'',selected: false }
]);

const mealRecords = ref({
  "아침 식사" : [],
  "점심 식사" : [],
  "저녁 식사": [],
  "간식/기타" : []
});

const totalDailyKcal = ref({
  "칼로리":0,
  "탄수화물":0,
  "단백질": 0,
  "지방":0
})

const thisWeekDates = []; //"이번주" 월~일 까지의 날짜 데이터가 들어가는 배열
const router = useRouter()
const today = dayjs().format("YYYY-MM-DD"); // 오늘(날짜)
const dayNumber = dayjs().isoWeekday(); // 오늘(요일)

const calcDateTime = dayjs();
const startOfWeek = calcDateTime.startOf('isoWeek'); // 이번주 월요일 

for(let i = 0 ; i<7 ; i++){
  const date = startOfWeek.add(i,'day'); // 현재 날짜(월)에 i만큼을 더함 
  thisWeekDates.push(date.format('YYYY-MM-DD'));
}

//각 요일에 해당하는 날짜 입력
thisWeekDates.forEach((item,index)=>{
  const day = days.value.find((element)=>{
           return element.dayNum === index+1} // 
          );
  if(day){ 
    day.dateTime = item;
  }
});

onMounted(async()=>{
    //마운트 시 오늘 날짜의 데이터 가져옴
    const response =await dietByDate(today);
    //요일 선택 헤더의 오늘 날짜 selected = true
    days.value.forEach((item)=>{
      if(item.dayNum === dayNumber){
        item.selected = true;
      }
    });
    
    //응답 데이터를 각 카테고리별로 push
    response.forEach((item)=>{
       if(item.dietCategory in mealRecords.value){
        mealRecords.value[item.dietCategory].push(item);
       }
    });
    calcDailyKcal(response);
  })

//요일 선택 헤더 클릭 시 selectd값 변경,해당 요일의 식단 정보 조회
const selectDay =async (label) => {
  for(const day of days.value){
    day.selected = label === day.label;
    if(day.label === label){
      const response =  await dietByDate(day.dateTime);
        // 기존 데이터 초기화
        mealRecords.value = {
          "아침 식사": [],
          "점심 식사": [],
          "저녁 식사": [],
          "간식/기타": []
        };
      for(const item of response){
        if( item.dietCategory in mealRecords.value){
                mealRecords.value[item.dietCategory].push(item);
        }
      }
      calcDailyKcal(response);
    }
  }
}

//식품 조회 페이지로 이동
const mvFoodSearchPage = (meal) => {
    const selectedDate =  days.value.find((element)=>{return element.selected});
    localStorage.setItem('dietCategory', meal); // 식사 카테고리 저장
    localStorage.setItem('foodRecordedDate', selectedDate.dateTime);// 식단 추가하는 날짜 저장
    router.push('/auth/diet/foodSearchPage');
}

//식사 카테고리 종류
const mealTypes = ['아침 식사', '점심 식사', '저녁 식사', '간식/기타'];

const mealExpanded = ref({
  '아침 식사': false,
  '점심 식사': false,
  '저녁 식사': false,
  '간식/기타': false
})

//mealExpanded값을 ▼,▲  클락 시 변경(F<->T)
const toggleMeal = (meal) => {
  mealExpanded.value[meal] = !mealExpanded.value[meal]
}

//각 식사분류의( 아침/점심/저녁...) 총 칼로리
const getTotalCalories = (meal) => {
  let result = mealRecords.value[meal]?.reduce((sum, item) => sum + Number(item.foodKcal), 0) || 0;
  return result
}

//식단 조회 API요청
const dietByDate = async(date)=>{

try{
  const response =await axios.get("/api/getMyDiet",{
                                  params:{specificDate : date},
                                  withCredentials : true});
    return response.data.data;
}catch(err){
    console.log(err.message);
  }
}

//일일 총 칼로리 계산 
const calcDailyKcal = (response)=>{
 totalDailyKcal.value = {
                          "칼로리":0,
                          "탄수화물":0,
                          "단백질": 0,
                          "지방":0
                        };
          
  if(response.length  ===0){
    console.log("불러온 값 없음 함수 즉시 종료");
    return;
  }
  for(const meal of response){
      totalDailyKcal.value["칼로리"] += Number(meal.foodKcal);
      totalDailyKcal.value["탄수화물"] +=Number(meal.foodCarbo);
      totalDailyKcal.value["단백질"] +=Number(meal.foodProtein);
      totalDailyKcal.value["지방"] +=Number(meal.foodFat);
  } 

    totalDailyKcal.value["칼로리"] = roundTo(totalDailyKcal.value["칼로리"], 1);
    totalDailyKcal.value["탄수화물"] = roundTo(totalDailyKcal.value["탄수화물"], 1);
    totalDailyKcal.value["단백질"] = roundTo(totalDailyKcal.value["단백질"], 1);
    totalDailyKcal.value["지방"] = roundTo(totalDailyKcal.value["지방"], 1);
}

//소수점 둘째자리에서 반올림
const roundTo = (num,digits)=>{
  const factor = 10 ** digits; // 10을 digits 번 곱함
  return Math.round(num*factor)/factor  

}

const getFoodDetailRequset = async(food)=>{
  localStorage.setItem("foodRecordId",food.foodRecordId);
  router.push('/auth/diet/foodRecordDetail');
}
</script>

<style lang="scss" scoped>
.meal-tracker {
  background-color: #0e0e0e;
  color: #ffffff;
  padding: 1rem;
  min-height: 100vh;
  font-family: sans-serif;

  .total-header{
    display: flex;
    justify-content: space-between;
    gap: 1.5rem;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #797979;
    border-radius: 10px;
    border: none;
    height: auto;
  
    .nutrition-category{
      font-size: 1.5rem;
    }
    .nutrition-amount{
      text-align: center;
    }
    
  }
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
  .food-nutrition{  
    display: flex;
    .food-desc1{
      margin-right: 1.5rem;
      font-size: 1rem;
    }

  }
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
