<template>
   <NavBar/>
 <RouterView />
</template>
<script setup>
import NavBar from './components/NavBar.vue';
</script>

<style>
  html{
    font-size: 10px;
   
  }

  body{
      overflow-x: hidden;     
      margin: 0;
      background-color: #0e0e0e;
  }
</style>
