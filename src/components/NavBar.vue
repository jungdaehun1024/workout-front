<template>
    <nav>
        <ul>
            <li>
                <RouterLink to="/">홈</RouterLink>
            </li>
            <li>
                <RouterLink to="/board/write">글 쓰기 </RouterLink>
            </li>
            <li>
                <RouterLink to="/board">커뮤니티</RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router';

</script>

<style scoped>

a {
    text-decoration: none;
    color: inherit; /* 색상 기본값으로 설정 */
    

}

nav {
    
  background: #adacac;
  padding: 10px;
 
}

ul {
  list-style: none;
  display: flex;
  gap: 15px;
  li {
        border-bottom:none;        
    }
}


</style>