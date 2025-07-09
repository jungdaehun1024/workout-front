<template>
    <aside class="sidebar">
        <ul>
            <li v-for=" zeroDepth in calcCategoryDepth(0)" :key="zeroDepth.categoryId" class="zero-depth-categories" >
                <div class="zero-depth-category" @click="selectCategory(zeroDepth)">{{ zeroDepth.categoryName }}</div>
            
                <ul>
                    <li v-for=" oneDepth in calcCategoryDepth(zeroDepth.categoryId)" :key="oneDepth.categoryId" class="one-depth-categories" >
                        <div class="one-depth-category" @click="selectCategory(oneDepth)">ㄴ {{ oneDepth.categoryName }}</div> 
                    </li>
                </ul>
            </li>
        </ul>
    </aside>
</template>

<script setup>
import { useCategoryStore } from '@/stores/board/categoryStore';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import {  onMounted } from 'vue';
const categoryStroe = useCategoryStore();
const {currentCategory,allCategories} = storeToRefs(categoryStroe);
onMounted(async()=>{
    try{
        const response = await axios.get("/api/board-categories");
        allCategories.value = response.data.data;

        //최초 마운트 시 디폴트=> 공지사항
        if(localStorage.getItem("currentCategory") === null){
            currentCategory.value = {categoryId:1,categoryName:"공지사항",parentCategoryId:0,depth:0};
            localStorage.setItem("currentCategory",JSON.stringify(currentCategory.value));
        }
        //새로고침 시 마운트 할 때 현재 카테고리 가져옴
        currentCategory.value = JSON.parse(localStorage.getItem("currentCategory"));
    }catch(err){
        console.error(err);
    }
})


// 카테고리 뎁스 계산
//부모 카테고리ID와 부모카테고리의Id를 parentCategoryId로 가지는 데이터 필터
const calcCategoryDepth = (categoryId) => {
  return allCategories.value.filter((category) => {
    return category.parentCategoryId === categoryId
  })
}

//선택된 카테고리
const selectCategory = (selectedCategory)=>{
    currentCategory.value = selectedCategory;
    localStorage.setItem("currentCategory",JSON.stringify(currentCategory.value));
}
</script>

<style scoped lang="scss">
.sidebar{
    background-color: #0e0e0e;
    border-right: solid 1px #ffffff;
    height: 100vh;
    width: 10vw;
    color: #ffffff;
    text-align: center;
    .zero-depth-categories{
        font-size: 2.5rem;
        border-bottom: solid #ffffff 1px ;
        .zero-depth-category{
            margin-bottom: 1rem;
        }
        }
       
    }
    .one-depth-categories{

        font-size: 1.5rem;
    }

ul{
  list-style: none; /* 기본 점 없애기 */
  padding: 0;
  cursor: pointer;
  
}

li{
    margin-bottom: 1rem;
    text-align: left;

}


</style>