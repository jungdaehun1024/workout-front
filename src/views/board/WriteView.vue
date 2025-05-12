<template>
    <div class="write-page">
      <PostForm/>    
    </div>
  </template>
  <script setup>
import PostForm from '@/components/PostForm.vue';
import { useBoardStore } from '@/stores/board/boardStore';
import { onBeforeMount } from 'vue';
const boardStore = useBoardStore();
onBeforeMount(()=>{
  //세션에 저장된 게시글 상세 정보 초기화
  sessionStorage.clear();

  // 기존 boardDetail이 반응형 상태를 유지하면서 비워지도록 처리
  Object.assign(boardStore.boardDetail, { data: {} });

})

  </script>
   
  <style lang="scss" scoped>
  .write-page {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  </style>
  