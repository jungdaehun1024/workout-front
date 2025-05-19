<template >
     <div class="form-container">
        <div class="form-group">
          <label class="label-title" for="title">글 제목</label>
          <input type="text" v-model="title" id="title" class="input-title"  />
        </div>
  
        <div class="form-group">
          <label class="label-content" for="content">글 내용</label>
          <textarea v-model="content" id="content" class="form-textarea" ></textarea>
        </div>
        
        <div class="form-group">
          <label for="file" class="custom-addFile-btn">파일 첨부</label>
          <input type="file" id="file" class="form-input" multiple @change="handleFileUpload" style="display: none;">
        </div>
        <div class="form-group" v-if="files.length" >
          <label for="fileList"> 첨부파일 목록</label>
          <p class="fileList" v-for="(file,idx) in files" :key="idx">
              {{ file.name }}
              <button @click="deleteFile(idx)">X</button>
          </p>
        </div>
        <div class="form-group" v-if="existFiles.length>0" >
          <label for="fileList"> 기존 첨부파일 목록</label>
          <p class="fileList" v-for="(file,idx) in existFiles" :key="idx">
              {{ file.attachmentName }}
              <button @click="deleteExistFile(file,idx)">X</button>
          </p>
        </div>
  
        <div class="form-actions">
          <button class="submit-button" @click="saveBoard">작성</button>
          <button class="cancel-button">취소</button>
        </div>
      </div>
</template>
<script setup>
 import { onMounted, ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { useBoardStore } from '@/stores/board/boardStore';
    import { storeToRefs } from 'pinia';

    // Input태그에 입력과 양방향 통신
    const title = ref("");  
    const content = ref(""); 
    const files = ref([]); // 새로 첨부하는 파일 
    const existFiles = ref([]); // 기존해 존재했던 파일 (게시글 상세보기에 표시)
    const deleteReqFiles =ref([]); // 상세보기에서 x누르면 첨부파일 고유번호 저장 후 삭제 요청

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

            //게시글 생성할 때 저장됐던 파일의 정보
            existFiles.value = getBoardDetail?.attachments.map((item)=>({
              attachmentId : item.attachmentId,
              attachmentMIME:  item.attachmentMIME,
              attachmentName: item.attachmentName,
              attachmentPath: item.attachmentPath,
              boardId : item.boardId,
            }));      
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
            const formData = new FormData();
            console.log(boardDetail.value.data);
            formData.append("boardId",boardDetail.value.data.boardId);
            formData.append("title",title.value);
            formData.append("content",content.value);
            formData.append("deleteAttachmentsList",JSON.stringify(deleteReqFiles.value));
            files.value.forEach((file)=>{
                formData.append("attachmentFiles",file);
             });

            await axios.put(`/api/updateBoard`,formData,{
              headers:{
                "Content-Type" : "multipart/form-data",
              },
              withCredentials:true,
            });
            sessionStorage.clear(); // 수정 완료되면 세션 비우기
            
            // 기존 boardDetail 객체를 유지하면서 내부 값만 초기화
            //  (수정 중 게시글 생성 페이지로 넘어가면 기록이 남기때문)
            Object.assign(boardDetail.value, { data: {} });
            router.push("/board");
        }catch(err){
            console.error(err.message);
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

    //첨부 파일을 다루는 함수 
    const handleFileUpload = (event)=>{
      const selectedFiles = event.target.files; // 파일 리스트
      files.value = [...files.value , ...Array.from(selectedFiles)];  // 기존 배열에 새 파일들 추가.
    
    }

    
    
      
    //첨부파일 삭제 함수
    const deleteFile = (idx)=>{
      files.value.splice(idx,1);
    }

    const deleteExistFile =(file,idx)=>{
      existFiles.value.splice(idx,1);

      // 삭제 대상 목록에 추가
    deleteReqFiles.value = [
      ...deleteReqFiles.value,
      {
        attachmentId: file.attachmentId,
        attachmentPath: file.attachmentPath,
        attachmentName: file.attachmentName,
      }
    ];
      console.log("삭제되는 기존 파일 정보");
      console.log(deleteReqFiles.value);

    }
</script>
<style lang="scss" scoped>
 .form-container{
  display: flex; /* flex container로 설정 */
  justify-content: center; /* 수평 가운데 정렬 */
  flex-direction: column;
  align-items: center;     /* 수직 가운데 정렬 */
  background-color: #0e0e0e;
  height: 100vh;
  color: #ffffff;
  font-size: 2.5rem;
    font-family: sans-serif;
   gap: 8rem; // 폼 간 적절한 간격
  .form-group{   
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    background-color: #0e0e0e;
    height:auto;
    width: 80vw;
      margin-bottom: 0; /* 아래쪽 간격 조절 */
     .label-title{
      font-size: 3rem;
      margin-bottom: 1rem;
     }
     .input-title{
       width:  80vw;; 
       height: 5rem;
       font-size: 2.5rem;
       border-radius: 7px;
     }
     .label-content{
       font-size: 3rem;
       margin-bottom: 1rem;
     }
     .form-textarea{
      resize: none;
      width: 80vw;
      height: 30vh;
      font-size: 2.5rem;
       border-radius: 7px;
     }
  }

  .submit-button{
    background-color: #ffffff;
    border-radius: 7px;
    width: 50rem;
    height: 5rem;
    cursor: pointer;
    font-size: 2.5rem;
    &:hover{
      background-color: rgb(194, 234, 64);
    }
  }

    .cancel-button{
    background-color: #ffffff;
    border-radius: 7px;
    width: 50rem;
    height: 5rem;
    cursor: pointer;
    font-size: 2.5rem;
    &:hover{
      background-color: rgb(243, 83, 65);
    }
  }

 }
   
</style>