let baseURL = ''
let token = '123456'
let userSite = '测试'
let address = location.href;

if (address.indexOf('jzxn_202_8080') >= 0) {
    baseURL = '/jzxn_202_8080/';
} else if (address.indexOf('jksdev_190_171_8080') >= 0) {
    baseURL = '/jksdev_190_171_8080/';
} else if (address.indexOf('jksdev_190_206_8080') >= 0) {
    baseURL = '/jksdev_190_206_8080/';
}else if (address.indexOf('localhost') >= 0) {
    baseURL = '';
}
export default {
    baseURL,
    token,
    userSite
}