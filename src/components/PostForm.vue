<template >
     <div class="form-container">
        <div class="form-group">
          <div class="tab-toggle" @click="clickCategoryTab()">탭∇</div> 
          <div class="current-category">{{currentSelectedCategory.categoryName}}</div>
          <div class="category-dropdown" v-if="selectCategoryToggle">
            <div class="category-dropdown-list" @click="clickCategory(category)" v-for="(category,index) in creatableCategories" :key="index" >{{ category.categoryName }}||</div>
          </div>
             
          
        </div>
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
          <button class="cancel-button" @click="cancelBoardWrite">취소</button>
        </div>
      </div>
</template>
<script setup>
 import { onMounted, onUnmounted, ref } from 'vue';
    import { onBeforeRouteLeave, useRouter } from 'vue-router';
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
    const {boardDetail,creatableCategories} = storeToRefs(boardStore);
    const isSafeToLeave = ref(false); // 이동 허용 여부
    const currentSelectedCategory = ref({});
    const selectCategoryToggle = ref(false);
    //Session스토리지에 담긴 게시글 상세 정보가 있다->게시글 수정 (새로고침 해도 값 유지)
    //                                       없다.->게시글 생성 (빈 문자열)
    onMounted(async()=>{
        const getSession = JSON.parse(sessionStorage.getItem("boardDetail"));
        const getBoardDetail = getSession?._value?.data;
        await boardStore.getCreatableCategories();
        window.addEventListener("beforeunload",handleBeforeUnload);
        if(getBoardDetail){
            title.value = getBoardDetail?.title ;
            content.value = getBoardDetail?.content;
            currentSelectedCategory.value = {
                categoryId : getBoardDetail?.categoryId,
                categoryName : getBoardDetail?.categoryName
            }
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


    onUnmounted(()=>{
      window.removeEventListener("beforeunload",handleBeforeUnload);
    })

    //라우터 이동을 감지
    onBeforeRouteLeave((to,from,next)=>{
      if(isSafeToLeave.value){
        next();
        return;
      }
      const answer = confirm("페이지 이동시 작성중이던 내용은 저장되지 않습니다.");
      if(answer){
        next();
      }else{
        next(false);
      }
    });
    const handleBeforeUnload = (evnet) =>{
      event.preventDefault(); // 기본 동작을 막음
      evnet.returnValue=""; 
    }
    //게시글 생성
    const createBoard = async() =>{
        try {
             if(!currentSelectedCategory.value || Object.keys(currentSelectedCategory.value).length === 0){
                alert("카테고리 정보를 선택해주세요");
                return;
             }
             if(!title.value.trim()){
               alert("게시글 제목은 필수 입력입니다.");
               return;
             }
             if(!content.value.trim()){
               alert("게시글 본문은 필수 입력입니다.");
               return;
             }
             const formData = new FormData();
             formData.append("title",title.value);
             formData.append("content",content.value);
             formData.append("categoryId",currentSelectedCategory.value.categoryId);
             files.value.forEach((file)=>{
                formData.append("attachmentFiles",file);
             })
             const response = await boardStore.postBoard(formData);
             if(response.data.status !== 201){
                alert("게시글 작성에 실패했습니다.");
                router.push("/");
             }
            alert("게시글이 작성에 성공했습니다.");
            router.push("/");
        } catch (err) {
            console.error(err.message);
          }
        }

    //게시글 수정
    const modifyBoard = async()=>{
        try{
            const formData = new FormData();
            formData.append("boardId",boardDetail.value.data.boardId);
            formData.append("title",title.value);
            formData.append("content",content.value);
            formData.append("categoryId",currentSelectedCategory.value.categoryId);
            formData.append("deleteAttachmentsList",JSON.stringify(deleteReqFiles.value));
            files.value.forEach((file)=>{
                formData.append("attachmentFiles",file);
             });

            const response = await boardStore.putBoard(formData);
            if(response.data.status !== 200){
              alert("수정 중 에러가 발생했습니다.");
              router.push("/");
            }
            sessionStorage.clear(); // 수정 완료되면 세션 비우기
            
            // 기존 boardDetail 객체를 유지하면서 내부 값만 초기화
            //  (수정 중 게시글 생성 페이지로 넘어가면 기록이 남기때문)
            Object.assign(boardDetail.value, { data: {} });
             alert("게시글이 수정에 성공했습니다.");
            router.push("/");
        }catch(err){
            console.error(err.message);
        }
    }

    //게시글 수정인지 생성인지 판단하고 함수 실행
    const saveBoard = ()=>{
        isSafeToLeave.value= true;
        //게시글 상세 데이터가 있으면 수정
        if(boardDetail.value?.data?.boardId){
            modifyBoard();
        }else {
            createBoard();
        }
    }

    const cancelBoardWrite = ()=>{
        const checkCancel = confirm("수정을 취소하시겠습니까?");
        if(checkCancel){
          isSafeToLeave.value = true;
          router.push("/");
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

    //드롭다운 토글
    const clickCategoryTab = ()=>{
        selectCategoryToggle.value = !selectCategoryToggle.value;
    }

    //카테고리 선택
    const clickCategory = (category)=>{
      currentSelectedCategory.value = category;
      selectCategoryToggle.value = !selectCategoryToggle.value
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
    background-color: #0e0e0e;
    height:auto;
    width: 80vw;
     .tab-toggle{
      margin-top: 1rem;
     }
     .current-category{
       margin-top: 1rem;
     }
     .category-dropdown{
      
       display: flex;
      
        .category-dropdown-list{
          font-size: 2rem;
          // color: red;
        }
      }
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