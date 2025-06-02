<template>
    <nav class="navigation">
        <ul class = "nav-menu">
            <li>
                <RouterLink  class="nav-link" to="/">홈</RouterLink>
            </li>
            <li>
                <RouterLink v-if="isLogin"  class="nav-link" to="/board/write" >글 쓰기 </RouterLink>
            </li>
            <li>
                <RouterLink v-if="isLogin"  class="nav-link" to="/board"  >커뮤니티</RouterLink>
            </li>
            <li>
                <RouterLink v-if="!isLogin"  class="nav-link" to="/auth/join"  >회원가입</RouterLink>
            </li>
            <li>
                <RouterLink v-if="!isLogin"  class="nav-link" to="/auth/login" >로그인</RouterLink>
            </li>
                <li>
                <RouterLink v-if="isLogin"  class="nav-link" to="/auth/diet/dietPage" >식사 기록</RouterLink>
                </li>
            <li>
                <RouterLink v-if="isLogin" class="nav-link" to="/auth/user/myPage" >내 정보</RouterLink>
            </li>
            <li @click="logout">
                <RouterLink v-if="isLogin"  class="nav-link" to="#"  >로그아웃</RouterLink>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import axios from 'axios';
import { ref, watch, } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user/userStore';
import { storeToRefs } from 'pinia';

const router = useRouter();
const userStore = useUserStore();
const {userInfo} = storeToRefs(userStore);

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
        localStorage.setItem("isLogin","false");
        alert("로그아웃 되었습니다.");
        userInfo.value = {};

        // 쿠키 적용 대기 (Set-cookie를 만료시키는 과정에서 아주 짧은 시간이 걸릴 수 있음)
        await new Promise(resolve => setTimeout(resolve, 100)); // 100~200ms 정도 대기
        router.push("/");
       
    }catch(err){
        console.log(err.message);
    }
   
}

</script>

<style lang="scss" scoped>

.navigation {
    background-color: #0e0e0e;
    margin: 0px;
    padding: 10px;
    color: #ffffff;
    font-size: 3rem;
    border: none;
    gap: 1rem;
    .nav-menu{
          list-style: none;
          display: flex;
          gap: 4rem;
          .nav-link{
            text-decoration: none;
            color: inherit; /* 색상 기본값으로 설정 */
          }
          .nav-link {
            text-decoration: none;
            color: inherit;
            &:hover {
                background-color: #ffffff;
                color: #0e0e0e;
                border-radius: 7px;
                 }
            }   
    }
}
</style>