import { defineStore } from "pinia";
import { ref } from "vue";

export const useCategoryStore = defineStore("category",()=>{
    
    //State 
    const currentCategory = ref({});
    const allCategories = ref([]);


    return {currentCategory,allCategories}
})