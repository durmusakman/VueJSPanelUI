<template>
  <Layout>
    <PageHeader :items="item" :title="title"></PageHeader>
    <div>
      <div class="col-sm-6 col-md-3 mt-4">
        <div class="text-center">
          <b-modal id="edit-modal" v-model="displayModal" title="Edit Shipping Company" hide title-class="font-18">
            <div class="form-group">
              <label>Shipping Company</label>
              <b-form-select id="edit-ship-name" class="form-control"  value-field="id" text-field="shipping_company_name" :options="shippingCompanies" v-model="editForm.shipping_company_id" ></b-form-select>
            </div>
            <br>
            <div class="form-group">
              <label>Start Deci</label>
              <b-form-input type="number" id="edit-start-deci" v-model="editForm.start_deci" placeholder="Edit Start Deci"></b-form-input>
            </div>
            <br>
            <div class="form-group">
              <label>Finish Deci</label>
              <b-form-input type="number" id="edit-finish-deci" v-model="editForm.finish_deci" placeholder="Edit Finish Deci"></b-form-input>
            </div>
            <br>
            <div class="form-group">
              <label>Deci Price</label>
              <b-form-input type="number" id="edit-deci-price" v-model="editForm.deci_price" placeholder="Edit Deci Price"></b-form-input>
            </div>
            <br>
            <template #modal-footer>
              <button v-b-modal.modal-close_visit data-dismiss="modal" @click="closeModal" class="btn btn-danger btn-sm m-1">Close</button>
              <button v-b-modal.modal-close_visit class="btn btn-success btn-sm m-1" @click="editDeci(id)" >Save</button>
            </template>
          </b-modal>
        </div>

        <div class="text-center">
          <b-modal id="modal-standard"  v-model="editModalDisplay" title="Add Role" hide title-class="font-18">
            <div class="form-group">
              <label>Shipping Company</label>
              <b-form-select id="add-ship-name" class="form-control"  v-model="form.shipping_company_id"  value-field="id" text-field="shipping_company_name" :options="shippingCompanies"></b-form-select>
            </div>
            <br>
            <div class="form-group">
              <label>Start Deci</label>
              <b-form-input type="number" id="add-start-deci" v-model="form.start_deci" placeholder="Add Start Deci"></b-form-input>
            </div>
            <br>
            <div class="form-group">
              <label>Finish Deci</label>
              <b-form-input type="number" id="add-finish-deci" v-model="form.finish_deci" placeholder="Add Finish Deci"></b-form-input>
            </div>
            <br>
            <div class="form-group">
              <label>Deci Price</label>
              <b-form-input type="number" id="add-deci-price" v-model="form.deci_price" placeholder="Add Deci Price"></b-form-input>
            </div>
            <br>
            <template  #modal-footer>
            <button  data-dismiss="modal" @click="closeModal" class="btn btn-danger btn-sm m-1">Close</button>
            <b-button  for="edit-modal" class="btn btn-success btn-sm m-1" @click="addDeci" >Save</b-button>
          </template>
          </b-modal>
        </div>
      </div>
      <div class="container-fluid">
        <div class="row">


          <div class="col-md-12">

            <div class="card">

              <div class="card-body">
                <div style="margin-left: 575px" class="col-sm-4">
                  <div class="float-end d-none d-md-block">
                    <b-button style="float: right"  v-b-modal.modal-standard variant="primary">Add Deci</b-button>
                  </div>
                </div>
                <b-row>

                  <b-col xl="6">

                    <b-input-group class="datatable-btn">
                      <b-form-input v-model="filter" placeholder="Type to Search"></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                      </b-input-group-append>

                    </b-input-group>

                  </b-col>

                  <b-col xl="6">
                    <b-form-group  label-cols="2" label="Per page" class="mb-4 datatable-select">
                      <b-form-select v-model="perPage" :options="pageOptions"></b-form-select>
                    </b-form-group>

                  </b-col>
                </b-row>

                <div class="table-responsive datatable-vue">
                  <b-table
                      show-empty
                      stacked="md"
                      :items="items"
                      :fields="tablefields"
                      :filter="filter"
                      :current-page="currentPage"
                      :per-page="perPage"
                      @filtered="onFiltered"

                  >
                    <template v-slot:cell(shipping_company_image)="{item}">
                    <img id="product_image" :src="''+'/'+item.shipping_company_image">
                    </template>

                    <template v-slot:cell(actions)="{item}">
                      <b-button  v-b-modal.edit-modal @click="editDeciModal(item)" class="btn btn-sm btn-dark">Edit</b-button>
                      <a  @click="deleteDeci(item.id)" style="color: white;" class="btn btn-sm btn-danger">Delete</a>
                    </template>

                  </b-table>
                </div>

                <b-col md="6" class="my-1 p-0">
                  <b-pagination
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                      class="my-0"
                  ></b-pagination>
                </b-col>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script>

