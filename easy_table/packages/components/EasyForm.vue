<script>
import "./EasyForm.css";

import SelectFormItem from './SelectFormItem'

export default {
    props: {
        easyForm: Object,
        easyColumns: Array,
        methods: Object
    },
    data() {
        return {
            form: null,
            columns: this.easyColumns,
            mode: null,
            size: 'medium'
        };
    },
    watch:{
        easyForm(newValue, oldValue){
            if (this.easyForm){
                this.form = this.makeProxy(newValue)
                this.mode = 'edit'
            }else{
                const form = {};
                this.easyColumns.forEach(col => {
                    this.createEmptyForm(form, col.prop);
                });
                this.form = this.makeProxy(form)
                this.mode = 'create'
            }
        }
    },
    created() {
        if (this.easyForm){
            this.form = this.makeProxy(this.easyForm)
            this.mode = 'edit'
        }else{
            const form = {};
            this.easyColumns.forEach(col => {
                this.createEmptyForm(form, col.prop);
            });
            this.form = this.makeProxy(form)
            this.mode = 'create'
        }
        if (this.form.length > 11){
            this.size = 'small'
        }
    },
    methods: {
        formatMoney(value) {
            return `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        createEmptyForm(form, prop) {
            if (prop.indexOf(".") >= 0) {
                let pps2 = prop.indexOf(".");
                let p1 = prop.slice(0, pps2);
                let p2 = prop.slice(pps2 + 1, prop.length);
                if (form[p1] === undefined){
                    form[p1] = {};
                }
                this.createEmptyForm(form[p1], p2);
            } else {
                form[prop] = null;
            }
        },
        makeProxy(form){
            return new Proxy(form, {
                get: (obj, prop) => {
                    if ((typeof prop) === "string") {
                        if (prop.indexOf(".") >= 0) {
                            for (let pp of prop.split(".")) {
                                obj = obj[pp];
                            }
                            return obj;
                        } else {
                            return obj[prop];
                        }
                    }
                    return obj[prop];
                },
                set(obj, prop, value) {
                    if ((typeof prop) === "string") {
                        if (prop.indexOf(".") >= 0) {
                            let pps2 = prop.lastIndexOf(".");
                            let p1 = prop.slice(0, pps2);
                            let p2 = prop.slice(pps2 + 1, prop.length);
                            this.get(obj, p1)[p2] = value;
                            return true;
                        } else {
                            obj[prop] = value;
                            return true;
                        }
                    }
                    obj[prop] = value;
                    return true;
                },
                has(target, p) {
                    return this.get(target, p) !== undefined;
                },
            })
        },
        onSubmit(){
            if (this.mode === 'create'){
                this.methods.onSubmitCreate(this.form)
            } else {
                this.methods.onSubmitUpdate(this.form)
            }
        },
    },
    render(h) {
        const formItems = this.columns
            .filter(c => !c.hideInForm)
            .map(c => {
                const disabled = this.mode === 'edit' ? !!c.disabled : false;

                if (c.valueType && c.valueType === "date") {
                    return <el-form-item label={c.label}>
                        <el-date-picker
                            type="date"
                            placeholder="选择日期"
                            vModel={this.form[c.prop]}
                            style="width: 100%;"
                            disabled={disabled}
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>;
                } else if (c.valueType && c.valueType === "datetime") {
                    return <el-form-item label={c.label}>
                        <el-date-picker
                            vModel={this.form[c.prop]}
                            style="width: 100%;"
                            type="datetime"
                            value-format="yyyy-MM-ddTHH:mm:ss"
                            disabled={disabled}
                            placeholder="选择日期时间">
                        </el-date-picker>
                    </el-form-item>;
                } else if (c.valueType && c.valueType === "money") {
                    return <el-form-item label={c.label}>
                        <el-tooltip className="item" effect="light" content={this.formatMoney(this.form[c.prop])}
                                    placement="top-start">
                            <el-input-number
                                vModel={this.form[c.prop]}
                                style="width: 100%; text-align: left"
                                controls={false}
                                precision={2}>
                            </el-input-number>
                        </el-tooltip>
                    </el-form-item>;
                } else if (c.valueType && c.valueType === "enum") {
                    return <SelectFormItem vModel={this.form[c.prop]} label={c.label} disabled={disabled} items={c.enumItems} url={c.enumUrl} />
                    // return <el-form-item label={c.label}>
                    //     <el-select vModel={this.form[c.prop]} placeholder={"请选择" + c.label} style="width: 100%;"
                    //                disabled={disabled}>
                    //         {
                    //             a.map(item => <el-option label={item.value} value={item.id}></el-option>)
                    //         }
                    //     </el-select>
                    // </el-form-item>;
                }
                return <el-form-item label={c.label}>
                    <el-input vModel={this.form[c.prop]} disabled={disabled}></el-input>
                </el-form-item>;
            })


        return (<el-form ref="form" model={this.form} label-width="80px" vOn:input={(v) => console.log(v)} size={this.size}>
            {...formItems}
            <el-form-item>
                <el-button type="primary" onClick={this.onSubmit}>提交</el-button>
                <el-button onClick={ this.methods.onCancel }>取消</el-button>
            </el-form-item>
        </el-form>);
    },
};
</script>
