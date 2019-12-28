<template>
<div>
    <v-layout justify-space-around class="my-5">
            <v-img
            :src="'http://localhost:8080/' + post.image"
            max-width="700"
            max-height="450">
            </v-img>
    </v-layout>
    <hr>
    <v-layout justify-space-around class="mt-4">
        <h1 class="display-2 grey--text text--darken-2">{{post.title}}</h1>
    </v-layout>
    <v-layout justify-space-around class="mt-4">
        <p class="body-1">{{post.content}}</p>
    </v-layout>
    <v-layout justify-space-around class="mt-4">
        Created At: {{formatDate(post.createdAt)}}<br> By: {{post.creator.name}}
    </v-layout>



</div>
</template>
<script>
export default {
    computed:{
        post(){
            return this.$store.getters.getSinglePost(this.$route.params.id);
        }
    },
    created(){
        if(!this.$store.getters.getSinglePost(this.$route.params.id)){
            this.$router.push("/");
        }
    },
    methods:{
      formatDate(date){
        const dateConst = new Date(date);
       return dateConst.toLocaleDateString() +' '+ dateConst.toLocaleTimeString();
      }
    }
}
</script>script
