import JoinView from "@/views/auth/JoinView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import MyPageView from "@/views/auth/user/MyPageView.vue";
import PasswordChangeView from "@/views/auth/user/PasswordChangeView.vue";

export default[
     {
        path:"/auth/join",
        name:"Join",
        component: JoinView,
     },{
         path:"/auth/login",
         name:"Login",
         component: LoginView,
    },{
        path:"/auth/user/myPage",
        name:"Mypage",
        component: MyPageView,
        meta:{requiresAuth: true}, // 보호된 페이지

    },
    {
        path:"/auth/user/passwordChange",
        name:"PasswordChange",
        component: PasswordChangeView,
        meta:{requiresAuth: true}, // 보호된 페이지

    }
]