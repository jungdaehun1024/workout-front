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
    <div class = "search-history">
      <input class="search-history-input" type="text" placeholder="조회하려는 날짜를 입력하세요(YYYYMMDD)" v-model="inputPastDate">
      <button class="search-history-btn" @click="searchDietByDate">검색</button>
          
      <!-- 모달 사용 -->
      <Modal v-model:visible="isOpen">
      <template #diet>
        <div class="past-meal-box">
        
        
          <div class="past-meal-date">[{{ inputPastDate }}의 기록]</div>
        
        <div class="breakfast-box">
          <div class="breakfast-text">[아침 식사]</div>
           <div class="breakfast-diet" v-for="(diet,index) in pastDiet['아침 식사']" :key="index">
             <div>{{ diet.foodName }}</div>
             <div class="breakfast-nutrition">
              <div>탄수화물:{{ diet.foodCarbo }}</div>
              <div>단백질:{{ diet.foodProtein }}</div>
              <div>지방:{{ diet.foodFat }}</div>
            </div>  
               <div>칼로리:{{ diet.foodKcal }}</div>
           </div>
        </div>
        <hr>
        <div class="lunch-box">
          <div class="lunch-text">[점심 식사]</div>
           <div class="lunch-diet" v-for="(diet,index) in pastDiet['점심 식사']" :key="index">
           <div>{{ diet.foodName }}</div>
            <div class="lunch-nutrition">
             <div>탄수화물:{{ diet.foodCarbo }}</div>
             <div>단백질:{{ diet.foodProtein }}</div>
             <div>지방:{{ diet.foodFat }}</div>
            </div> 
             <div>칼로리:{{ diet.foodKcal }}</div>
           </div>
        </div>

        <hr>
        <div class="dinner-box">
          <div class="dinner-text">[저녁 식사]</div>
           <div class="dinner-diet" v-for="(diet,index) in pastDiet['저녁 식사']" :key="index">
             <div>{{ diet.foodName }}</div>
             <div class="dinner-nutrition">
              <div>탄수화물:{{ diet.foodCarbo }}</div>
              <div>단백질:{{ diet.foodProtein }}</div>
              <div>지방:{{ diet.foodFat }}</div>
            </div> 
            <div>칼로리:{{ diet.foodKcal }}</div> 
           </div>
        </div>
            <hr>
        <div class="snack-box">
          <div class="snack-text">[간식/기타]</div>
           <div class="snack-diet" v-for="(diet,index) in pastDiet['간식/기타']" :key="index">
             <div>{{ diet.foodName }}</div>
             <div class="snack-nutrition">
              <div>탄수화물:{{ diet.foodCarbo }}</div>
              <div>단백질:{{ diet.foodProtein }}</div>
              <div>지방:{{ diet.foodFat }}</div>
             </div>
              <div>칼로리:{{ diet.foodKcal }}</div>
           </div>
        </div>

       </div>
      </template>
      </Modal>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import dayjs from 'dayjs';
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import isoWeek from 'dayjs/plugin/isoWeek'
import utc from 'dayjs/plugin/utc';
import Modal from '@/components/BaseModal.vue'
import { useFoodStore } from '@/stores/food/foodStore';
import { storeToRefs } from 'pinia';
dayjs.extend(utc);
dayjs.extend(isoWeek);


 const isOpen = ref(false) // false면 안 보이고, true면 보임

 const foodStore = useFoodStore();
 const {inputPastDate} = storeToRefs(foodStore); // 검색하려는 과거의 날짜를 받는 변수

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

//과거 식단 조회 결과를 담는 객체
const pastDiet = ref({
      "아침 식사" : [],
      "점심 식사" : [],
      "저녁 식사": [],
      "간식/기타" : []
  });

//특정 날짜의 식사 데이터를 조회 
const searchDietByDate = async()=>{
  Object.keys(pastDiet.value).forEach((key)=>{
    pastDiet.value[key] = [];
  });
  const validFormat = /^\d{8}$/.test(inputPastDate.value); // 정규표현식으로 8자리 숫자문자인지 체크(YYYYDDMM)
    if(!validFormat){
      alert("YYYYMMDD형식으로 입력해주세요");
      inputPastDate.value = "";
      return;
    }

    //실제 존재 가능한 날짜인지 확인
    const year = parseInt(inputPastDate.value.slice(0,4)); // 연도 
    const month = parseInt(inputPastDate.value.slice(4,6))-1;// 달(JS Date는 0~11월)
    const day = parseInt(inputPastDate.value.slice(6));//일

    const date = new Date(year,month,day);

    //js date는 잘못된 날짜(2월30)도 보정하기 때문에 입력값과 일치하는지 체크
    const isRealDate = 
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day;

    if(!isRealDate){
      alert("유효하지 않은 날짜입니다.");
      inputPastDate.value = "";
      return;
    }
    const utcDate = `${year}-${(month+1).toString().padStart(2,'0')}-${day.toString().padStart(2,'0')}`
    try{
      const response = await dietByDate(utcDate);
        if(response.length === 0){
          alert("해당 날짜의 기록이 존재하지 않습니다.");
          inputPastDate.value = "";
          return;
        }
          for(const value of response){
            if(value["dietCategory"] === "아침 식사"){
              pastDiet.value["아침 식사"].push(value);
            }else if(value["dietCategory"] === "점심 식사"){
              pastDiet.value["점심 식사"].push(value);
            }else if(value["dietCategory"] === "저녁 식사"){
              pastDiet.value["저녁 식사"].push(value);
            }else if(value["dietCategory"] === "간식/기타"){
               pastDiet.value["간식/기타"].push(value);
            } 
        }
    }catch(err){
      console.error("과거 식사 조회 중 에러가 발생했습니다.",err);
    }

    isOpen.value = true;

}

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
  .search-history{
    display: flex;
    .search-history-input{
      margin-right: 0.5rem;
      width: 30rem;
      height: 3.5rem;
      border: none;
      border-radius: 5px;
      &::placeholder{
        text-align: center;
        color: #000;
      }
    }
    .search-history-btn{
       cursor: pointer;
       border: none;
       border-radius: 5px;
    }

    .past-meal-box{
      background-color: white;
      width: auto;
      height: auto;
      .past-meal-date{
        text-align: center;
        font-size:2rem;
      }
      .breakfast-box{
          display: flex;
          flex-direction: column;
          .breakfast-text{
            font-size: 1.5rem;
          } breakfast-text
          .breakfast-diet{
              margin-bottom: 20px;
            .breakfast-nutrition{
                        display: flex;
            }
          }
         
      }
      .lunch-box{
         display: flex;
         flex-direction: column;
         .lunch-text{
          font-size: 1.5rem;
         }
         .lunch-diet{
          margin-bottom: 20px;
            .lunch-nutrition{
              display: flex;
             }
         }
     

      }
      .dinner-box{
          display: flex;
          flex-direction: column;
          .dinner-text{
            font-size: 1.5rem;
          }
          .dinner-diet{
             margin-bottom: 20px;
            .dinner-nutrition{
              display: flex;
            }
          }
  
      }
      .snack-box{
          display: flex;
          flex-direction: column;
          .snack-text{
            font-size: 1.5rem;
          }
          .snack-diet{
              margin-bottom: 20px;
            .snack-nutrition{
              display: flex;
              }
          }
      
      }
    }
  }

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
