<template>
  <v-layout
    column
    justify-center
    align-center
  >
  <v-row>
    <post-col v-for="(post, index) in posts" :key="index" :post="post" :userPage="false"></post-col>
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
  }
}
</script>
