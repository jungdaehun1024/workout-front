<template>
    <div class="food-detail-cotainer">
       <div class="info-header">{{foodRecordDetail.foodName}}        
       </div>
       <div class="text-wrapper">
         <div class="info-body-text">내 식단 다이어리 수정</div>
       </div>
        <div class="food-detail">
            <div class="food-weight-box">
                <img :src=foodWeightSvg class="food-weightImg">
                <input type="text"  v-model="editedWeight" :placeholder="foodRecordDetail.foodWeight">
            </div>

            <div class="weight-category-box">
                <img :src=weightCategorySvg class="weight-categoryImg">
                <input type="text" placeholder="g(단위)" readonly>
            </div>

            <div class="food-category-box">
                <img :src=foodCategororySvg class="food-categoryImg">
                <input type="text" :placeholder="foodRecordDetail.dietCategory" readonly>
            </div>      
        </div>
        <div class="btns-box">
            <button class="modify-btn" @click="modifyRequest()">수정하기</button>
            <button class="del-btn" @click="deleteRequest()">삭제하기</button>
        </div>

        <div class="nutrition-box">
            <div class="nutrition-top">
                <div class="kcal-box">
                    <div class="kcal-text">칼로리</div>
                    <div class="kcal-value">{{computedKcal }}</div>
                </div>
                <div class="fat-box">
                    <div class="fat-text">지방</div>
                    <div class="fat-value">{{computedFat }}</div>
                </div>
            </div>
            <div class="nutrition-bottom">
                <div class="carbo-box">
                    <div class="carbo-text">탄수화물</div>
                    <div class="carbo-value">{{ computedCarbo }}</div>
                </div>
                <div class="protein-box">
                    <div class="protein-text">단백질</div>
                    <div class="protein-value">{{computedProtein }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref,computed } from 'vue';
import foodWeightSvg from "@/assets/food/foodWeight.svg"
import weightCategorySvg from "@/assets/food/weightCatefory.svg"
import foodCategororySvg from "@/assets/food/foodCategory.svg"
import { useRouter } from 'vue-router';

const router = useRouter();


const foodRecordDetail = ref("");
const editedWeight = ref(0); // 사용자가 수정할 중량
const getFoodRecordDetail = async()=>{
    const foodRecordId = localStorage.getItem("foodRecordId");
      const response = await axios.get("/api/getFoodDetail",{params : {foodRecordId},
                                withCredentials : true
                                });
      foodRecordDetail.value = response.data.data;
      editedWeight.value = foodRecordDetail.value.foodWeight;
}

getFoodRecordDetail();


const computedKcal = computed(()=>{
    if(!foodRecordDetail.value || !editedWeight.value) return;
    const kcalPerGram = foodRecordDetail.value.foodKcal / foodRecordDetail.value.foodWeight;
    return Math.round(kcalPerGram * editedWeight.value * 100) / 100;
})

const computedFat =  computed(()=>{
const FatPerGram = foodRecordDetail.value.foodFat / foodRecordDetail.value.foodWeight;
  return Math.round(FatPerGram*editedWeight.value*100)/100;
})

const computedCarbo = computed(()=>{
    const carboPerGram = foodRecordDetail.value.foodCarbo / foodRecordDetail.value.foodWeight;
    return Math.round(carboPerGram*editedWeight.value * 100) / 100 ;
})

const computedProtein = computed(()=>{
    const ProteinPerGram = foodRecordDetail.value.foodProtein / foodRecordDetail.value.foodWeight;
    return Math.round(ProteinPerGram*editedWeight.value * 100) / 100;
})

//식사 기록 수정
const modifyRequest = async()=>{
    //서버로 보낼 요청 객체
    const requestFoodData = {
        recorderAccount : foodRecordDetail.value.recorderAccount,
        foodKcal : computedKcal.value,
        foodCarbo: computedCarbo.value,
        foodProtein: computedProtein.value,
        foodFat: computedFat.value,
        foodName: foodRecordDetail.value.foodName,
        dietCategory : foodRecordDetail.value.dietCategory,
        foodWeight : editedWeight.value,
        foodRecordId : foodRecordDetail.value.foodRecordId,
        foodRecordedDate : foodRecordDetail.value.foodRecordedDate
    }
    try{
        await axios.put("/api/updateFoodDetail",requestFoodData,{
        withCredentials:true
    });
        alert("식사 기록 수정이 완료되었습니다.");
        router.go(-1);
    }catch(err){
        console.error("식사 기록 수정 중 에러가 발생했습니다.");
        alert("식사 기록 수정 중 에러가 발생했습니다.");
        router.push("/auth/diet/dietPage");
    }
}

//식사 기록 삭제
const deleteRequest = async()=>{
    try {
        await axios.delete("/api/deleteFoodDetail",{params:{foodRecordId:foodRecordDetail.value.foodRecordId},withCredentials:true});
        alert("식사 기록 삭제가 완료되었습니다.");
        router.go(-1);
    } catch (err) {
        console.error("식사 기록 삭제중 에러가 발생했습니다.");
        alert("식사 기록 삭제중 에러가 발생했습니다.");
        router.push("/auth/diet/dietPage");
    }
   
}
</script>
<style scoped lang="scss">
    .food-detail-cotainer{
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
        .btns-box{
            display: flex;
            margin-bottom: 1.5rem;
            margin-left: 1.5rem;
            justify-content: center;
            align-items: center;
            .modify-btn{
                width: 15rem;
                height: 3rem;
                &:hover{
                    background-color: rgb(194, 234, 64);
                }
            }
            .del-btn{
                width: 15rem;
                height: 3rem;
                &:hover{
                    background-color: rgb(243, 83, 65);
                }
            }
        }
        .food-detail{
            background-color: rgb(3, 11, 24);
            width: 50vw;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            .food-weight-box{
                display: flex;
                margin-bottom: 1rem;
                .food-weightImg{
                    width: 5rem;
                    height: 3rem;
                }
            }
            .weight-category-box{
                display: flex;
                margin-bottom: 1rem;
                .weight-categoryImg{
                    width: 5rem;
                    height: 3rem;
                }
                   
            }
            .food-category-box{
                display: flex;
                margin-bottom: 1rem;
                .food-categoryImg{
                    width: 5rem;
                    height: 3rem;
                }

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
</style>