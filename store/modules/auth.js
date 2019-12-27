import Cookie from 'js-cookie'
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
    },
    getToken(state){
        return state.token;
    }

};

const mutations = {
    setAuthData(state, authData){
        state.token = authData.token;
        state.user = authData.user;

    },
    unsetAuthData(state){
        state.token = null;
        state.user = null;
    }
}

const actions = {
    nuxtServerInit(vuexContext, {req}){
        let token;
        let expiration;
        if (req) {
          if (!req.headers.cookie) {
            return;
          }
          const jwtCookie = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("token="));
        const expirationCookie = req.headers.cookie
            .split(";")
            .find(c => c.trim().startsWith("expiration=")); 
          if (!jwtCookie || !expirationCookie) {
            return;
          }
          token = jwtCookie.split("=")[1];
          expiration = expirationCookie.split("=")[1];
        }
        if(+expiration < new Date().getTime()){
            vuexContext.commit("unsetAuthData");
            return;
        }
        if (!token || !expiration) {
          return;
        }
        const graphqlQuery = {
            query: `
                {
                    getUserData(token: "${token}"){
                        _id
                        name
                        email
                        is_admin
                    }
                }
            `
        };

        return fetch("http://localhost:8080/graphql",{
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(graphqlQuery)
        })
        .then(res=>res.json())
        .then(resData=>{
            vuexContext.commit("setAuthData", {
                token: token,
                user: resData.data.getUserData
            })
        })
        .catch(err=>{
            vuexContext.commit("unsetAuthData");
        });

    },
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
    login({commit, dispatch}, authData){
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
                    expiration
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
            Cookie.set("token", resData.data.login.token);
            Cookie.set("expiration", resData.data.login.expiration.toString());
            dispatch("logoutTimer", +resData.data.login.expiration - new Date().getTime());
            return Promise.resolve();
        })
        .catch(err=>{
            return Promise.reject(err);
        });

        
    },
    logout({commit}){
        Cookie.remove("token");
        Cookie.remove("expiration");
        commit("unsetAuthData");
        return Promise.resolve();
    },
    logoutTimer({dispatch}, expirationTime){
        setTimeout(()=>{
            dispatch("logout");
        }, (expirationTime));
    }

}

export default{
    state,
    getters,
    mutations,
    actions
}