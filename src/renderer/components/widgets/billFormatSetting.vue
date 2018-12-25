<template>
    <div class="modal" :class="{'is-active': show }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Bill Format Setting</p>
                <button class="delete" aria-label="close" @click="$emit('toggle',!show)"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Current Bill Format</label>
                        <div class="select">
                            <select>
                                <option selected>Regular</option>
                                <option>Composite</option>
                                <option>Exempt</option>
                            </select>
                        </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success">Update</button>
                <button class="button" @click="$emit('toggle',!show)">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
  name: "bill-format-setting",
  props: {
    show: Boolean,
  },
};
</script>

<style scoped>

</style>
