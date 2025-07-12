import WriteView  from "@/views/board/WriteView.vue";
import BoardDetailView from "@/views/board/BoardDetailView.vue";
import { useBoardStore } from "@/stores/board/boardStore";
import ModifyView from "@/views/board/ModifyView.vue";


export default [
    {
            path: "/board/write",
            name:"Write",
            component: WriteView,
          
        },
        {
            path: "/board/detail",
            name:"BoardDetail",
            beforeEnter: async(to, from, next) => {
                const boardStore = useBoardStore();
                await boardStore.getBoardDetail(to.query.boardId);
                next();
            },
            component: BoardDetailView,
        },
        {
            path: "/board/modify",
            name:"Modify",
            component: ModifyView,
        }
]