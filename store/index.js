export const state = () => ({
  loadedPosts: [],
  token: null
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
  },
  setToken(state, token) {
    state.token = token
  }
};

export const actions = {
  nuxtServerInit(vuexContext, context) {
    return context.app.$axios.$get('/posts.json')
      .then(data => {
        const postArray = []
        for(const key in data) {
          postArray.push({...data[key], id: key})
        }
        vuexContext.commit('setPosts', postArray)
      })
      .catch(e => console.log(e))
  },
  addPost(vuexContext, post) {
    const createdPost = {
      ...post, updatedData: new Date()
    }
    return this.$axios.$post('/posts.json?auth=' + vuexContext.state.token, createdPost)
      .then(data => {
        vuexContext.commit('addPost', {...createdPost, id: data.name})
      })
      .catch(err => console.log(err))
  },
  editPost(vuexContext, editedPost) {
    return this.$axios.$put('/posts/' + editedPost.id + '.json?auth=' + vuexContext.state.token, editedPost)
    .then(res => {
      vuexContext.commit('editPost', editedPost)
    })
    .catch(e => console.log(e))
  },
  setPosts(vuexContext, posts) {
    vuexContext.commit("setPosts", posts);
  },
  authenticateUser(vuexContext, authData) {
    let authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + process.env.firebaseAPIKey
    if(!authData.isLogin) {
      authUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + process.env.firebaseAPIKey
    }
    return this.$axios.$post( authUrl, {
      email: authData.email,
      password: authData.password,
      returnSecureToken: true
    })
    .then(result => {
      vuexContext.commit('setToken', result.idToken )
    })
    .catch(error => console.log(error))
  }
};

export const getters = {
  loadedPosts(state) {
    return state.loadedPosts;
  },
  isAuthenticated(state) {
    return state.token != null
  }
}