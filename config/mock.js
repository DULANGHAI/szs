// let mockUrl = "http://www.easy-mock.com/mock/59914154a1d30433d860f859/zhongan/zoom/"
const keyValues = [
  { 'key': '/v1', 'value': 'http://192.168.2.192' },
]
const proxy = {};
for (let i of keyValues) {
  proxy[i.key] = {
    target: i.value,
    changeOrigin: true
  }
}
module.exports = proxy
