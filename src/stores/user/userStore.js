import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue"

export const useUserStore = defineStore("user",()=>{

    //State
    const userInfo = ref({});

    //Action

    //사용자 정보 가져오기
    async function getUserInfo(){
        try{
            const response = await axios.get("/api/getUserInfo",{
                withCredentials: true
            });
            console.log(response);

            userInfo.value = response.data.data;

        }catch(err){
            console.error(err.message);
        }
        
    }

    return {getUserInfo,userInfo}
})