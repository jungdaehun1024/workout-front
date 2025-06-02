<template>
    <div class="info-container">
        <div class="info-header">
         {{ foodDetail.FOOD_NM_KR }}
        </div>
        <div class="text-wrapper" >
          <div class="info-body-text">내 식단 다이어리에 추가</div>
        </div>
       
        <div class="info-body">
            
            <div class="weight-box">
              <img :src="foodWeightSvg"  class="info-body-weightImg" alt="음식 무게 이미지" />
              <input type="text"  v-model="foodDetail.SERVING_SIZE" placeholder="무게를 입력해주세요">
            </div>
         
            <div class="weight-category-box">
              <img :src="weightCateforySvg" class="info-body-categoryImg" alt="음식 무게 이미지" />
              <input type="text" placeholder="g(단위)" readonly>
              
            </div>
            <button class="save-food-btn" @click="saveFood()">저장</button>

            <div class="nutrition-box ">
              <div class="nutrition-top">
                <div class="kcal-box">
                  <div class="kcal-text">
                       칼로리
                  </div>
                  <div class="kcal-value">
                    {{computedKcal }}kcal
                  </div>
              </div>
                <div class="fat-box">
                  <div class="fat-text">
                       지방
                  </div>
                  <div class="fat-value">
                    {{computedFat }}g
                  </div>
              </div>
              </div>
              <div class="nutrition-bottom">
                  <div class="carbo-box">
                  <div class="carbo-text">
                       탄수
                  </div>
                  <div class="carbo-value">
                    {{computedCarbo }}g
                  </div>
              </div>
                 <div class="protein-box">
                  <div class="protein-text">
                       단백질
                  </div>
                  <div class="protein-value">
                    {{computedProtein }}g
                  </div>
              </div>
              </div>
            </div>
        </div>

    </div>
</template>
<script setup>
import {  computed, onMounted, ref } from 'vue';
import foodWeightSvg from "@/assets/food/foodWeight.svg"
import weightCateforySvg from "@/assets/food/weightCatefory.svg"
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(()=>{
  foodDetail.value = JSON.parse(localStorage.getItem("foodDetail"));
  foodDetail.value.SERVING_SIZE = foodDetail.value.SERVING_SIZE.slice(0,-1);
})

const foodDetail = ref({});
const ratio = computed(()=>{
   return foodDetail.value.SERVING_SIZE / 100
})

const computedKcal = computed(()=>{
  return Math.round(foodDetail.value.AMT_NUM1*ratio.value*100)/100;
})

const computedFat =  computed(()=>{
  return Math.round(foodDetail.value.AMT_NUM4*ratio.value*100)/100;
})

const computedCarbo = computed(()=>{
    return Math.round(foodDetail.value.AMT_NUM6*ratio.value * 100) / 100 ;
})

const computedProtein = computed(()=>{
    return Math.round(foodDetail.value.AMT_NUM3*ratio.value * 100) / 100;
})

const saveFood = async()=>{
  const foodInfo = {
    foodName : foodDetail.value.FOOD_NM_KR,
    foodKcal : computedKcal.value,
    foodCarbo : computedCarbo.value,
    foodProtein : computedProtein.value,
    foodFat : computedFat.value,
    dietCategory : localStorage.getItem("dietCategory"),
    foodWeight : foodDetail.value.SERVING_SIZE,
    foodRecordedDate : localStorage.getItem("foodRecordedDate"),

  }
  const response = await axios.post("/api/saveFoodRequest",foodInfo,{withCredentials: true});
  localStorage.clear();
  router.push("/auth/diet/dietPage");
  console.log(response);
}

</script>
<style lang="scss" scoped>
    .info-container{
        width: 100vw;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .info-header{
            background-color: rgb(39, 47, 60);
            width: 50vw;
            height: 8vh;
            color: #ffffff;
            font-size: 3.5rem;
            border-bottom: 0.4px solid #ffffff;
        }
        .text-wrapper{
           background-color: rgb(3, 11, 24);
          .info-body-text{
            width: 50vw;
            height: auto;
            color: #ffffff;
            font-size: 1.5rem;
            margin-bottom: 3rem;
          }
        }
     
        .info-body{
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            width: 50vw;
            height: auto;
            background-color: rgb(3, 11, 24);
        
            .weight-box{
              display: flex;
              margin-bottom: 1rem;
              .info-body-weightImg{
                width: 5rem;
                height: 3rem;
             }
            }
            .weight-category-box{
              display: flex;
              margin-bottom: 1rem;
              .info-body-categoryImg{
                width: 5rem;
                height: 3rem;
             }
            }
            .save-food-btn{
                width: 30rem;
                height: 2.5rem;
                margin-bottom: 1.5rem;
                cursor: pointer;
                &:hover{
                  background-color: rgb(194, 234, 64);
                }
            }
            .nutrition-box{
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background-color: rgb(3, 11, 24);
              color: #ffffff;
              width: auto;
              height: auto;
              .nutrition-top{
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 3px;
                width: 50vw;
                text-align: center;
                .kcal-box{
                 background-color: rgb(48, 56, 69);
                 color: #ffffff;
                 width: 30rem;
                 height: 4rem;
                 margin-right: 3px;
                }
                .fat-box{
                 background-color: rgb(48, 56, 69);
                 color: #ffffff;
                 width: 30rem;
                 height: 4rem;
               
                 }

              }
              .nutrition-bottom{
                display: flex;
                width: 50vw;
                justify-content: center;
                align-items: center;
                margin-bottom: 10px;
                text-align: center;
                
                 .carbo-box{
                 background-color: rgb(48, 56, 69);
                 color: #ffffff;
                 width: 30rem;
                 height: 4rem;
                 margin-right: 3px;
                 }
                .protein-box{
                 background-color: rgb(48, 56, 69);
                 color: #ffffff;
                 width: 30rem;
                 height: 4rem;
                 }
              }
              
              
            }
          
    
        }
    }
</style>