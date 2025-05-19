<template>
      <PostForm/>    
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
  </style>
  