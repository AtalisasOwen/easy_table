import EasyTable from "./components/EasyTable";
import EasyForm from "./components/EasyForm";

const components = {
    EasyForm, EasyTable
};

const install = function (Vue, opts = {}) {
    components.map(component => {
        Vue.component(component.name, component)
    })
}

if (typeof window !== 'undefined' && window.Vue){
    install(window.Vue)
}

export default {
    install,
    EasyTable,
    EasyForm
}
