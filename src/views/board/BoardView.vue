<template>
    <div class="boardList">
        <div >
            <ul>
                <li v-for="(board,index) in boards.data" :key="index" :value="board.boardId" @click="getBoardDetail">
                    {{ board.title }} 
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
    const getBoardDetail = async(event)=>{
        const boardId = event.target.value;
        router.push({name:"BoardDetail",params:{boardId:boardId}});
    }
</script>
<style lang="scss" scoped>

ul {
  list-style-type: none;
  padding: 0;
  
  li {
    padding: 8px;
    border-bottom: 1px solid #ddd;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f0f0f0;
    }

    &.active-link {
      font-weight: bold;
      color: green;
    }
  }
}

.boardList {
    height: 100vh;
    background-color: rgb(148, 144, 144);
}
</style>
