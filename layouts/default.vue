<template>
  <v-app dark>

    <v-app-bar
      fixed
      app
      flat
    >
      <v-toolbar-title>
        <nuxt-link to="/" tag="span"  style="cursor:pointer">
          <img src="/4afd2384-7410-4e96-a5a5-8353390c7834_200x200.png" alt="Logo" class="logo ml-4">
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <template v-if="isLoggedIn">
        <v-menu
          v-model="value"
          :absolute="false"
          :open-on-hover="false"
          :close-on-click="true"
          :close-on-content-click="true"
          :offset-x="false"
          :offset-y="true"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              text
              v-on="on"
            >
              {{user.name}}
            </v-btn>
          </template>
          <v-list>
            
            <v-list-item v-if="user.is_admin === 1">
              <v-list-item-title class="indigo--text">Admin Dashboard</v-list-item-title>
            </v-list-item>
            <v-list-item @click="toMyPosts">
              <v-list-item-title>My Posts</v-list-item-title>
            </v-list-item>
            <v-list-item @click="logout">
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
        <transition mode="out-in" name="fade">
        <nuxt />
        </transition>
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
export default {
  data () {
    return {
      value: false
    }
  },
  components:{

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
      this.$store.dispatch("logout")
      .then(()=>{
        this.$router.push("/");
      })
    },
    toMyPosts(){
      this.$router.push("/posts");
    }
  }
}
</script>
<style scoped>
.logo{
  height: 7rem;
}
.fade-enter{
    opacity: 0;
}
.fade-enter-active{
    transition: opacity 1s;
}

.fade-leave-active{
    opacity: 0;
    transition: opacity 1s;
}

</style>

