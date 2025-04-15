<template>
    <nav>
        <ul>
            <li>
                <RouterLink to="/">홈</RouterLink>
            </li>
            <li>
                <RouterLink to="/board/write" >글 쓰기 </RouterLink>
            </li>
            <li>
                <RouterLink to="/board"  >커뮤니티</RouterLink>
            </li>
            <li>
                <RouterLink to="/auth/join"  >회원가입</RouterLink>
            </li>
            <li>
                <RouterLink to="/auth/login" >로그인</RouterLink>
            </li>
            <li>
                <button @click="logout" >로그아웃</button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import axios from 'axios';
import { ref, watch, } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';

const router = useRouter();

const isLogin = ref(localStorage.getItem("isLogin") === "true");

const route = useRoute();
watch(route, () => {
  isLogin.value = localStorage.getItem("isLogin") === "true";
});
//로그아웃 요청 함수
const logout = async()=>{
    try{
        await axios.post("/api/auth/logout",{},{  //로그아웃 요청
        withCredentials:true, 
        });

        alert("로그아웃 되었습니다.");
        localStorage.setItem("isLogin","false");
        router.push("/")
       
       

    }catch(err){
        console.log(err.message);
    }
   
}

</script>

<style lang="scss" scoped>

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