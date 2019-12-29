<template>
          <v-col xs="12" sm="6" md="4" lg="3" class="px-5">
              <v-card
      class="mx-auto"
      max-width="400"
      max-height="750"
    >
    <nuxt-link tag="span" :to="`/posts/${post._id}`">
      <v-img
        class="white--text align-end"
        height="200px"
        :src="`http://localhost:8080/${post.image}`"
        style="cursor:pointer"
      >
        <v-card-title>{{post.title}}</v-card-title>
      </v-img>
    </nuxt-link>
  
      <v-card-subtitle class="pb-0">By: {{post.creator.name}}</v-card-subtitle>
  
      <v-card-text class="text--primary">
  
        <div>At {{formatDate(post.createdAt)}}</div>
      </v-card-text>
  
      <v-card-actions>
        <template v-if="userPage">
          <v-btn
            color="grey"
            text
            @click="editPost"
          >
            Edit
          </v-btn>
    
          <v-btn
            color="red"
            text
            @click="deletePost"
          >
            Delete
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            color="red"
            text
          >
            Like icon here
          </v-btn>
        </template>

      </v-card-actions>
    </v-card>

          </v-col>
</template>
<script>
export default {
    props: ["post", "userPage"],
    methods:{
      formatDate(date){
        const dateConst = new Date(date);
       return dateConst.toLocaleDateString() +' '+ dateConst.toLocaleTimeString();
      },
      editPost(){
        this.$emit("editClicked");
      },
      deletePost(){
        this.$emit("deleteClicked");
      }
    }
}
</script>