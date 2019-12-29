<template>
    <div>
        <v-layout>
        <v-row justify="space-around">
            <v-col sm="12" md="6">
                <v-row align="center" style="height:200px">
                    <h1 class="grey--text text--darken-2">Share Your Tech Thoughts</h1>
                </v-row>
            </v-col>
            <v-col sm="12" md="6">
                <v-form
                    ref="form"
                >
                    <v-text-field
                    v-model="title"
                    label="Title"
                    prepend-icon="mdi-book"
                    :error-messages="titleErrors"
                    @input="$v.title.$touch()"
                    @blur="requireImage"
                    :error="$v.title.$anyError"
                    required
                    ></v-text-field>
                    <v-file-input
                    label="Image"
                    :error-messages="imageError"
                    @change="onFileSelected"
                    >
                    </v-file-input>

            
                    <v-textarea
                    prepend-icon="mdi-comment"
                    class="content-textarea"
                    v-model="content"
                    :error-messages="contentErrors"
                    @input="$v.content.$touch()"
                    @blur="$v.content.$touch()"
                    :error="$v.content.$anyError"
                    label="Content"
                    ></v-textarea>

            
                    <v-btn
                    :color="edit ? 'grey' :'indigo'"
                    class="mr-4"
                    :disabled="$v.$invalid || !image || imageExtError !== null || imageSizeError !== null"
                    @click="edit ? updatePost() : createPost()"
                    dark
                    >
                    {{edit ? 'Edit Post' : 'Add Post'}}
                    </v-btn>
                    <v-btn
                    v-if="edit"
                    color="red"
                    @click="resetForm"
                    dark
                    >
                      Cancel
                    </v-btn>
            
                </v-form>
            </v-col>
        </v-row>
        </v-layout>
        <v-layout class="mt-5">
        <v-row>
          <post-col v-for="(post, index) in posts" :key="index" :post="post" :userPage="true" @editClicked="editPost(post)" @deleteClicked="deletePost(post._id)"></post-col>
        </v-row>

        </v-layout>
    </div>
</template>

<script>
import { required, minLength, maxLength, unique } from "vuelidate/lib/validators";
import PostCol from '~/components/PostCol.vue';
export default {
    fetch(context){
          const graphqlQuery = {
            query: `{
                getUserPosts{
                    _id
                    title
                    image
                    content
                    creator{
                        name
                    }
                    createdAt
                }
            }`
        };
        return fetch("http://localhost:8080/graphql", {
            method: "POST",
            headers:{
                Authorization: "Bearer " + context.store.getters.getToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        })
        .then(resData=>resData.json())
        .then(result=>{
            context.store.commit("setUserPosts", result.data.getUserPosts);
        })
        .catch(err=>console.log(err));
    },
    data(){
        return{
            _id: "",
            title: "",
            content: "",
            image: true,
            imageSizeError: null,
            imageExtError: null,
            edit: false
        }
    },
    methods:{
      resetForm(){
        this._id = "";
        this.title = "";
        this.content = "";
        this.image = true;
        this.edit = false;
        this.$v.$reset();
      },
      onFileSelected(event){
          this.imageSizeError = null;
          this.imageExtError = null;
          this.image = true;
          if(!event) return this.image = null;
          if(event.size > 100000){
            return this.imageSizeError = "Max file size is 50MB";
          }
          const imageNameExt = event.name.split(".")[1];
          if(imageNameExt != "png" && imageNameExt != "jpeg" && imageNameExt != "jpg"){
            return this.imageExtError = "Image should be of type png, jpg, or jpeg";
          }
          this.image = event;
        },
        requireImage(){
          if(this.image === true && !this.edit) this.image = null;
        },
        createPost(){
          this.$store.dispatch("addPost", {
            image: this.image,
            content: this.content,
            title: this.title
          })
          .then(resData=>{
            this.$store.commit("pushUserPost", resData.data.createPost);
            this.resetForm();
          })  
          .catch(err=>console.log(err));
        },
        editPost(post){
          this.resetForm();
          this._id = post._id;
          this.title = post.title;
          this.edit = true;
          this.content = post.content;
        },
        updatePost(){
          const image = this.image !== true && this.image !== null ? this.image : '';
          this.$store.dispatch("updatePost", {
            _id: this._id,
            title: this.title,
            image,
            content: this.content
          })
          .then(()=>{
            this.resetForm();
          }).catch(err=>console.log(err));
        },
        deletePost(postId){
          if(confirm("Are you sure you want to delete this post?")){
            this.$store.dispatch("deletePost", postId);
          }
        }
    },
    computed:{
        titleErrors() {
            const errors = [];
            if (!this.$v.title.$dirty) return errors;
            !this.$v.title.required && errors.push("Title is required");
            !this.$v.title.minLength && errors.push("Title should be at least 4 characters");
            !this.$v.title.maxLength && errors.push("Title should be no more than 25 characters");
            return errors;
        },
        contentErrors() {
            const errors = [];
            if (!this.$v.content.$dirty) return errors;
            !this.$v.content.required && errors.push("Content is required");
            !this.$v.content.minLength && errors.push("Content should be at least 5 characters");
            !this.$v.content.maxLength && errors.push("Content should be no more than 300 characters");
            return errors;
        },
        imageError(){
          if(this.imageSizeError) return this.imageSizeError;
          if(this.imageExtError) return this.imageExtError;
          if(!this.image) return "Image is required";
        },
        posts(){
          return this.$store.getters.getUserPosts;
        }
    },
    components:{
      PostCol
    },
    validations: {
        title: {
            required,
            minLength: minLength(4),
            maxLength: maxLength(25)
        },
        content: {
            required,
            minLength: minLength(5),
            maxLength: maxLength(300)
        }
    },
    middleware: 'auth'
}
</script>
