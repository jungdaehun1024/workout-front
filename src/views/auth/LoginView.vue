<template>
  <div class =login-box>
        <input type="hidden" id ="encPW" v-model="encryptPwd" >
        <div class="login-text">로그인</div>
    <div class ="form-container">
         <div class="form-group">
          <label for="title">아이디</label>
          <input class="form-input"  type="text" v-model="account" id="title" placeholder="아이디를 입력해주세요"  />
         </div>
        <div class="form-group">
          <label for="password">패스워드</label>
          <input class="form-input" type="password" v-model="password" id="password" placeholder="패스워드를 입력해주세요"   />
        </div>
    
        <button class="login-btn" @click="userLogin">로그인</button>
    </div>
  </div>

</template>
<script setup>
import axios from 'axios';
import {ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

//공개키 모듈러스,공개지수
const account = ref("");
const password = ref("");




//로그인 요청
const userLogin = async()=>{
  try{
    // encryptData();
    await axios.post("/api/auth/login",{
      account: account.value,   
      password: password.value,
      });
      router.push("/");
  }catch(err){
    console.error(err.message)
  }
}


</script>
<style lang="scss" scoped>
  .login-box{
    background-color: #0e0e0e;
    .login-text{
      text-align: center;
      margin-left: 17rem;
      color: #ffffff;
      font-size: 5rem;
    }
    .form-container{
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100vw;
      height: 100vh;
      .form-group{
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 4rem;
        margin:5rem 0;
      
        .form-input{
          background-color: rgb(233,233,233);
          font-size: 3.5rem;
          border-radius: 6px;
          width: 100rem;
          height: 5rem;
          &::placeholder{
            color: #0e0e0e;
            text-align: center;
            font-size: 2rem;
          }
        }
        label{
          padding-right: 2rem;
          text-align: right;
          width: 15rem;
          color: #ffffff;
          margin-right: 2rem;
        }
      }
        .login-btn{
          background-color: #302d2d;
          border: none;
          cursor: pointer;
          margin-top: 4rem;
          border-radius: 10px;
          font-size: 5rem;
          color: #ffffff;
          width:  30vw;
          height: 10vh;
          margin-left: 17rem;
        }
    }
  }

</style>