<template>
  <Layout>
    <div>

      <div class="col-xl-12">
        <div class="card card-statistics">
          <div class="card-body">
            <form @submit.prevent="faqUpdate">
              <div class="form-row">
                <div class="form-group col-md-4">
                  <label for="faqTitle">Faq Title</label>
                  <input type="text" v-model="form.faq_title" class="form-control" id="faqTitle">
                </div>
                <div class="form-group col-md-4">
                  <label for="faqSeq">Faq Seq Number</label>
                  <input type="number" min="1" v-model="form.faq_seq" class="form-control" id="faqSeq">
                </div>
                <div class="form-group col-md-4">
                  <label for="faqStatus">Faq Status</label>
                  <select id="faqStatus" class="form-control" v-model="form.faq_status">
                    <option :value="1">Active</option>
                    <option :value="0">Passive</option>
                  </select>
                </div>
              </div>
              <br>
              <div class="form-group">
                <label for="faqDescription">Faq Description</label>
                <ckeditor :editor="editor" v-model="form.faq_description" class="form-control" id="faqDescription"></ckeditor>
              </div>
              <br>
              <button type="submit" class="btn btn-primary col-xl-12">Save</button>
            </form>
          </div>
        </div>
      </div>
    </div>

  </Layout>
</template>

<script>

import axios from "axios";
import Layout from "../../router/layouts/main.vue";
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  components:{
    // eslint-disable-next-line vue/no-unused-components
    ckeditor: CKEditor.component,
    Layout,
  },
  name:'admin-edit-faq',
  created(){
    // eslint-disable-next-line no-undef
    if(!User.loggedIn()){
      this.$router.push({name: 'admin-login'})
    }
    let id = this.$route.params.id
    axios.get('faq/'+id)
        .then(({data}) => (this.form = data))
        .catch()
  },

  data(){
    return {
      form:{
        faq_title: '',
        faq_seq: '',
        faq_status: '',
        faq_description: '',
      },
      errors:{},
      faqs:{},
      editor: ClassicEditor,
    }
  },

  methods:{
    faqUpdate(){
      let id = this.$route.params.id
      axios.patch('faq/'+id,this.form)
          .then(() => {
            this.$router.push({ name: 'admin-faq-list'})
            Notification.success()
          })
          .catch(error => this.errors = error.response.data.errors)
    }
  }
}
</script>
<style scoped>

</style>
