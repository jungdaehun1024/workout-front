<template >
    <div class ="board-detail-container">
      <div class="board-elements">
          <div class="top-area">
          <div class="board-title">제목:{{boardDetail.data.title}}</div>
          <span class="board-date">{{ boardDetail.data.createdAt }}</span>
          </div>
          <hr class="area-line">
          <div class ="middel-area">
            <div class="board-account">{{ boardDetail.data.writerAccount }}</div>
            <div>[탭]{{boardDetail.data.categoryName}}</div>
          </div>

          <hr class="area-line">
          <div class="board-content">{{boardDetail.data.content}}</div>
           <hr class="area-line">  
          <div class =btns>
                <div class="board-ctr-btns">
                <button class="modify-btn" v-if="isWriter" @click="pushBoardId">수정</button>
                <button class="delete-btn" v-if="isWriter" @click="delBoard(boardDetail.data.boardId)">삭제</button>
                </div>
                <button class="back-page-btn" @click="mvBoardList">목록으로</button>
            </div>

          <div class="file-group">
          <label for="fileList"> 첨부파일 목록</label>
          <li class="file" v-for="(file,idx) in boardDetail.data.attachments" :key="idx">
            <span @click="downloadFile(file)">{{file.attachmentName}}</span> 
          </li>
        </div>
      </div>
    </div>
</template>
<script setup>
import { useBoardStore } from '@/stores/board/boardStore';
import { useUserStore } from '@/stores/user/userStore';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { onMounted,ref } from 'vue';
import {  useRouter } from 'vue-router';

const boardStore = useBoardStore();
const {boardDetail} = storeToRefs(boardStore);
const router = useRouter();

//게시글 상세에 접근한 사용자가 작성자인지 체크하는 토글
const isWriter =ref(false);

const userStore = useUserStore();
const {userInfo} = storeToRefs(userStore);

onMounted(async()=>{
  await userStore.getUserInfo();
  const wirterAccount = boardDetail.value.data.writerAccount;
  if(userInfo.value.account === wirterAccount){
    isWriter.value = true;
  }else{
    isWriter.value=false;
  }
})
//목록으로 돌아가는 메소드
const mvBoardList = ()=>{
    router.push("/");
}

//게시글 삭제
const delBoard = async(boardId)=>{
  const checkDelete = confirm("삭제된 뒤에는 복구할 수 없습니다.");
  if(checkDelete){
    try{
      await axios.delete("/api/board",{params:{
        boardId,
      }}); 
      alert("삭제가 완료되었습니다.");
       router.push("/");
      }catch(err){
         alert("삭제를 실패했습니다.");
      console.error("게시글 삭제 실패"+err.message);
      }

  } 
}

//수정 페이지로 이동
const pushBoardId = ()=>{
  sessionStorage.setItem("boardDetail",JSON.stringify(boardDetail));
  router.push("/board/modify");
}

//첨부파일을 다운로드
const downloadFile = (file)=>{
  const url = `/api/files/download?attachmentPath=${encodeURIComponent(file.attachmentPath)}&attachmentName=${encodeURIComponent(file.attachmentName)}`;
  
  //a태그를 동적으로 생성
  const link = document.createElement('a');
  link.href = url;
  link.download=''; // 클릭 시 이동이 아닌 다운로드
  document.body.append(link); // 
  link.click();
  document.body.removeChild(link);
}

</script>
<style  lang="scss" scoped >
.board-detail-container{
  display:flex;
  justify-content: center;
  align-items: center;
  background-color: #0a0a0a;
  font-family: sans-serif;
  font-size: 2.5rem;
  color:#ffffff ;
  .board-elements{
    margin-top: 20rem;
    background-color:#0a0a0a;
    width: 80vw;
    height: 70vh;
      .top-area{
        display: flex;
        justify-content: space-between;
        .board-date{
          font-size: 2rem;
        }
      }
      .top-area-line{
        width: 100%;
        height: 0.07rem;
        background-color: #ffffff ;
        border: none;
      }
      .middel-area{
        display: flex;
        justify-content: space-between;
      }
      .board-account{
       font-style: italic;
       font-size: 2rem;
      }
      .board-content{
        height: 60rem;
      }

      .btns{
        display: flex;
        justify-content: space-between;
        gap: 0.1rem;
        .board-ctr-btns{
          .modify-btn{
            background-color: #ffffff;
            font-size: 2rem;
            width: 20rem;
            height: 5rem;
            cursor: pointer;
            &:hover{
              background-color: rgb(214, 240, 17);
            }
            border-radius: 8px;
          }
          .delete-btn{
            background-color: #ffffff;
            width: 20rem;
            height: 5rem;
            font-size: 2rem;
            cursor: pointer;
            &:hover{
             background-color: rgb(243, 83, 65);
            }
            border-radius: 8px;
          }
        }
          .back-page-btn{
          background-color: #ffffff;
          width: 20rem;
          height: 5rem;
          font-size: 2rem;
          cursor: pointer;
          &:hover{
            background-color: rgb(45, 144, 224);
          }
          border-radius: 8px;
        }
      }

      .file-group{
        margin-top: 5rem;
        width: auto;
        .file{
          width: auto;
          &:hover{
            color: rgb(32, 201, 151);
          }
        }
      }

  }

}
   
</style>