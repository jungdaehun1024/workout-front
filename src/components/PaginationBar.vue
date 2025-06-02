<template>
  <div class="pagination">
    <button class="prev-btn" @click="prevGroup" :disabled="currentGroup === 0">＜</button>
    <button
      v-for="page in calcVisiblePaginationIndex"
      :key="page"
      @click="getClickPaginationIndex(page)"
      class="pagination-index"
    >
      {{ page }}
    </button>
     <button class="next-btn"
      @click="nextGroup"
      :disabled="(currentGroup + 1) * pageBtnSize >= paginationTotalIndex"
    >></button>
  </div>
</template>
<script setup>
// eslint 에러 회피용 (실제로는 사용되지 않음)
import { defineProps, defineEmits, ref, computed } from 'vue'

const props = defineProps(["totalCount"]);
const emit = defineEmits(['changePage']);
const pageSize = 10; // 한 페이지에 보여줄 데이터 수 
const pageBtnSize = 5; //한 번에 보여줄 페이지 버튼 수 
const currnetGroup = ref(0); // 현재 페이지 버튼 그룹 인덱스 

//페이지네이션 버튼 총 인덱스 계산 함수
const calcPaginationTotalIndex = ((props)=>{

    //나머지가 있을 때 (몫 + 1)
    if(props.totalCount % pageSize !== 0){
        const pageTotalIndex = (Math.floor(props.totalCount / pageSize)+1);
        return pageTotalIndex;
    }else {
        const pageTotalIndex = Math.floor(props.totalCount / pageSize);     
        return pageTotalIndex ;
    }
});


//페이지네이션 인덱스
const paginationTotalIndex = calcPaginationTotalIndex(props);


//클릭하는 페이지네이션 인덱스 반환
const getClickPaginationIndex = ((page)=>{
    emit("changePage",page);
});

//표시될 페이징 버튼 계산.  ex) |0|1|2|3|4|
const calcVisiblePaginationIndex = computed(()=>{
  const start = currnetGroup.value * pageBtnSize;
  const end = Math.min(start+pageBtnSize, paginationTotalIndex);
  return Array.from({ length: end - start }, (_, i) => start + i);
});


//다음 그룹의 첫 번째 인덱스를 계산해서 총 인덱스보다 작으면 > 활성화
const nextGroup = ()=>{
  if((currnetGroup.value+1)* pageBtnSize < paginationTotalIndex){
    currnetGroup.value++;
  }
};

//현재 인덱스그룹이 0보다 크면 이전으로 이동 가능
const prevGroup= ()=>{
  if(currnetGroup.value >0){
    currnetGroup.value --;
  }
};
</script>

<style lang="scss" scoped>
.pagination{
  padding:3rem;
  display: flex;
  justify-content: end;
  .prev-btn{
    &:hover{
      background-color: aqua;
    }
  }
  .next-btn{
      &:hover{
      background-color: aqua;
    }
  }

  .pagination-index{
    &:hover{
       background-color: aqua;
    }
  }

 
}
</style> 