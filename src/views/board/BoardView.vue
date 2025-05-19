<template>
    <div class="boards-box">
        <div>
            <ul>
                <li v-for="(board,index) in boards.data" :key="index" :value="board.boardId" @click="getBoardDetail(board.boardId)">
                   <div class="board-info">
                    <span class="title">{{ board.title }}</span>
                    <span class="idx">{{ board.boardId }}</span>
                   </div>
                </li>   
            </ul>
        </div>
    </div>
</template>
<script setup>
    // import axios from 'axios';
    import {  onBeforeMount} from 'vue';
    import { useRouter } from 'vue-router';
    import {useBoardStore} from '@/stores/board/boardStore';
    import { storeToRefs } from 'pinia';

    const router = useRouter();
    const boardStore = useBoardStore();
    const {boards} = storeToRefs(boardStore);

   
    onBeforeMount(async()=>{
        // 게시글 목록 불러오기
        await boardStore.getBoards(); 
    })

    // 게시글 상세보기 이동 
    const getBoardDetail = async(boardId)=>{
        router.push({name:"BoardDetail",params:{boardId}});
    }
</script>
<style lang="scss" scoped>
.boards-box{
    background-color: #0e0e0e;
    height: 80vh;
    width: 100vw;
 
    // display: flex;
    .board-info{
        display: flex;
        justify-content: space-between;
        .title{
            margin-left: 1rem;
        }
        .idx{
              margin-right: 1rem;
        }
    }
    ul{
        list-style: none;
        background-color: rgb(41, 41 ,41);
        padding: 0;
        width: auto;
        li{
           padding: 1rem;
            color: #ffffff;
            border-bottom: 1px solid rgb(220, 220, 220) ;
            font-size: 3rem;
            cursor: pointer;
            &:hover{
                background-color:  #666A73;
            }
           
        }
    }

    
}

     

</style>