import Layout from "../../router/layouts/main.vue";
import PageHeader from "@/components/page-header";



export default {
  components:{
    // eslint-disable-next-line vue/no-unused-components
    Layout,PageHeader
  },
  created(){
  this.getShippingCompaniesList()
    this.getShippingComDeciList();
    // eslint-disable-next-line no-undef
    if(!User.loggedIn()){
      this.$router.push({name: '/admin/login'})
    }
  },
  data(){
    return{
      shippingCompanies:[],
      editModalDisplay:false,
      tablefields: [
        { key: 'shipping_company_image', label: 'Role', sortable: true, },
        { key: 'shipping_company_name', label: 'Shipping Company Name', sortable: true, },
        { key: 'start_deci', label: 'Start Deci', sortable: true, },
        { key: 'finish_deci', label: 'Finish Deci', sortable: true, },
        { key: 'deci_price', label: 'Deci Price', sortable: true, },
        { key: 'actions', label: 'Actions', sortable: true, },
      ],
      items: [

      ],
      editForm:{
        shipping_company_id:null,
        start_deci:null,
        finish_deci:null,
        deci_price:null
      },
      displayModal:false,
      form:{
        shipping_company_id:null,
        start_deci:null,
        finish_deci:null,
        deci_price:null
      },
      id:null,
      title: "Form Elements",
      item: [
        {
          text: "Veltrix",
          href: "/"
        },
        {
          text: "Forms",
          href: "/"
        },
        {
          text: "Form Elements",
          active: true
        },


      ],
      categories:[],
      buttons: [
        {
          text: "New Category",
          href: "/",
          active: true
        },



      ],
      searchTerm:'',
      filter: null,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [5, 10, 15],
    }
  },
  mounted(){
    this.totalRows = this.items.length;

  },
  computed:{
    sortOptions() {
      // Create an options list from our fields
      return this.tablefields
          .filter(f => f.sortable)
          .map(f => {
            return { text: f.label, value: f.key };
          });
    },
    rows(){
      return this.items.length;
    },

  },
  methods:{
    clearAddDeciModal(){
      this.form.deci_price= null;
      this.form.start_deci= null;
      this.form.finish_deci= null;
      this.form.shipping_company_id = null;
    },
    getShippingCompaniesList(){
      this.$http.get('shipping-company/')
          .then(({data}) => {this.shippingCompanies = data;
            // eslint-disable-next-line no-console
            console.log(data);}).catch()


    },
    onFileSelected(event){
      let file = event.target.files[0];
      if(file.size > 20971520) {
        Notification.image_validation()
      } else {
        let reader = new FileReader();
        reader.onload = event => {
          this.form.shipping_company_image = event.target.result
          // eslint-disable-next-line no-console
          // console.log(event.target.result);
        };
        reader.readAsDataURL(file);
        // eslint-disable-next-line no-console
      }
    },
    editDeciModal(item){
      // eslint-disable-next-line no-console
      console.log(item)
      this.id = item.id;
      this.editForm.shipping_company_id = item.shipping_company_id;
      this.editForm.start_deci = item.start_deci;
      this.editForm.finish_deci = item.finish_deci;
      this.editForm.deci_price = item.deci_price;

    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },

    closeModal(){
      this.displayModal = false;
      this.editModalDisplay =false;
    },
    addDeci(){
      this.$http.post('shipping-company-deci',this.form)
          .then((data) => {this.categories = data;
            this.editModalDisplay = false;
            this.getShippingComDeciList();
            this.clearAddDeciModal();
          })
          .catch()

    },
    getShippingComDeciList(){
        this.$http.get('shipping-company-deci')
          .then((res) => {
            this.items = res.data;
            // eslint-disable-next-line no-console
          })
          .catch()
    },
    editDeci(id){
      // eslint-disable-next-line no-console
      this.$http.patch('shipping-company-deci/'+id,this.editForm)
          .then((res) => {
            this.items = res.data;
            this.getShippingComDeciList();
            this.displayModal = false;
          })
          .catch()

    },
    deleteDeci(id){
      // eslint-disable-next-line no-undef
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          this.$http.delete('shipping-company-deci/'+id)
              .then(() => {
                this.getShippingComDeciList();
                this.categories = this.categories.filter(role => {
                  return role.id != id
                })
              })
              .catch(() => {
              })
          // eslint-disable-next-line no-undef
          Swal.fire(
              'Deleted!',
              'Your data has been deleted.',
              'success'
          )
        }
      })

    }
  },
  // created(){
  //     this.allEmployee();
  // }

}
</script>

<style scoped>
#product_image{
  width: 50px;
  height: 50px;
}
</style>