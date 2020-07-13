import EasyForm from './components/EasyForm.jsx'
import EasyTable from './components/EasyTable.jsx'

const components = [EasyTable, EasyForm]

const install = function (Vue) {
    components.forEach(com => Vue.component(com.name, com))
}

if (typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
}

export default {
    install,
    EasyForm,
    EasyTable
}
