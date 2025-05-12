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

router.beforeEach(async(to)=>{  
    
    try{
        //로그인 여부 체크(매 라우트마다)
        if (to.path !== "/"){
            const checkResult = await axios.get("/api/auth/loginCkeck",{
                withCredentials:true
            });
            console.log(checkResult.data.data);
            //서버에서 토큰 검증이 되어 true를 반환 받으면 세션 스토리지에 값 저장
            if(checkResult.data.data){
                localStorage.setItem("isLogin", "true");
            }else{
                localStorage.setItem("isLogin","false");
            }
        }
        
    }catch(err){
        console.error(err.message);
     }

    //토큰이 존재하지 않으면 인증이 필요한 페이지 접근 불가능
    // const isAuthenticated = !!localStorage.getItem("jwt"); // JWT토큰 존재 여부 체크
    // if(to.meta.requiresAuth){
    //     alert("로그인 후 이용해주세요");
    //     next("/"); // 인증되지 않은 경우 메인페이지로 이동 
    // }else{
    //     next();
    // }
})

export default router;
