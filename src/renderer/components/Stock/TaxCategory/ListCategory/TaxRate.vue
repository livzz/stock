<template>
  <div>
  <div class="container">
    <div class="box">
      <nav class="level">
        <!-- Left side -->
        <div class="level-left">
          <div class="level-item">
            <p class="subtitle is-4">
              Tax Rate for {{categoryName | capitalize }}
            </p>
          </div>
        </div>

        <!-- Right side -->
        <div class="level-right">
          <div class="buttons">
            <button class="button is-primary" @click="viewAddNewRate = true">Add New Rate</button>
            <button class="button is-dark" @click="$emit('hide')">Back</button>
          </div>
        </div>
      </nav>
    </div>
  <table class="table is-bordered is-striped is-fullwidth">
    <thead>
      <tr>
        <th>Serial no.</th>
        <th>Tax Rate</th>
        <th>Applicable From</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row,i) in rows">
          <td>{{ i + 1 }}</td>
          <td>
            {{row.value}}
          </td>
          <td>
            {{row.date}}
          </td>
      </tr>
    </tbody>
  </table>
  </div>
  <div class="modal" :class="{'is-active': viewAddNewRate}">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Tax Rate</p>
        <button class="delete" aria-label="close" @click="viewAddNewRate = false"></button>
      </header>
      <section class="modal-card-body">
        <div class="field">
          <label class="label">Tax Rate</label>
          <div class="control">
            <input class="input" type="number" placeholder="e.g.: 7, 8 " v-model="rate.value" required>
          </div>
        </div>
        <div class="field">
          <label class="label">Applicable from</label>
          <div class="control">
            <input class="input" type="date" placeholder="Date" v-model="rate.date" required>
          </div>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button is-success" @click="addTaxRate">Add</button>
        <button class="button" @click="viewAddNewRate = false">Cancel</button>
      </footer>
    </div>
  </div>
  </div>
</template>

<script>

  export default {
    name: "tax-rate",
    props: ["categoryName","db"],
    data() {
      return {
        rows: [],
        viewAddNewRate: false,
        rate: {
          value: '',
          date: ''
        }
      }
    },
    created() {
      this.db.category.findOne({category: this.categoryName}, (err, docs) => {
        if (err !== null) {
          alert("Error");
          console.log(err);
        } else {
          this.rows = docs.rateList;
        }
      });
    },
    methods: {
      addTaxRate() {
        let temp = this.rows.slice();
        temp.push(this.rate);
        this.db.category.update({ category: this.categoryName }, { $set: { rateList: temp.sort(this.rateListComparator) } }, { }, (err, numReplaced) => {
          if(err){
            alert("Error Occurred","Stock Manager");
            // this.rows.pop();
          } else {
            alert("New Rate Added","Stock Manager");
            this.viewAddNewRate = false;
            this.rows = temp.slice();
            this.rate = {
              value: '',
              date: ''
            }
          }
        });
      }
    }
  }
</script>

<style scoped>


</style>
