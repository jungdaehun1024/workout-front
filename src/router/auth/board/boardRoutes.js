import WriteView  from "@/views/board/WriteView.vue";
import BoardDetailView from "@/views/board/BoardDetailView.vue";
import { useBoardStore } from "@/stores/board/boardStore";
import ModifyView from "@/views/board/ModifyView.vue";


export default [
    {
            path: "/board/write",
            name:"Write",
            meta: { requiresAuth: true },
            component: WriteView,
          
        },
        {
            path: "/board/detail/:boardId",
            name:"BoardDetail",
            meta: { requiresAuth: true },
            beforeEnter: async(to, from, next) => {
                const boardStore = useBoardStore();
                await boardStore.getBoardDetail(to.params.boardId);
                next();
            },
            component: BoardDetailView,
        },
        {
            path: "/board/modify",
            name:"Modify",
            meta: { requiresAuth: true },
            component: ModifyView,
        }
]