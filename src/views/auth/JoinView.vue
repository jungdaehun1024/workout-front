<template>
    <div class =signup-box>
        <input type="hidden" id ="encPW" v-model="encryptPwd" >
        <div class="join-text">회원 가입</div>
        <div class ="form-container">
          <div class="form-group">
          <label for="title">아이디</label>
          <input type="text" v-model="account" id="title" class="form-input" placeholder="아이디를 입력해주세요" />
          </div>
        <div class="form-group">
          <label for="password"  >패스워드</label>
          <input type="text" v-model="password" id="password" class="form-input" placeholder="패스워드를 입력해주세요"  />
        </div>
        <div class="form-group">
          <label for="name" >이름</label>
          <input type="text" v-model="name" id="name" class="form-input"  placeholder="이름을 입력해주세요" />
        </div>
        <div class="form-group">
          <label for="ph" >전화번호</label>
          <input type="text" v-model="ph" id="ph" class="form-input" placeholder="전화번호를 입력해주세요"  />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="text" v-model="email" id="email" class="form-input"  placeholder="이메일을 입력해주세요" />
        </div>
            <button class="siginup-btn" @click="userJoin">회원가입</button>
        </div>
      
    </div>
</template>
<script setup>
import forge from 'node-forge';
import axios from 'axios';
import { onMounted,ref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();

//공개키 모듈러스,공개지수
const publicModules = ref("");
const publicExponent = ref("");
const account = ref("");
const password = ref("");
const name = ref("");
const ph = ref("");
const email = ref("");
const encryptPwd =ref("");

onMounted(async()=>{
    try{
        const res = await axios.get("/api/getPublicKeyModule");
        const {data} = res.data;
        publicModules.value = data.publicKeyModules;
        publicExponent.value = data.publicKeyExponent;
    }catch(err){
        console.error(err.message);
    }
 
   
});

//공개 키 생성 함수
const encryptData = ()=>{
  const rsa = forge.pki.rsa;
  const publicKey = rsa.setPublicKey(
   new forge.jsbn.BigInteger(publicModules.value,16),
   new forge.jsbn.BigInteger(publicExponent.value,16)
  );
  //공개 키를 사용한 RSA 암호화(OAEP 패딩 사용)
  const encrypted = publicKey.encrypt(password.value.trim(),"RSA-OAEP");
  encryptPwd.value = forge.util.encode64(encrypted);
}


//회원가입 요청
const userJoin = async()=>{
  try{
    encryptData();
    await axios.post("/api/auth/registerUser",{
      account: account.value,   
      password: encryptPwd.value,
      name: name.value,
      ph: ph.value,
      email: email.value
      });
      router.push("/");
  }catch(err){
    console.error(err.message)
  }
}


</script>
<style lang="scss" scoped>
  .signup-box{
      background-color: #0e0e0e;
      color: #ffffff;
      width: 100%;

    .join-text{
      margin-left: 17rem;
        font-size: 5rem;
        text-align: center;
   
    }
    .form-container{
      background-color: inherit;
      min-height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
      align-items: center;
      .form-group{
        display: flex;
        align-items: center;
       justify-content: center;
        font-size: 4rem;
        margin:5rem;
        text-align: center;

        label{
          padding-right: 2rem;
          width: 15rem;
          text-align: right;
        }
        .form-input{
          background-color: rgb(233,233,233);
          flex-grow: 0.5; /* 너비 유동적 */
          font-size: 3.5rem;
          border-radius: 6px;
          height: 5rem;
          width: 100rem;
          &.form-input::placeholder{
            color: #0e0e0e;
            text-align: center;
            font-size: 2rem;
          }
        }
      }
        .siginup-btn{
          background-color: #302d2d;
          border: none;
          cursor: pointer;
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