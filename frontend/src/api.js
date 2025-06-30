export async function fetchCreatePost(postBody){
    const settings = {
        method: 'POST',
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postBody)
    };
    try {
        const response = await fetch(import.meta.env.VITE_URL + '/posts', settings);
        return response;
    }
    catch (error) {
        console.log(error);
    }
}
