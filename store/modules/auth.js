import * as Cookie from 'js-cookie';
const state = {
    token: null,
    user: null
};

const getters = {
    isAuth(state){
        return state.token != null;
    },
    userData(state){
        return state.user;
    }

};

const mutations = {
    setAuthData(state, authData){
        state.token = authData.token;
        state.user = authData.user;
    }
}

const actions = {
    signup({commit}, userData){
        const graphqlQuery = {
            query: `
                mutation{
                    signup(userData: {name: "${userData.name}", email: "${userData.email}", password: "${userData.password}"})
                }
            `
          };

          return fetch("http://localhost:8080/graphql",{
              method: "POST",
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(graphqlQuery)
          })
          .then(res=>res.json())
          .then(result=>{
              return result.data.signup;
          })
          .catch(err=>{
              console.log(err);
              return false;
          });
    },
    login({commit}, authData){
        const graphqlQuery = {
            query: `{
                login(email: "${authData.email}", password: "${authData.password}"){
                    token
                    user{
                        _id
                        name
                        email
                        is_admin
                    }
                }
            }`
        };

        return fetch("http://localhost:8080/graphql",{
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        })
        .then(res=>res.json())
        .then(resData=>{
            if(resData.errors){
                return Promise.reject(resData.errors)
            }
            commit("setAuthData", {
                token: resData.data.login.token,
                user: resData.data.login.user
            });
            return Promise.resolve();
        })
        .catch(err=>{
            console.log(err);
            return Promise.reject(err);
        });

        
    }

}

export default{
    state,
    getters,
    mutations,
    actions
}