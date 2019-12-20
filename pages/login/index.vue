<template>
  <div>
    <v-container>
      <v-row no-gutters style="height:90vh;" justify="center">
        <v-col align-self="center" cols="9">
          <h3 class="headline mb-4">Login into your account</h3>
          <v-spacer></v-spacer>
          <v-form>
            <v-text-field
              v-model="email"
              label="Your e-mail address"
              prepend-inner-icon="mdi-email"
              :error-messages="emailErrors"
              type="email"
              @input="$v.email.$touch()"
              @blur="$v.email.$touch()"
              :error="$v.email.$anyError"
              required
            ></v-text-field>
            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              type="password"
              :error="$v.password.$anyError"
              required
            ></v-text-field>
          </v-form>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="$v.$invalid"
            @click="login"
            color="indigo white--text"
            block
            >Login</v-btn
          >
          <v-row no-gutters class="mt-4" justify="center">
              <nuxt-link to="/signup">Do not have an account? Register</nuxt-link>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { required, email, minLength, unique } from "vuelidate/lib/validators";
const isEmailQuery = email => {
  return {
  query: `
    mutation{
      isEmailTaken(email: "${email}")
    }
  `
  }
}
export default {
  layout: "auth",
  data() {
    return { 
        email: "",
        password: "" 
    };
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      })
      .then(result=>{
        console.log(result);
      })
      .catch(err=>{
        console.log(err);
      })
    }
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      !this.$v.email.unique && errors.push("E-mail was not found");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      !this.$v.password.minLength && errors.push("Password must be at least 5 characters");
      return errors;
    }
  },
  validations: {
    email: {
      required,
      email,
      unique(val){
        if(val === "") return true;
        return fetch("http://localhost:8080/graphql", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(isEmailQuery(this.email))
        })
        .then(res=>res.json())
        .then(result=>{
          return result.data.isEmailTaken;
        })
        .catch(err=>console.log(err));
      }
    },
    password: {
      required,
      minLength: minLength(5)
    }
  }
};
</script>