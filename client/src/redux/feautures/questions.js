const initialState = {
    loading: false,
    asks: [],
    error: null,
}

const reducer = (state = initialState, action) => {
    switch (action.type) {

        //Уборщик
        case "questions/data/clear" :
            return {...initialState, asks: state.asks, pagesCount: state.pagesCount || 1}

        //Создатель ошибок
        case "questions/setError" :
            return {...state, error: action.error}

        //Добавление комментария в массив
        case "questions/addQuestion" :
            return {...state, currentAsk: {...state.currentAsk,
                    answers: [...state.currentAsk.answers, action.payload]}}

        //Добавление нового вопроса
        case "questions/askQuestion/pending" :
            return {...state, asking: true, error: null, askSuccess: null}
        case "questions/askQuestion/rejected" :
            return {...state, asking: false, error: action.error}
        case "questions/askQuestion/fulfilled" :
            return {...state, asking: false, askSuccess: action.payload.success, 
               
            asks:[action.payload.question,...state.asks]}

        //Вывод одного вопроса
        case "questions/getOneQuestion/pending" :
            return {...state, loading: true, error: null}
        case "questions/getOneQuestion/rejected" :
            return {...state, loading: false, error: action.error};
        case "questions/getOneQuestion/fulfilled" :
            return {...state, loading: false, currentAsk: action.payload.data}

        //Вывод всех вопросов
        case "questions/getQuestions/pending" :
            return {...state, loading: true}
        case "questions/getQuestions/rejected" :
            return {...state, loading: false, error: action.error}
        case "questions/getQuestions/fulfilled" :
            return {...state, loading: false, asks: action.payload.questions, pagesCount: action.payload.pagesCount}
        default:
            return state;
    }
}

export const getQuestions = (page = 1) => async (dispatch) => {
    dispatch({type: "questions/getQuestions/pending"});

    const res = await fetch(`/questions?page=${page}`);
    const data = await res.json();

    const {error, questions, pagesCount} = data;

    if (error) {
        dispatch({type: "questions/getQuestions/rejected", error});
    } else {
        dispatch({type: "questions/getQuestions/fulfilled", payload: {questions, pagesCount}});
    }
}

export const askNewQuestion = (title, text) => async (dispatch, getStore) => {
    const store = getStore()
    dispatch({type: "questions/askQuestion/pending"});

    const res = await fetch("/questions", {
        method: "POST",
        body: JSON.stringify({title, text}),
        headers: {"Content-Type" : "application/json", "Authorization" : store.auth.token}
    })

    const json = await res.json();

    if (json.error) {
        dispatch({type: "questions/askQuestion/rejected", error: json.error})
    } else {
        dispatch({type: "questions/askQuestion/fulfilled", payload: {success: json.success, question: {...json.question, author: store.auth.myData}}});
    }
}

export const getOneQuestion = (questionId) => async (dispatch) => {
    dispatch({type: "questions/getOneQuestion/pending"});

    const res = await fetch("/question/" + questionId);
    const json = await res.json();

    if (json.error) {
        dispatch({type: "questions/getOneQuestion/rejected", error: json.error});
    } else {
        dispatch({type: "questions/getOneQuestion/fulfilled", payload: {success: json.success, data: json.question}});
    }
}


export default reducer;