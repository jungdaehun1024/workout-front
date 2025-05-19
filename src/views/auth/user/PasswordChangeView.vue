<template>
    <div class="root-text">비밀번호 변경</div>
    <div class="change-password-container">
        <label for="input-originPassword">기존 비밀번호</label>
        <input type="text" v-model="originPassword" class="input-elements"  id="originPassword"  placeholder="기존 비밀번호">
        <label for="newPassword">변경할 비밀번호</label>
        <input type="text" v-model="newPassword" class="input-elements"  id="newPassword"  placeholder="변경할 비밀번호">

        <label for="checkNewPassword">비밀번호 재확인</label>
        <input type="text" v-model="checkNewPassword" class="input-elements"  id="checkNewPassword"  placeholder="비밀번호 확인">
        <button  class="confirm-btn" @click="changePassword">확인</button>
    </div>
  
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
<style lang="scss" scoped>
.root-text{
    margin-top: 10rem;
    font-family: sans-serif;
    color: #ffffff;
    font-size: 4rem;
    font-weight: bolder;
    text-align: center;
}
.change-password-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #0e0e0e;
    font-family: sans-serif;
    font-size: 2.5rem;
    color: #ffffff;
    gap: 2.5rem;
    margin-top: 10rem;
    .input-elements{
        height: 3.5rem;
        width: 10vw;
        border-radius: 7px;
        font-size: 2rem;
        &::placeholder{
            font-size: 1.5rem;
            color: #0e0e0ee3;
        }
    }

    .confirm-btn{
        border-radius: 7px;
        width: 15rem;
        height: 5rem;
        font-size: 2.5rem;
        font-weight: bolder;
            &:hover{
                background-color: rgb(194, 234, 64);
                color: #0e0e0e;
            }
    }

}
</style>