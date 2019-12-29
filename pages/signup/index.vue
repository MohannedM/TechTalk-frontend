<template>
  <div>
    <v-container>
      <v-row no-gutters style="height:90vh;" justify="center">
        <v-col align-self="center" cols="9">
          <h3 class="headline mb-4">Login into your account</h3>
          <v-spacer></v-spacer>
          <v-form>
            <v-text-field
              v-model="name"
              label="Your fullname"
              prepend-inner-icon="mdi-contacts"
              :error-messages="nameErrors"
              type="text"
              @input="$v.name.$touch()"
              @blur="$v.name.$touch()"
              :error="$v.name.$anyError"
              required
            ></v-text-field>
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
              name="password"
              prepend-inner-icon="mdi-lock"
              :error-messages="passwordErrors"
              @input="$v.password.$touch()"
              @blur="$v.password.$touch()"
              type="password"
              :error="$v.password.$anyError"
              required
            ></v-text-field>
            <v-text-field
              v-model="confirmPassword"
              label="Confirm Password"
              prepend-inner-icon="mdi-lock"
              :error-messages="confirmPasswordErrors"
              @input="$v.confirmPassword.$touch()"
              @blur="$v.confirmPassword.$touch()"
              type="password"
              required
            ></v-text-field>
          </v-form>
          <v-spacer></v-spacer>
          <v-btn
            :disabled="$v.$invalid"
            @click="signup"
            color="indigo white--text"
            block
            >Register</v-btn
          >
          <v-row no-gutters class="mt-4" justify="center">
            <nuxt-link to="login">Already have an account? Login</nuxt-link>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { required, email, minLength, sameAs, maxLength, unique } from "vuelidate/lib/validators";
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
        name: "",
        email: "",
        password: "",
        confirmPassword: "" 
    };
  },
  methods: {
    signup() {
      this.$store.dispatch("signup", {name: this.name, email: this.email, password: this.password})
      .then(res=>{
        console.log(res)
        if(res){
          this.$router.push("/login");
        }else{
          alert("An error occured!");
        }
      })
      .catch(err=>{
        alert("An error occured!");
        console.log(err);
      })
    }
  },
  computed: {
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.minLength && errors.push("Fullname must be at least 5 characters");
      !this.$v.name.maxLength && errors.push("Fullname must be less than 30 characters");
      !this.$v.name.required && errors.push("Fullname is required");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Must be valid e-mail");
      !this.$v.email.required && errors.push("E-mail is required");
      !this.$v.email.unique && errors.push("E-mail is already taken");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password is required");
      !this.$v.password.minLength && errors.push("Password must be at least 5 characters");
      !this.$v.password.maxLength && errors.push("Password must be less than 20 characters");
      return errors;
    },
    confirmPasswordErrors(){
        const errors = [];
      if (!this.$v.confirmPassword.$dirty) return errors;
      !this.$v.confirmPassword.sameAs && errors.push("Passwords don't match");

      return errors;
    }
  },
  validations: {
    name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(30)
    },
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
          return !result.data.isEmailTaken;
        })
        .catch(err=>console.log(err));
      }
    },
    password: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(20)
    },
    confirmPassword: {
        sameAs: sameAs('password')
    }
  }
};
</script>