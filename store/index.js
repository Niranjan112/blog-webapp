import Cookie from 'js-cookie'

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
  },
  clearToken(state) {
    state.token = null
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
      localStorage.setItem('token', result.idToken)
      localStorage.setItem('tokenExpiration', new Date().getTime() + +result.expiresIn * 1000)
      Cookie.set('jwt', result.idToken)
      Cookie.set('expirationDate', new Date().getTime() + +result.expiresIn * 1000)
      console.log(result.expiresIn)
    })
    .catch(error => console.log(error))
  },
  initAuth(vuexContext, req) {
    let token
    let expirationDate
    if(req) {
      if(!req.headers.cookie) {
        return
      }
      // console.log(req.headers.cookie)
      const jwtCookie = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('jwt='))
      if(!jwtCookie) {
        return
      }
      // console.log(jwtCookie)
      token = jwtCookie.split('=')[1]
      // console.log(token)
      expirationDate = req.headers.cookie
        .split(';')
        .find(c => c.trim().startsWith('expirationDate='))
        .split('=')[1]
    } else {
      token = localStorage.getItem('token');
      expirationDate = localStorage.getItem('tokenExpiration')
    }
    if(new Date().getTime() > +expirationDate || !token) {
      console.log('No token or Invalid token')
      vuexContext.dispatch('logout')
      return;
    }
    vuexContext.commit('setToken', token)
  },
  logout(vuexContext) {
    vuexContext.commit('clearToken')
    Cookie.remove('jwt')
    Cookie.remove('expirationDate')
    if(process.client) {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenExpiration')
    }
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