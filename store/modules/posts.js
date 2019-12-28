const state = {
    posts:[],
    userPosts: []
}

const getters = {
    getPosts(state){
        return state.posts;
    },
    getUserPosts(state){
        return state.userPosts;
    },
    getSinglePost:(state)=>(id)=>{
        return state.posts.find(post=>post._id === id);
    }
}

const mutations = {
    setPosts(state, posts){
        state.posts = posts;
    },
    setUserPosts(state, posts){
        state.userPosts = posts;
    },
    pushUserPost(state,post){
        state.userPosts.push(post);
        state.posts.push(post);
    }
}

const actions = {
    nuxtServerInit({commit}, {req}){
            const graphqlQuery = {
              query: `{
                getAllPosts{
                    _id
                    title
                    content
                    image
                    creator{
                        _id
                        name
                    }
                    createdAt
                    updatedAt
                  }
              }`
          };
          return fetch("http://localhost:8080/graphql", {
              method: "POST",
              headers:{
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(graphqlQuery)
          })
          .then(resData=>resData.json())
          .then(result=>{
              commit("setPosts", result.data.getAllPosts);
          })
          .catch(err=>console.log(err));
    },
    uploadImage({commit, getters}, image){
        let result = {imageUrl: null};
        if(image){
            const formData = new FormData();
            formData.append('image', image);
            return fetch("http://localhost:8080/post/add-image", {
                method: "PUT",
                body: formData,
                headers:{
                    Authorization: "Bearer " + getters.getToken
                }
            })
            .then(resData=>resData.json())
            .catch(err=>console.log(err));
        }else{
            return Promise.resolve(()=>result);
        }
    },
    addPost({commit, dispatch, getters}, postData){
        return dispatch("uploadImage", postData.image)
        .then(result=>{
            const graphqlQuery = {
                query: `
                    mutation{
                        createPost(postInput: {title: "${postData.title}", content: "${postData.content}", image: "${result.imageUrl}"}){
                            _id
                            title
                            content
                            image
                            creator{
                                _id
                                name
                            }
                            createdAt
                            updatedAt
                        }
                    }
                `
            };
            return fetch("http://localhost:8080/graphql", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + getters.getToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphqlQuery)
            });
        }).then(resData=>resData.json())
        .then(result=>{
            return result;
        })
        .catch(err=>console.log(err));
    },
    updatePost({commit, dispatch, getters}, postData){
        return dispatch("uploadImage", postData.image)
        .then(image=>{
            const graphqlQuery = {
                query: `
                    mutation{
                        updatePost(postInput: {title: "${postData.title}", content: "${postData.content}", image: "${result.imageUrl}"}){
                            _id
                            title
                            content
                            image
                            creator{
                                _id
                                name
                            }
                            createdAt
                            updatedAt
                        }
                    }
                `
            };
            return fetch("http://localhost:8080/graphql", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + getters.getToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(graphqlQuery)
            });
        }).then(resData=>resData.json())
        .then(result=>{
            console.log(result);
            return result;
        })
        .catch(err=>console.log(err));
        

    }
}

export default {
    state,
    getters,
    mutations,
    actions
}