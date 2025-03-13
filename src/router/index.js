import { createRouter, createWebHistory } from "vue-router";
import MainView  from "@/views/MainView.vue";
import WriteView  from "@/views/board/WriteView.vue";
import BoardView from  "@/views/board/BoardView.vue";
import BoardDetailView from "@/views/board/BoardDetailView.vue";
import { useBoardStore } from "@/stores/boardStore";
import ModifyView from "@/views/board/ModifyView.vue";

const routes = [
    {
        path: "/",
        name:"Main",
        component: MainView,

    },
    {
        path: "/board/write",
        name:"Write",
        component: WriteView,
    },
    {
        path: "/board",
        name:"Board",
        component: BoardView,
    },
    {
        path: "/board/detail/:boardId",
        name:"BoardDetail",
        beforeEnter: async(to, from, next) => {
            const boardStore = useBoardStore();
            await boardStore.getBoardDetail(to.params.boardId);
            next();
        },
        component: BoardDetailView,
    },{
        path: "/board/modify",
        name:"Modify",
        component: ModifyView,
    }

];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
