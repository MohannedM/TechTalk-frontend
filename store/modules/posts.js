const state = {

}

const getters = {

}

const mutations = {

}

const actions = {
    addPost({commit, getters}, postData){
        const formData = new FormData();
        formData.append('image', postData.image);
        return fetch("http://localhost:8080/post/add-image", {
            method: "PUT",
            body: formData,
            headers:{
                Authorization: "Bearer " + getters.getToken
            }
        })
        .then(resData=>resData.json())
        .then(result=>{
            const graphqlQuery = {
                query: `
                    mutation{
                        createPost(postInput: {title: "${postData.title}", content: "${postData.content}", image: "${result.imageUrl}"}){
                            title
                            content
                            image
                            creator{
                                name
                            }
                            createdAt
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