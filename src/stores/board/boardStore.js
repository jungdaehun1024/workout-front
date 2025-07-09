import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useBoardStore  = defineStore("board",()=>{

    //State 

    const boards = ref([]); //게시글 목록
    const boardDetail = ref({}); // 게시글 상세 정보
    const boardsCount = ref(0);

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

    //불러오는 카테고리의 게시글 총 개수 
    // async function getBoardTotalCount(categoryId,depth){
    //     try{
    //         const response = await axios.get(`/api/totalBoards`,{params:{
    //             categoryId,
    //             depth
    //         },
    //         withCredentials:true});

    //         boardsCount.value = response.data.data;

    //     }catch(err){
    //         console.error(err.message);
    //     }

    // }

    //게시글 상세 가져오기 
    async function getBoardDetail(boardId) {
        try{
            const response = await axios.get(`/api/getBoardDetail/${boardId}`); // 게시글 목록 가져오기
            boardDetail.value = response.data;
        }catch(err){
            console.error(err.message);
        }
    }



    return {boardDetail,boards,boardsCount,getBoardDetail,getBoards}
});
