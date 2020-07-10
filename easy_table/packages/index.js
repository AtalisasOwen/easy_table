import EasyForm from './components/EasyForm.vue'
import EasyTable from './components/EasyTable.vue'

const components = [EasyTable, EasyForm]

const install = function (Vue) {
    components.map(com => Vue.component(com.name, com))
}

if (typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
}

export default {
    install,
    ...components
}
