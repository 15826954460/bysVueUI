module.exports = {
  configureWebpack: {
    externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vue-i18n': 'VueI18n',
      'vuex': 'Vuex',
      'axios': 'axios',
    }
  },
}