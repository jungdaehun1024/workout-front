<template>
      <div class="root-info-text">회원 정보</div>
    <div class="mypage-container">
        <div class="infoElements">
            <div class="text-info">이름:</div>
            <div class="username-area">{{userInfo.name}}</div>
        </div>
        <div class="infoElements">
            <div class="text-info">아이디:</div>
            <div class="account-area">{{userInfo.account}}</div>
        </div>
        <div class="infoElements">
            <div class="text-info">전화번호:</div>
            <div class="ph-area">{{userInfo.ph}}</div>
        </div>
        <div class="infoElements">
            <div  class="text-info">E-mail:</div>
            <div class="email-area">{{userInfo.email}}</div>
        </div>
        <div class="infoElements">
            <div class="text-info">가입일:</div>
            <div class="created-area">{{ userInfo.userCreatedAt }}</div>
        </div>
        <div class="infoElements">
            <div class="change-password" @click="mvPasswordChangePage()">비밀번호 변경</div>
        </div>
    </div>
   
</template>
<script setup>
import { useUserStore } from '@/stores/user/userStore';
import { storeToRefs } from 'pinia';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const {userInfo} = storeToRefs(userStore);
const router = useRouter();

onMounted(async()=>{
    await userStore.getUserInfo();
})

const mvPasswordChangePage = ()=>{
    router.push("/auth/user/passwordChange");
}
</script>
<style lang="scss" scoped>
.root-info-text{
    color: #ffffff;
    font-family: sans-serif;
    text-align: center;
    font-size: 6rem;
    margin-top: 4rem;
    
   }
 .mypage-container{
    background-color: #0e0e0e;
    height: 50vh;
     font-family: sans-serif;
     display: flex;
     flex-direction: column;
     justify-content: center;
     align-items: center;
     gap: 2.5rem;
    .infoElements{
        display: flex;
        color: #ffffff;
        font-size: 3.5rem;
        .text-info{
            margin-right: 1rem;
            text-align: right;
        }
        .change-password{
            cursor: pointer;
            border-radius: 8px;
            &:hover{
                background-color: rgb(194, 234, 64);
                color: #0e0e0e;
            }
        }
    }
 }
</style>