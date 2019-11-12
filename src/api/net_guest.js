import axios from 'axios';

let base = 'http://112.5.125.80/ssm';

export const getDocByDocid = params => { return axios.get(`${base}/net-guest/getDocByDocid`, { params: params }); };
export const getHanlesByParentid = params => { return axios.get(`${base}/net-guest/getHanlesByParentid`, { params: params }); };
export const createDocument = params => { return axios.post(`${base}/net-guest/createDocument`,   params ); };
export const createDocumentAndStartFlow = params => { return axios.post(`${base}/net-guest/createDocumentAndStartFlow`,   params ); };
export const getDocsByFormname = params => { return axios.get(`${base}/net-guest/getDocsByFormname`, { params: params }); };
export const updateDocument = params => { return axios.get(`${base}/net-guest/updateDocument`, { params: params }); };
export const updateANDsubmit = params => { return axios.get(`${base}/net-guest/updateANDsubmit`, { params: params }); };
export const smsCode = params => { return axios.get(`${base}/net-guest/smsCode`, { params: params }); };




