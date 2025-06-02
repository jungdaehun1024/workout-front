import axios from "axios";
import { defineStore } from "pinia";
import { ref } from 'vue'

export const useBoardStore  = defineStore("board",()=>{

    //State 

    const boards = ref([]); //게시글 목록
    const boardDetail = ref({}); // 게시글 상세 정보

    //Action

    //게시글 목록 가져오기
    async function getBoards(paginationIndex){
        try{
            const response = await axios.get("/api/getBoards",{params:{paginationIndex},withCredentials:true}); // 게시글 목록 가져오기
            boards.value = response.data;
        }catch(err){
            console.error(err.message);
        }
    }

    //게시글 상세 가져오기 
    async function getBoardDetail(boardId) {
        try{
            const response = await axios.get(`/api/getBoardDetail/${boardId}`); // 게시글 목록 가져오기
            boardDetail.value = response.data;
        }catch(err){
            console.error(err.message);
        }
    }

    return {boardDetail,boards,getBoardDetail,getBoards}
})