<template>
    <div class="write-page">
      <h1 class="title">글 쓰기 페이지</h1>
  
      <div class="form-container">
        <div class="form-group">
          <label for="title">글 제목</label>
          <input type="text" v-model="title" id="title" class="form-input" placeholder="글 제목을 입력하세요" />
        </div>
  
        <div class="form-group">
          <label for="content">글 내용</label>
          <textarea v-model="content" id="content" class="form-textarea" placeholder="글 내용을 입력하세요"></textarea>
        </div>
  
        <div class="form-actions">
          <button class="submit-button" @click="createBoard">작성 완료</button>
          <button class="cancel-button">취소</button>
        </div>
      </div>
    </div>
  </template>
  <script setup>
    import { ref } from 'vue';
    import axios from 'axios';
import { useRouter } from 'vue-router';

    const title = ref("");
    const content = ref(""); 
    const router = useRouter();

    const createBoard = async() =>{
        try {
             await axios.post("/api/createBoard",{
                title: title.value,
                content: content.value

            });
            
            router.push("/board");
            
        } catch (error) {
            console.log(error.message);
            
        }

    }


   
  </script>
   
  <style scoped>
  .write-page {
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .title {
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
    color: #333;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
  }
  
  label {
    font-size: 16px;
    margin-bottom: 8px;
    color: #555;
  }
  
  .form-input,
  .form-textarea {
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .form-textarea {
    min-height: 150px;
    resize: vertical;
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
  }
  
  .submit-button,
  .cancel-button {
    padding: 10px 20px;
    font-size: 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
  }
  
  .submit-button {
    background-color: #4CAF50;
    color: white;
  }
  
  .cancel-button {
    background-color: #f44336;
    color: white;
  }
  
  .submit-button:hover {
    background-color: #45a049;
  }
  
  .cancel-button:hover {
    background-color: #e53935;
  }
  </style>
  