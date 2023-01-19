export const BASE_API_URL = "http://localhost:5000/api/V1.0.0"
// export const BASE_API_URL = "http://10.192.50.28:5000/api/V1.0.0"

const api = async <T>(url: string, method: string, body?: BodyInit, headers?:HeadersInit ):Promise<T> => {    

    let headersWithAuth = null

    if(headers)
        headersWithAuth = {
            ...headers,
            "authorization": ""
        }

    const options: RequestInit  & {headers:{authorization:string}}= {
        method,
        headers: headersWithAuth || {
            "Content-Type": "application/json",
            "authorization": ""
        },
    } 
    console.log(BASE_API_URL+url);
    

    if (body)
        options.body = JSON.stringify(body);

    const token = localStorage.getItem("token");

    if(token){
        options.headers.authorization = "Bearer "+token;
    }
    
    const res = await fetch(BASE_API_URL+url, options);

    if(!res.ok)
        throw new Error(res.statusText + " " + res.status);

    let resJson:any
    if(res.headers.get('Content-Type')?.includes('application/json')) 
        resJson = await res.json(); 
    
    else{
        resJson = await res.blob()
    }
    return resJson;
}

export default {
    get: <T>(url: string, body?: any, headers?: HeadersInit) => {
        return api<T>(url, "GET", body)
    },

    post: <T>(url: string, body?: any, headers?: HeadersInit) => {
        return api<T>(url, "POST", body);
    },

    put: <T>(url: string, body?: any, headers?: HeadersInit) => {
        return api<T>(url, "PUT", body);
    },

    delete: <T>(url: string, body?: any, headers?: HeadersInit) => {
        return api<T>(url, "DELETE", body);
    },

    patch: <T>(url: string, body?: any, headers?: HeadersInit) => {
        return api<T>(url, "PATCH", body);
    },

    options: <T>(url: string, body?: any, headers?: HeadersInit) => {
        return api<T>(url, "OPTIONS", body);
    },

    head: <T>(url: string, body?: any, headers?: HeadersInit) => {
        return api<T>(url, "HEAD", body);
    }
}