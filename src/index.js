import TouchProgress from '@/components/TouchProgress/index.vue'
const components = [TouchProgress]
const install = function (Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}
export default {
  version: '0.0.1',
  install,
  TouchProgress
}
