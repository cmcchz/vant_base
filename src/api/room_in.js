import axios from 'axios';

let base = '/ssm';

export const getRoomByDocid = params => { return axios.get(`${base}/zbjk/getRoomByDocid`, { params: params }); };
export const getRoomHanleByDocid = params => { return axios.get(`${base}/zbjk/getRoomHanleByDocid`, { params: params }); };
export const insertRoomHandle = params => { return axios.get(`${base}/zbjk/insertRoomHandle`, { params: params }); };
export const getDocsByFormname = params => { return axios.get(`${base}/zbjk/getDocsByFormname`, { params: params }); };
export const updateDocument = params => { return axios.get(`${base}/zbjk/updateDocument`, { params: params }); };

export const getDocByDocid = params => { return axios.get(`${base}/zbjk/getRoomByDocid`, { params: params }); };
export const insertHandle = params => {
    return axios.post(`${base}/zbjk/insertHandle`,   params );
};

