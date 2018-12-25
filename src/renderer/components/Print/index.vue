<template>
<div>
    <br><br>
    <nav class="level">
        <div class="level-item">
            <p class="level-item"><a class="button is-success" @click="printToPdf">Print</a></p>
        </div>
    </nav>
    
    <div class="container">
      <h1 class="title has-text-centered" >
        {{company.name}}
      </h1>
      <p class="subtitle has-text-centered">
        {{company.title}}
      </p>
      <div class="subtitle ">
        <table class="table is-bordered  is-striped  is-narrow  is-fullwidth"  style="margin:1em auto;">
          <thead>
            <tr>
                <th>Serial No</th>
                <th v-for="head in company.th">{{head}}</th>  
            </tr>
          </thead>
          <tfoot>
              <tr>
                <th>Serial No</th>
                <th v-for="head in company.th">{{head}}</th>
            </tr>
          </tfoot>
            <tbody>
            <tr v-for="(row,i) in company.table">
              <th>{{ i + 1 }}</th>
                <td v-for="(dat,i) in row">
                    {{dat}}
                </td>
            </tr>
          </tbody>
      </table>
      </div>
    </div>
</div>
    
</template>

<script>
export default {
  name: "index",
  data() {
      return {
          company:{
              name:"",
              title:"",
              th:{},
              td:{},
          }
      }
  },
  computed:{
    
  },
  mounted(){
    this.$electron.ipcRenderer.on('message', (event, data) => {
        data.table.forEach(row => {
          delete row._id;
        });
        this.company.name = data.name;
        this.company.title = data.title;
        this.company.table = data.table;
        this.company.th = Object.getOwnPropertyNames(data.table[0]);
   })
  },
  created(){   
  },
  methods:{
      printToPdf:function(){
          console.log('print called');
          
          window.print();
      },
       getValue:function(key){
         
         return ;
    }
     
  }
};
</script>

<style>
html, body, {
    position:fixed;
    top:0;
    bottom:0;
    left:0;
    right:0;
}
th{
    font-size: 15px;
}
td{
    font-size: 12px;
}
</style>
