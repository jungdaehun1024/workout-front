import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useBoardStore  = defineStore("board",()=>{

    //State 

    const boards = ref([]); //게시글 목록
    const boardDetail = ref({}); // 게시글 상세 정보
    const boardsCount = ref(0);
    const creatableCategories = ref([]);

    //Action

    //게시글 목록 가져오기()
    async function getBoards(categoryId,depth,paginationIndex){
        try{
            const response = await axios.get("/api/boards",{params:{
                categoryId,
                depth,
                paginationIndex,
                },
                withCredentials:true}); // 게시글 목록 가져오기
            boards.value = response.data.data;
        }catch(err){
            console.error(err.message);
        }
    }

    //게시글 상세 가져오기 
    async function getBoardDetail(boardId) {
        try{
            const response = await axios.get("/api/board-detail",{
                params:{
                    boardId,
                },withCredentials:true
            }); // 게시글 목록 가져오기
            boardDetail.value = response.data;
        }catch(err){
            console.error(err.message);
        }
    }

    //게시글 생성 가능한 카테고리 목록
    async function getCreatableCategories() {
        try{
            const response = await axios.get("/api/creatable-categories",{withCredentials:true});
            creatableCategories.value = response.data.data
        }catch(err){
            console.error(err.message);
        }
        
    }

    //게시글 생성
    async function postBoard(formData) {
        try{
          const response= await axios.post("/api/board",formData,{
                headers:{
                    "Content-Type" : "multipart/form-data",
                },withCredentials:true
            });

            return response;
        }catch(err){
            console.error(err.message);
        } 
    }

    //게시글 수정
    async function putBoard(formData) {
        try{
           const response= await axios.put("/api/board",formData,{
                headers:{
                    "Content-Type" : "multipart/form-data",
                },
                withCredentials:true,
            });

            return response;



        }catch(err){
            console.error(err.message);
        }
        
    }



    return {boardDetail,boards,boardsCount,creatableCategories,getBoardDetail,getBoards,getCreatableCategories,postBoard,putBoard}
});
