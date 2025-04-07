<template>
    <div class =container>
        <input type="hidden" id ="encPW" v-model="encryptPwd" >
        <div class="join-text">회원 가입</div>
        <div class ="form-container">
            <div class="form-group">
          <label for="title">아이디</label>
          <input type="text" v-model="account" id="title" class="form-input"  />
        </div>
        <div class="form-group">
          <label for="password">패스워드</label>
          <input type="text" v-model="password" id="password" class="form-input"  />
        </div>
        <div class="form-group">
          <label for="name">이름</label>
          <input type="text" v-model="name" id="name" class="form-input"  />
        </div>
        <div class="form-group">
          <label for="ph">전화번호</label>
          <input type="text" v-model="ph" id="ph" class="form-input"  />
        </div>
        <div class="form-group">
          <label for="email">이메일</label>
          <input type="text" v-model="email" id="email" class="form-input"  />
        </div>
        </div>
        <button @click="userJoin">회원가입</button>
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

.container{
    background-color: brown;
    display: flex;
    flex-direction: column; /* 각 form-group은 세로로 정렬 */
    justify-content: center;   /* 수평 중앙 정렬 */
    align-items: center;       /* 수직 중앙 정렬 */
    height: 100vh;
    width: 100vw;
    .join-text{
        font-size: 50px;
        color: white;
    }
    .form-container{
        background-color: rgb(235, 161, 65);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;   /* 세로 방향으로 상단 정렬 */
        height: 80vh;
        width: 60vw;
        
        .form-group{
                 font-size: 30px;
                 height: 5vh;
                 width: 40vw;
                 display: flex;
                 flex-direction: column;
                 justify-content: center;
                 margin-bottom: 20px; /* 각 항목 간 간격 */
           
        }
    }
 

}


  
</style>