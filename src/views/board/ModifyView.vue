<template>
    <div class="write-page">
      <PostForm/>    
    </div>
  </template>
  <script setup>
  import PostForm from '@/components/PostForm.vue';
  </script>
   
  <style lang="scss" scoped>
  .write-page {
    font-family: Arial, sans-serif;
    // max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #0a0a0a;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
</style>