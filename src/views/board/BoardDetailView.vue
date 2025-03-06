<template >
    <div id = "container">
        <div class="titleId" id ="titleId">
            <div>제목:{{boardStore.boardDetail.title}}</div>
            <div>게시글 ID:{{boardStore.boardDetail.boardId}}</div>
        </div>
        <div>내용:{{boardStore.boardDetail.content}}</div>
    </div>
</template>
<script setup>
import { useBoardStore } from '@/stores/boardStore';

const boardStore = useBoardStore();
</script>
<style >

.titleId{
    display: flex;
    justify-content: space-between;
}
    
</style>