<template>
    <div class="MypageContainer">
        <div class="infoElements">
            <div>이름:</div><div>{{userInfo.name}}</div>
        </div>
        <div class="infoElements">
            <div>아이디:</div><div>{{userInfo.account}}</div>
        </div>
        <div class="infoElements">
            <div>전화번호:</div><div>{{userInfo.ph}}</div>
        </div>
        <div class="infoElements">
            <div>E-mail:</div><div>{{userInfo.email}}</div>
        </div>
        <div class="infoElements">
            <div>가입일:</div><div>{{ userInfo.userCreatedAt }}</div>
        </div>
        <div class="infoElements">
            <div @click="mvPasswordChangePage()">비밀번호 변경</div>
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
    .MypageContainer{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100vw;
        height: 100vh;
        background-color: rgb(219, 206, 21);
        .infoElements{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: larger;
            background-color: rgb(167, 105, 31);
            width: 40vw;
            height: 10vh;
        }
    }
</style>