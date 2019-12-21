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
      <template v-if="isLoggedIn">
        <v-btn text v-if="user.is_admin === 1" color="indigo">Admin Dashboard</v-btn>
        <v-btn text>{{user.name}}</v-btn>
        <v-btn text>My Posts</v-btn>
        <v-btn text @click="logout">Logout</v-btn>
      </template>
      <template v-else>
        <nuxt-link tag="span" to="/signup">
          <v-btn text>Signup</v-btn>
        </nuxt-link>
        <nuxt-link tag="span" to="/login">
          <v-btn text>Login</v-btn>
        </nuxt-link>

      </template>
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
  },
  computed:{
    isLoggedIn(){
      return this.$store.getters.isAuth;
    },
    user(){
      return this.$store.getters.userData;
    }
  },
  methods: {
    logout(){
      this.$store.dispatch("logout");
    }
  }
}
</script>
<style scoped>

</style>
