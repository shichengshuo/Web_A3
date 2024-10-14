const api = "https://24274685.it.scu.edu.au/api"
const xhr = (method = 'GET', url, data) => {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method, api+url, true);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.responseText ? JSON.parse(xhr.responseText) : '');
            } else {
                alert(`api error: ${xhr.status} - ${xhr.statusText}`);
            }
        };
        xhr.onerror = () => alert('api error');
        data ? xhr.send(JSON.stringify(data)) : xhr.send();
    });
};
const ajax = {
    get: (url) => xhr('GET', url),
    post: (url, data) => xhr('POST', url, data),
    put: (url, data) => xhr('PUT', url, data),
    delete: (url) => xhr('DELETE', url),
};

