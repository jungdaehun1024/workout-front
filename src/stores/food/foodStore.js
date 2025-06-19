import { defineStore } from "pinia";
import { ref } from "vue";

export const useFoodStore = defineStore("food",()=>{

    //state
    const inputPastDate = ref(""); // 과거 식단 검색 입력




    return {inputPastDate}
})