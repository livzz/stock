<template>
    <div class="modal" :class="{'is-active': show }">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Your Profile</p>
                <button class="delete" aria-label="close" @click="$emit('toggle',!show)"></button>
            </header>
            <section class="modal-card-body">
                <div class="field">
                    <label class="label">Name</label>
                    <div class="control">
                        <input class="input" type="text" placeholder="e.g Alex Smith" v-model="profile.name">
                    </div>
                </div>
                <div class="field is-grouped has-addons">
                    <a class="button is-static">
                        Email
                    </a>
                    <div class="control">
                        <input class="input" type="email" placeholder="e.g. alexsmith@gmail.com"
                               v-model="profile.email">
                    </div>
                    <a class="button is-static">
                        +91
                    </a>
                    <p class="control is-expanded">
                        <input class="input" maxlength="10" placeholder="Your phone number"
                               v-model="profile.phone">
                    </p>
                </div>

                <div class="field">
                    <label class="label">Goods and Services Tax Identification Number (GSTIN)</label>
                    <div class="control">
                        <input class="input" maxlength="15" placeholder="e.g. 22AAAAA0000A1Z5" v-model="profile.GSTIN">
                    </div>
                </div>
                <div class="field">
                    <label class="label">Address</label>
                    <div class="control">
                        <textarea class="textarea" placeholder="e.g G. S Road, Block No. 23 "
                                  v-model="profile.address"></textarea>
                    </div>
                </div>
                <div class="field is-grouped">
                    <div class="field">
                        <label class="label">State</label>
                        <div class="control">
                            <input class="input" placeholder="e.g. Assam" v-model="profile.state">
                        </div>
                    </div>
                    <div class="control"></div>
                    <div class="field">
                        <label class="label">District</label>
                        <div class="control">
                            <input class="input" placeholder="e.g. Jorhat" v-model="profile.district">
                        </div>
                    </div>
                </div>
            </section>
            <footer class="modal-card-foot">
                <button class="button is-success" @click="submit">Update</button>
                <button class="button" @click="$emit('toggle',!show)">Cancel</button>
            </footer>
        </div>
    </div>
</template>

<script>
/* eslint-disable space-before-function-paren */

// import Datastore from 'nedb'
import { mapGetters, mapActions } from "vuex";

export default {
  name: "profile",
  props: {
    show: Boolean,
  },
  data() {
    return {
      category: "",
      db: {},
      profile: {
        name: "",
        email: "",
        phone: "",
        GSTIN: "",
        address: "",
        state: "",
        district: "",
      },
    };
  },
  methods: {
    submit() {
      this.setName(this.profile.name);
      this.setEmail(this.profile.email);
      this.setPhone(this.profile.phone);
      this.setGSTIN(this.profile.GSTIN);
      this.setAddress(this.profile.address);
      this.setState(this.profile.state);
      this.setDistrict(this.profile.district);
      this.$emit("toggle", !this.show);
    },
    ...mapActions([
      "setProfile",
      "setName",
      "setEmail",
      "setPhone",
      "setGSTIN",
      "setAddress",
      "setState",
      "setDistrict",
    ]),
  },
  computed: {
    ...mapGetters([
      "getName",
      "getEmail",
      "getPhone",
      "getGSTIN",
      "getState",
      "getDistrict",
      "getAddress",
    ]),
  },
  watch: {
    show() {
      if (this.show) {
        this.profile.name = this.getName;
        this.profile.email = this.getEmail;
        this.profile.phone = this.getPhone;
        this.profile.GSTIN = this.getGSTIN;
        this.profile.state = this.getState;
        this.profile.district = this.getDistrict;
        this.profile.address = this.getAddress;
      }
    },
  },
};
</script>

<style scoped>

</style>
