import Vuex from 'vuex';
import auth from './modules/auth';
import posts from './modules/posts';

const createStore = () => {
    return new Vuex.Store({
        state:{
            posts: []
        },
        getters:{

        },
        mutations:{
            
        },
        actions:{

        },
        modules:{
            auth,
            posts
        }
    });
}

export default createStore;