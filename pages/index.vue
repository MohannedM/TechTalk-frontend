<template>
  <v-layout
    justify-center
    align-center
  >
  <v-row justify="space-around">
      <v-col v-for="(post, index) in posts" :key="index" xs="12" :sm="index != 0 ? '6' : '12'" :md="index != 0 ? '4' : '12'" :lg="index != 0 ? '3' : '12'" class="px-5">
      <v-card
      class="mx-auto"
      :max-width="index != 0 ? '400' : '1310'"
      max-height="800"
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

      </v-card-actions>
    </v-card>

    </v-col>
  </v-row>

  </v-layout>
</template>

<script>
import PostCol from '~/components/PostCol.vue';
export default {
  components: {
    PostCol
  },
  computed:{
    posts(){
      return this.$store.getters.getPosts;
    }
  },
  methods:{
    formatDate(date){
        const dateConst = new Date(date);
       return dateConst.toLocaleDateString() +' '+ dateConst.toLocaleTimeString();
      }
  }
}
</script>
