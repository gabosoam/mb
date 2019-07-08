

const urlApi = 'http://192.168.0.106:1337/';

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