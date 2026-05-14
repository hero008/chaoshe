import api from "./request.js"

export function get(url, params, baseURL) {
	return api({
		url,
		params,
		method: "GET",
		baseURL
	})
}
export function post(url, params, baseURL) {
	return api({
		url,
		params,
		method: "POST",
		baseURL
	})
	
}  
export function activityLIst(key) {
    return api({
		url:"v1/activity/list",
		params:key,
		method: "POST",
	})
    
}