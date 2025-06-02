import { createRouter, createWebHistory } from "vue-router";
import MainView  from "@/views/MainView.vue";
import axios from "axios";
import boardRoutes from "./auth/board/boardRoutes";
import userRoutes from "./auth/user/userRoutes";

const routes = [
    {
        path: "/",
        name:"Main",
        component: MainView,

    },
    ...boardRoutes,
    ...userRoutes
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach(async()=>{  
    
    try{
        //로그인 여부 체크(매 라우트마다)
        const checkResult = await axios.get("/api/auth/loginCkeck",{
            withCredentials:true
        });

        //서버에서 토큰 검증이 되어 true를 반환 받으면 세션 스토리지에 값 저장
         if(checkResult.data.data){
            localStorage.setItem("isLogin","true");
            }else{
            localStorage.setItem("isLogin","false");
            }
    }catch(err){
        console.error(err.message);
     }
})

export default router;
