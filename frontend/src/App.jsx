import { useState, useRef, useContext, createContext, useEffect, useCallback } from 'react'

function App() {
    return (
        <StateProvider>
        </StateProvider>
    );
}

export default App;

const BASE_URL = "http://localhost:3500/";
async function fetchBackend(extension, method, body = null) {

    const build = {
        method: method,
        headers: {
            "Content-Type": "application/json"
        }
    }

    if (body !== null) {
        build.body = JSON.stringify(body);
    }

    let result = null;
    try {
        let response = await fetch(`${BASE_URL}${extension}`, build);
        result = await response.json();
    }
    catch (error) {
        console.error(error);
    }
    finally {
        return result;
    }
}

const StateContext = createContext({});
function StateProvider({ children }) {

    const [ allBookData, setAllBookData ] = useState(null);
    const [ allGenres, setAllGenres ] = useState(null);
    const [ booksByGenre, setBooksByGenre ] = useState(null);
    const [ topSelllers, setTopSellers ] = useState(null);
    const [ booksByAuthors, setBooksByAuthors ] = useState(null);

    useEffect(() => {
        async function asyncHandler() {
            const allBookDataResponse = await fetchBackend("books?id=all", "GET");
            const booksByGenreResponse = await fetchBackend("books_by_genres/by_genre_id/1", "GET");
            console.log(allBookData.response);
            console.log(booksByGenre.response);
            setAllBookData(allBookData.response);
            setBooksByGenre(booksByGenre.response);
        }

        asyncHandler();
    }, []);

    const stateCtx = {};
    return (
        <StateContext.Provider value={stateCtx}>
            {children}
        </StateContext.Provider>
    );
}

function FormWrapper({ children }) {
    return (
        <form>
            <fieldset>
                <legend></legend>
                {children}
            </fieldset>
        </form>
    );
}

function FieldSetInput() {
    return (
        <fieldset>
            <legend></legend>
            <label></label>
            <input></input>
        </fieldset>
    );
}