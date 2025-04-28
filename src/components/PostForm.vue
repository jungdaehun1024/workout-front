<template >
     <div class="form-container">
        <div class="form-group">
          <label for="title">글 제목</label>
          <input type="text" v-model="title" id="title" class="form-input"  />
        </div>
  
        <div class="form-group">
          <label for="content">글 내용</label>
          <textarea v-model="content" id="content" class="form-textarea" ></textarea>
        </div>
        
        <div class="form-group">
          <label for="file" class="custom-addFile-btn">파일 첨부</label>
          <input type="file" id="file" class="form-input" multiple @change="handleFileUpload" style="display: none;">
        </div>
        <div class="form-group" v-if="files.length">
          <label for="fileList"> 첨부파일 목록</label>
          <p class="fileList" v-for="(file,idx) in files" :key="idx">
              {{ file.name }}
              <button @click="deleteFile(idx)">X</button>
          </p>
        </div>
  
        <div class="form-actions">
          <button class="submit-button" @click="saveBoard">저장</button>
          <button class="cancel-button">취소</button>
        </div>
      </div>
</template>
<script setup>
 import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { useBoardStore } from '@/stores/boardStore';
    import { storeToRefs } from 'pinia';

    // Input태그에 입력과 양방향 통신
    const title = ref("");  
    const content = ref(""); 
    const files = ref([]);

    const router = useRouter();
    const boardStore = useBoardStore();
    const {boardDetail} = storeToRefs(boardStore);

    //Session스토리지에 담긴 게시글 상세 정보가 있다->게시글 수정 (새로고침 해도 값 유지)
    //                                       없다.->게시글 생성 (빈 문자열)
    onMounted(()=>{
        const getSession = JSON.parse(sessionStorage.getItem("boardDetail"));
        const getBoardDetail = getSession?._value?.data;
        if(getBoardDetail){
            title.value = getBoardDetail?.title ;
            content.value = getBoardDetail?.content ;
        }else {
            title.value = "";
            content.value = "";
        }
    });

    //게시글 생성
    const createBoard = async() =>{
        try {
             const formData = new FormData();
             formData.append("title",title.value);
             formData.append("content",content.value);
             files.value.forEach((file)=>{
                formData.append("attachmentFiles",file);
             })
             await axios.post("/api/createBoard",formData,{
              headers:{
                "Content-Type" : "multipart/form-data",
              },
              withCredentials:true
             });

             alert("게시글이 작성에 성공했습니다.");
            router.push("/board");
        } catch (err) {
            console.error(err.message);
          }
        }

    //게시글 수정
    const modifyBoard = async()=>{
        try{
            await axios.put(`/api/updateBoard`,{
                title: title.value,
                content: content.value,
                boardId : boardDetail.value.data.boardId 
            })
            sessionStorage.clear(); // 수정 완료되면 세션 비우기
            
            // 기존 boardDetail 객체를 유지하면서 내부 값만 초기화
            //  (수정 중 게시글 생성 페이지로 넘어가면 기록이 남기때문)
            Object.assign(boardDetail.value, { data: {} });
            router.push("/board");
        }catch(err){
            console.err(err.message);
        }
    }

    //게시글 수정인지 생성인지 판단하고 함수 실행
    const saveBoard = ()=>{
        //게시글 상세 데이터가 있으면 수정
        if(boardDetail.value?.data?.boardId){
            modifyBoard();
        }else {
            createBoard();
        }
    }

    //첨부 파일을 받는 함수 
    const handleFileUpload = (event)=>{
        const selectedFiles = event.target.files; // 파일 리스트
        files.value = [...files.value , ...Array.from(selectedFiles)];  // 기존 배열에 새 파일들 추가.
        console.log(files.value);
    }

    //첨부파일 삭제 함수
    const deleteFile = (idx)=>{
      files.value.splice(idx,1);
    }
</script>
<style lang="scss" scoped>
    .form-container {
    display: flex;
    flex-direction: column;
    gap: 20px;


  }

  .custom-addFile-btn{
      cursor: pointer;
      background-color:  #4CAF50;
      border-radius: 4px;
      width: 5vw;
      color: black;
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