

const urlApi = 'https://eficar.herokuapp.com/';

export default {
    get: (url) => {
        return fetch(urlApi + url, );
    },

    post: async (url, body) => {
        return await fetch(urlApi + url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    },

    patch: async (url, body, token) => {
        return await fetch(urlApi + url, {
            method: 'PATCH',
            body: JSON.stringify(body),
            headers: { authorization: token }
        });
    }
}