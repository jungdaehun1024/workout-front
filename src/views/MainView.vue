<template>
   <div class="index-container">
   <SideBar/>
   <div class="boards-container">
      <div class ="selected-category">{{ currentCategory.categoryName }}</div>
      <table>
         <thead>
            <tr>
               <th class="table-header-elements" v-for="(header,index) in tableHeaders" :key="index">{{ header }}</th>
            </tr>
         </thead>
         <tbody>
            <tr class="table-bodies" v-for="body in boards" :key="body.boardId" @click="clickBoard(body)">
               <td class="table-body-elements">{{body.categoryName}}</td>
               <td class="table-body-elements">{{ body.title}}</td>
               <td class="table-body-elements">{{ body.writerAccount}}</td>
               <td class="table-body-elements">{{ body.createdAt }}</td>
            </tr>
 
         </tbody>
      </table>
      <div class="btn-box">
         <button class="write-btn" type="button" @click="writeBoard()">글 작성</button>
          <PaginationBar :totalCount="boardsCount" @changePage="handleChangePage"/>
      </div>
      
   </div> 
   </div>
</template>
<script setup>
import PaginationBar from '@/components/PaginationBar.vue';
import SideBar from '@/components/SideBar.vue';
import { useBoardStore } from '@/stores/board/boardStore';
import { useCategoryStore } from '@/stores/board/categoryStore';
import { storeToRefs } from 'pinia';
import { watch,ref} from 'vue';
import { useRouter } from 'vue-router';
const categoryStore = useCategoryStore();
const boardStore = useBoardStore();
const {currentCategory} = storeToRefs(categoryStore);
const {boards,boardsCount} = storeToRefs(boardStore);
const clickPaginationIndex = ref(0);
const tableHeaders = ref(["탭","제목","작성자","작성일",]);
const router = useRouter();
const clickBoard = async(body)=>{
   router.push({
      path: "/board/detail",
      query: {boardId : body.boardId}
   });
}

watch(currentCategory,async (newVal)=>{
   try{
      await boardStore.getBoards(newVal.categoryId,newVal.depth);
      boardsCount.value = boards.value[0].totalCount;
   }catch(err){
      console.error(err.message);
   }
});

const handleChangePage = (page)=>{
   clickPaginationIndex.value  = page;
}

watch(clickPaginationIndex,async(paginationIndex)=>{
   try{
      await boardStore.getBoards(currentCategory.value.categoryId,currentCategory.value.depth,paginationIndex)

   }catch(err){
      console.error(err.message);
   }
})

const writeBoard = ()=>{
  const isLogin = localStorage.getItem("isLogin");
  if(isLogin === "false"){
      alert("로그인 후 이용 가능합니다.");
      return;
  }

  router.push("/board/write");
  
}
</script>
<style scoped> 
   .index-container{
         background-color: #0e0e0e;
         height: 100vh;
         width: 100vw;
         display: flex;
         /* flex-direction: column; */
         .boards-container{
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            .table-header-elements{
               width: 3rem;
            }
            .table-bodies{
               background-color: rgb(150, 150 , 150);
               .table-body-elements{
                  color: rgb(30, 30, 30);
                  padding-bottom: 1.5rem;
                  width: 3rem;
                  border: none;
               }

            }
            .text{
               width: 100%;
               height: 100vh;
               font-size: 5rem;
               color: #ffffff;
            }
            .selected-category{
               padding-left: 1rem;
               padding-bottom: 1rem;
                padding-top: 1rem;
               font-size: 1.5rem;
               color: #ffffff;
               width: 100%;
               border-bottom: solid #ffffff 1px ;
            }
            .temp-text{
               width: 100%;
               padding-top: 2.5rem;
               color: #ffffff;
               text-align: center;
               font-size: 5rem;
         }
         .btn-box{
            margin-top: 1.5rem;
            margin-left: 1rem;
            display: flex;
            justify-content: space-between;
            .write-btn{
               border: none;
               border-radius: 3px;
               width: 7rem;
               height: 3.5rem;
               margin-top: 2.5rem;
               
            }
         }

         }
   }

table{
   color: #ffffff;
}

</style>