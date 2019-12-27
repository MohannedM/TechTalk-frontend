<template>
    <div>
        <v-layout>
        <v-row justify="space-around">
            <v-col sm12 md6>
                <v-row align="center" style="height:200px">
                    <h1 class="grey--text text--darken-2">Share Your Tech Thoughts</h1>
                </v-row>
            </v-col>
            <v-col sm12 md6>
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
                    color="indigo"
                    class="mr-4"
                    :disabled="$v.$invalid || !image || imageExtError !== null || imageSizeError !== null"
                    @click="createPost"
                    dark
                    >
                    Add Post
                    </v-btn>
            
                </v-form>
            </v-col>
        </v-row>
        </v-layout>
        <v-layout class="mt-5">
                  <v-row>
                    <v-col xs12 sm6 md4 lg3>
              <v-card
      class="mx-auto"
      max-width="400"
    >
      <v-img
        class="white--text align-end"
        height="200px"
        src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
      >
        <v-card-title>Top 10 Australian beaches</v-card-title>
      </v-img>
  
      <v-card-subtitle class="pb-0">Number 10</v-card-subtitle>
  
      <v-card-text class="text--primary">
        <div>Whitehaven Beach</div>
  
        <div>Whitsunday Island, Whitsunday Islands</div>
      </v-card-text>
  
      <v-card-actions>
        <v-btn
          color="orange"
          text
        >
          Share
        </v-btn>
  
        <v-btn
          color="orange"
          text
        >
          Explore
        </v-btn>
      </v-card-actions>
    </v-card>

          </v-col>
      </v-row>

        </v-layout>
    </div>
</template>

<script>
import { required, minLength, maxLength, unique } from "vuelidate/lib/validators";
export default {
    data(){
        return{
            title: "",
            content: "",
            image: true,
            imageSizeError: null,
            imageExtError: null,

        }
    },
    methods:{
      resetForm(){
        this.title = "";
        this.content = "";
        this.image = true;
        this.$v.$reset();
      },
      onFileSelected(event){
          this.imageSizeError = null;
          this.imageExtError = null;
          this.image = true;
          if(!event) return this.image = null;
          if(event.size > 50000){
            return this.imageSizeError = "Max file size is 50MB";
          }
          const imageNameExt = event.name.split(".")[1];
          if(imageNameExt != "png" && imageNameExt != "jpeg" && imageNameExt != "jpg"){
            return this.imageExtError = "Image should be of type png, jpg, or jpeg";
          }
          this.image = event;
        },
        requireImage(){
          if(this.image === true) this.image = null;
        },
        createPost(){
          this.$store.dispatch("addPost", {
            image: this.image,
            content: this.content,
            title: this.title
          })
          .then(()=>{
            this.resetForm();
          })  
          .catch(err=>console.log(err));
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
        }
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

    }
}
</script>
