const initialState = {
  loading: false,
  items: [],
  categories: [],
  error:null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "posts/fetch/pending":
      return {...state,loading: true};
    case "posts/fetch/fulfilled":
      return {...state,loading: false,items: action.payload};
    case "posts/fetch/rejected":
      return {...state,loading: false,error: action.error};

    case "posts/fetch-single/pending" :
        return {...state, loading: true, error: null}
    case "posts/fetch-single/fulfilled" :
        return {...state, loading: false, currentPost: action.payload.data};
    case "posts/fetch-single/rejected" :
        return {...state, loading: false, error: action.error}

    case "posts/fetch-by-category/pending":
      return {...state,loading: true};
    case "posts/fetch-by-category/fulfilled":
      return {...state,loading: false,items: action.payload};
    case "posts/fetch-by-category/rejected":
      return {...state,loading: false,error: action.error};

    case "categories/fetch/pending":
      return {...state, loading: true}
    case "categories/fetch/fulfilled":
      return {...state, loading: false, categories: action.payload}
    case "categories/fetch/rejected":
      return {...state, loading:false, error: action.error}

    case "posts/addPost/pending":
      return {...state, loading: false}
    case "posts/addPost/fulfilled":
      return {...state, loading: false, items:[action.payload.posts,...state.items]}
    case "posts/addPost/rejected":
      return {...state, loading: false, error: action.error}
      
    case "posts/deletePost/pending":
      return {...state, loading: false}
    case "posts/deletePost/fulfilled":
      return {...state, loading: false, items: state.items.filter((post) => 
        post.id !== action.payload && post)} 
    case "posts/deletePost/rejected":
      return {...state, loading: false, error: action.error}

      default:
        return state;
  }
}

export const getAllPosts = () => async (dispatch) => {
  dispatch({ type: "posts/fetch/pending" });

  try {
    const res = await fetch("/Posts");
    const json = await res.json();

    dispatch({ type: "posts/fetch/fulfilled", payload: json });
  } catch (e) {
    dispatch({ type: "posts/fetch/rejected", error: e.toString() });
  }
};

export const getSinglePost = (postId) => async (dispatch) => {
  dispatch({ type: "posts/fetch-single/pending" });

  try {
    const responce = await fetch(`/post/${postId}`);
    const json = await responce.json();

    dispatch({ type: "posts/fetch-single/fulfilled", payload: {success: json.success, data: json.post} });
  } catch (e) {
    dispatch({ type: "posts/fetch-single/rejected", error: e.toString() });
  }
};

export const getCategories = () => async (dispatch) => {
  dispatch ({type: "categories/fetch/pending"})

  try {
    const res = await fetch('/categories')
    const categories = await res.json()

    dispatch ({type: "categories/fetch/fulfilled", payload: categories})
  } catch (e) {
    dispatch ({type: "categories/fetch/rejected", error: e.toString() })
  }
}

export const getPostsByCategory = (categoryId) => {
  return async (dispatch) => {
    dispatch({ type: "posts/fetch-by-category/pending"});

    try {
      const res = await fetch(`/posts/category/${categoryId}`);
      const posts = await res.json();

      dispatch({type: "posts/fetch-by-category/fulfilled",payload: posts,
      });
    } catch (e) {
      dispatch({type: "posts/fetch-by-category/rejected",error: e.toString(),
      });
    }
  };
};

export const addPost = (category, title, text) => async (dispatch, getStore) => {
  dispatch ({type: "posts/addPost/pending"})
  const store = getStore()
  try {
    const res = await fetch("/posts", {
      method: "POST",
      body: JSON.stringify({ category, title, text }),
      headers: {
        Authorization:  store.auth.token,
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();

    dispatch({ type: "posts/addPost/fulfilled", payload: {...json.posts, author: store.auth.myData}});
    window.location.reload();
  } catch (e) {
    dispatch ({type: "posts/addPost/rejected", error: e.toString()})
  }  
}

export const deletePost = (id) => async (dispatch, getStore) => {
  const store = getStore();
  dispatch({ type: "posts/deletePost/pending" });

  try {
    const res = await fetch(`/posts/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: store.auth.token,
        "Content-Type": "application/json",
      },
    });
    const json = res.json();
    dispatch({ type: "posts/deletePost/fulfilled", payload: id });
   window.location.assign('/posts')
  } catch (e) {
    dispatch({ type: "posts/deletePost/rejected", error: e.toString() });
  }
};

export default reducer