<template>
    <div class="MypageContainer">
        <label for="originPassword">기존 비밀번호</label>
        <input type="text" v-model="originPassword" class="infoElements"  id="originPassword"  placeholder="기존 비밀번호">
        <label for="newPassword">변경할 비밀번호</label>
        <input type="text" v-model="newPassword" class="infoElements"  id="newPassword"  placeholder="변경할 비밀번호">

        <label for="checkNewPassword">비밀번호 재확인</label>
        <input type="text" v-model="checkNewPassword" class="infoElements"  id="checkNewPassword"  placeholder="비밀번호 확인">
    
    </div>
    <button @click="changePassword">확인</button>
</template>
<script setup>

import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const originPassword = ref("");
const newPassword = ref("");
const checkNewPassword = ref("");
const router = useRouter();

const changePassword =  async(event)=>{
    event.preventDefault(); // 버튼의 기본동작 방지 

    //빈간 방지
    if(originPassword.value.trim() ==="" ||newPassword.value.trim() ==="" || checkNewPassword.value.trim() ===""){
        alert("모든 입력을 완료해주세요");
        return;
    }

    //변경할 비번과 재확인이 다를 경우 경고
    if(newPassword.value.trim() !== checkNewPassword.value.trim()){
        alert("변경할 비밀번호화 재확인 비밀번호 불일치");
        newPassword.value ="";
        checkNewPassword.value = "";
        return;
    }

    try{
        const response =  await axios.post("/api/changePwd",{
                            originPassword : originPassword.value.trim(),
                            newPassword : newPassword.value.trim(),
                          },{withCredentials : true});
        if(response.data.status === 200){
            alert("회원정보 변경에 성공했습니다.");
            router.push("/");
        }
    }catch(err){
        console.error(err.message)
    }


    
}
</script>
<style lang="scss">
    // .MypageContainer{
    //     display: flex;
    //     flex-direction: column;
    //     justify-content: center;
    //     align-items: center;
    //     width: 100vw;
    //     height: 100vh;
    //     background-color: rgb(219, 206, 21);
    //     .infoElements{
    //         display: flex;
    //         justify-content: center;
    //         align-items: center;
    //         font-size: larger;
    //         background-color: rgb(167, 105, 31);
    //         width: 40vw;
    //         height: 10vh;
    //     }
    // }
</style>