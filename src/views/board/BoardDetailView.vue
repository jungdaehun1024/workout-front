<template >
    <div class = "container" id = "container">
        <div class="board">
            <div class ="boardFlexContent">
                <div class="boardTitle">제목:{{boardDetail.data.title}}</div>
                <div class="boardId">게시글 ID:{{boardDetail.data.boardId}}</div>
                
            </div>
            <div class="boardContent">내용:{{boardDetail.data.content}} {{ backBoardList }}</div>
            <div class =btns>
                <button @click="pushBoardId">수정</button>
                <button @click="delBoard(boardDetail.data.boardId)">삭제</button>
                <button @click="mvBoardList">목록으로</button>
            </div>

          <div class="form-group">
          <label for="fileList"> 첨부파일 목록</label>
          <li v-for="(file,idx) in boardDetail.data.attachments" :key="idx">
            <button @click="downloadFile(file)">{{file.attachmentName}}</button>
          </li>
        </div>
    
  
        </div>
     
    </div>
</template>
<script setup>
import { useBoardStore } from '@/stores/boardStore';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import {  useRouter } from 'vue-router';

const boardStore = useBoardStore();
const {boardDetail} = storeToRefs(boardStore);
const router = useRouter();

//목록으로 돌아가는 메소드
const mvBoardList = ()=>{
    router.push("/board");
}

//게시글 삭제
const delBoard = async(boardId)=>{
        try{
            await axios.put(`/api/deleteBoard/${boardId}`); 
        }catch(err){
            console.error("게시글 삭제 실패"+err.message);
        }
    router.push("/board");
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
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* 부모 컨테이너에 높이 추가 */
  background-color: rgb(148, 144, 144);
  box-sizing: border-box; /* 패딩을 포함한 크기 계산 */

  .board {
    display: flex;
    flex-direction: column; /* 수직 정렬 */
    justify-content: center;
    align-items: center;
    width: 70%;
    height: 80vh; /* 너무 크면 조절 */
    background-color: rgb(65, 60, 60);
    color: white; /* 글씨 보이도록 */
    font-size: larger;

    .boardContent{
        width: 100%;
        height: 100vh;
        background-color: rgb(56, 54, 54);
    }
    .boardFlexContent {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 10vh;
      background-color:  rgb(71, 70, 70);
      .boardTitle{
        width: 50%;
        height: 30vh;
        padding: 10px;
      }
      .boardId{
        width: 50%;
        text-align: right;
        padding: 10px;
      }
    }
  }
}


    
</style>