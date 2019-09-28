const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  chainWebpack: config => {
    config.externals({
      vue: 'Vue',
      'vue-router': 'VueRouter',
      'vue-i18n': 'VueI18n',
      vuex: 'Vuex',
      axios: 'axios'
    })
    config.resolve.alias
      .set('@', resolve('src'))
  }
}
