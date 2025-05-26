<template>
    <div class="food-search-container">
        <div class="search-box">
         <input class="input-foodname" type="text" v-model="searchFoodKeyword" placeholder="음식 찾기">
         <button class="food-search-btn" @click="searchFood()" >검색</button>
        </div>
      
        <div class="search-result-box">
            <ul class="search-list">
                <li  v-for="(item,index) in searchResult" :key="index" class="search-foods" @click="foodDetail(index)">
                   <div class="search-food-name">{{ item.FOOD_NM_KR }}</div>
                   <div class="search-food-kcal">{{item.SERVING_SIZE}}당 {{Math.trunc(item.AMT_NUM1)}}Kcal</div>
                </li>
            </ul>
            <!-- <button @click="currentPage--" :disabled="currentPage === 1">이전</button>
            <span>페이지: {{ currentPage }}</span>
            <button @click="currentPage++" :disabled="currentPage === totalPages">다음</button> -->
        </div>
    </div>

  
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

    const searchFoodKeyword = ref(""); // 검색 키워드 저장
    const searchResult = ref([]); // 검색결과로 나온 음식 리스트 

    //음식 검색요청
    const searchFood = async() =>{
       const response = await axios.get("/api/search/foods",{
        params:{
            foodName: searchFoodKeyword.value.trim(),
        },
        withCredentials:true
       });
       searchResult.value = response.data.data.body.items;
       console.log(searchResult.value);
    }

    const foodDetail = (foodIdx) =>{
        localStorage.setItem("foodDetail",JSON.stringify(searchResult.value[foodIdx]));
        router.push("/auth/diet/foodDetail");
    }
   
</script>
<style lang="scss">
    .food-search-container{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background-color: #0a0a0a;
        width: 100vw;
        height: 100vh;
        gap: 1.5rem;
        .search-box{
          display: flex;
          background-color: #0a0a0a;
          width: 40vw;
          margin-left: 8.5rem;
          .input-foodname{
            width: 50rem;
            height: 5rem;
            border-radius: 6px;
            font-size: 3rem;
            margin-right: 0.5rem;
            &::placeholder{
                margin-top: 100px;
                font-size: 3rem;
                text-align: center;

            }
          }
         .food-search-btn{
            font-size: 2rem;
            margin-top:0.4rem;
            height: 5rem;
            width: 10rem;
            // color: rgb(211, 211, 211);
            color: #0a0a0a;
            border-radius: 6px;
            border: none;
            &:hover{
                background-color: rgb(194, 234, 64);
            }
          }

       
        }

           .search-result-box{
            background-color: #0a0a0a;
            border-radius: 8px;
            border: 1.5px solid #ffffff;
            width: 50vw;
            height: 50vh;
            .search-list{
              list-style: none;  
              padding-left: 0;
              .search-foods{
                text-align: center;
                color: #ffffff;
                font-size: 1.5rem;
                .search-food-name{
                    background-color: #2D2D2D;
                }
                .search-food-kcal{
                     background-color: #2D2D2D;
                     margin-bottom: 1rem;
                }
              }
            }
           
          }
  
    }
</style>