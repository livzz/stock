<template>
<div style="position:relative" v-bind:class="{'open':openSuggestion}">
  <input class ="input" type="text" v-model="selected" 
        @input="change">
    <div class="dropdown " v-bind:class="{'is-active':matched}" style="width:100%">
      <div class="dropdown-menu" id="dropdown-menu" role="menu">
        <div class="dropdown-content">
          <a href="#" v-for="(item,i) in filterList" class="dropdown-item" @click="itemClicked(i)">
            {{item.stockName}}
          </a>
        </div>
      </div>
    </div>
</div>
  
</template>
<script>
export default {
  data(){
    return {
      selected:"",
      matched:false,
      matchedArray:[],
    }
  },
  props:{
    name: {
      type:String,
      required:true
    },
    items:{
       type: Array,
       required:true,
    },
    
  },
  methods:{
    change(event){
     if(event.target.value !==""){
        this.matched = true;
     }else if (event.target.value ==""){
       this.matched = false;
     }
    },
    itemClicked(i){
      
      this.matched = false;
      this.selected = this.matchedArray[i].stockName;
      this.$emit('Selected',this.selected);
    },
  },
  created(){
        console.log(this.name);
        
  },
   computed:{
    filterList:function(){
      
      this.matchedArray = this.items.filter((data)=>{
        let patt = new RegExp("^"+this.selected+"");
         return data.stockName.match(patt);
      })
      return this.matchedArray;
    },
    openSuggestion() {
      return this.selected !== "";
     }
    // end of computes
  },
  mounted(){
  }
}

</script>

