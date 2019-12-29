import { resolve, reject } from "q";

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
    },
    updateUserPosts(state, postData){
        const updatedUserPosts = state.userPosts.map(post=>{
            if(post._id == postData.postId){
                return postData.post;
            }
            return post;
        });
        state.userPosts = updatedUserPosts;
    },
    removeUserPost(state, postId){
        const postUserIndex = state.userPosts.findIndex(post=>post._id == postId);
        const postIndex = state.posts.findIndex(post=>post._id == postId);
        state.userPosts.splice(postUserIndex,1);
        state.posts.splice(postIndex,1);
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
        let imageUrl;
        return dispatch("uploadImage", postData.image)
        .then(result=>{
            imageUrl = result ? result.imageUrl : '';
            const graphqlQuery = {
                query: `
                    mutation{
                        updatePost(postInput: {_id: "${postData._id}",title: "${postData.title}", content: "${postData.content}", image: "${imageUrl}"}){
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
            commit("updateUserPosts",{postId: result.data.updatePost._id, post: result.data.updatePost})
            result.data.updatePost._id
            return result;
        })
        .catch(err=>console.log(err));
    },
    deletePost({commit, getters}, postId){
        const graphqlQuery = {
            query: `
                mutation{
                    deletePost(postId: "${postId}")
                }
            `
        };
        fetch("http://localhost:8080/graphql", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + getters.getToken,
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(graphqlQuery)
        })
        .then(resData=>resData.json())
        .then(()=>{
            commit("removeUserPost", postId);
        }).catch(err=>console.log(err));
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}