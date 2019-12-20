<template>
  <v-app dark>

    <v-app-bar
      fixed
      app
      flat
    >
      <v-toolbar-title>
        <logo class="logo"></logo>
      </v-toolbar-title>
      <v-spacer />
      <v-btn text>Mohanned Mohammed</v-btn>
      <v-btn text>My Posts</v-btn>
      <v-btn text>Logout</v-btn>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>

    <v-footer
      :fixed="true"
      app
    >
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
import Logo from '~/components/Logo.vue'
export default {
  data () {
    return {

    }
  },
  components:{
    Logo
  }
}
</script>
<style scoped>

</style>
