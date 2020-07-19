import axios from 'axios'

export const state = () => ({
  loadedPosts: []
});

export const mutations = {
  setPosts(state, posts) {
    state.loadedPosts = posts;
  },
  addPost(state, post) {
    state.loadedPosts.push(post)
  },
  editPost(state, editedPost) {
    const postIndex = state.loadedPosts.findIndex(post => post.id === editedPost.id)
    state.loadedPosts[postIndex] = editedPost
  }
};

export const actions = {
  nuxtServerInit(vuexContext, context) {
    return axios.get('https://blog-web-app-fd739.firebaseio.com/posts.json')
      .then(res => {
        const postArray = []
        for(const key in res.data) {
          postArray.push({...res.data[key], id: key})
        }
        vuexContext.commit('setPosts', postArray)
      })
      .catch(e => console.log(e))
  },
  addPost(vuexContent, post) {
    const createdPost = {
      ...post, updatedData: new Date()
    }
    return axios.post('https://blog-web-app-fd739.firebaseio.com/posts.json', createdPost)
      .then(result => {
        vuexContent.commit('addPost', {...createdPost, id: result.data.name})
      })
      .catch(err => console.log(err))
  },
  editPost(vuexContent, editedPost) {
    return axios.put('https://blog-web-app-fd739.firebaseio.com/posts/' + editedPost.id + '.json', editedPost)
    .then(res => {
      vuexContent.commit('editPost', editedPost)
    })
    .catch(e => console.log(e))
  },
  setPosts(vuexContext, posts) {
    vuexContext.commit("setPosts", posts);
  }
};

export const getters = {
  loadedPosts(state) {
    return state.loadedPosts;
  }
}