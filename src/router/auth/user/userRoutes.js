import JoinView from "@/views/auth/JoinView.vue";
import LoginView from "@/views/auth/LoginView.vue";
import DietPageView from "@/views/auth/user/diet/DietPageView.vue";
import FoodRecordDetailView from "@/views/auth/user/diet/foodRecordDetailView.vue";
import FoodSearchDetailView from "@/views/auth/user/diet/FoodSearchDetailView.vue";
import FoodSearchView from "@/views/auth/user/diet/FoodSearchView.vue";
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

    },
     {
        path:"/auth/diet/dietPage",
        name:"dietPage",
        component: DietPageView,

    },
     {
        path:"/auth/diet/foodSearchPage",
        name:"foodSearchPage",
        component: FoodSearchView,

    },
     {
        //검색한 음식 정보 상세
        path:"/auth/diet/foodSearchDetail",
        name:"foodSearchDetail",
        component: FoodSearchDetailView,

    },
     {  
        //저장한 식단 상세보기
        path:"/auth/diet/foodRecordDetail",
        name:"foodRecordDetail",
        component: FoodRecordDetailView,  

    }
]