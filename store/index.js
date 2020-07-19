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
  addPost(vuexContent, post) {
    const createdPost = {
      ...post, updatedData: new Date()
    }
    return this.$axios.$post('/posts.json', createdPost)
      .then(data => {
        vuexContent.commit('addPost', {...createdPost, id: data.name})
      })
      .catch(err => console.log(err))
  },
  editPost(vuexContent, editedPost) {
    return this.$axios.$put('/posts/' + editedPost.id + '.json', editedPost)
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