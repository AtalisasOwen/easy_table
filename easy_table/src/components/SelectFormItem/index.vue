<template>
    <el-form-item :label="label">
        <el-select :value="value" @input="$emit('input', $event)" :placeholder="'请选择' + label" style="width: 100%;"
                   :disabled="disabled">
            <el-option v-for="item in optionItems" :label="item.label" :value="item.value" :key="item.value"></el-option>
        </el-select>
    </el-form-item>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'SelectFormItem',
        props: [
            'value',
            'label',
            'disabled',
            'items',
            'url'
        ],
        data() {
            return {
                optionItems: [],
                strVal: ''
            }
        },

        watch:{
            url(newValue, oldValue){
                this.getOptionItems()
            },
        },
        created(){
            this.getOptionItems()
        },
        methods: {
            getOptionItems(){
                if (this.items && this.items.length > 0){
                    this.optionItems = [...this.items]
                }else{
                    axios.get(this.url).then(resp => {
                        this.optionItems = resp.data.data
                        this.strVal = this.optionItems.filter(i => i.id === this.value.toString())[0].value
                    })
                }
            }
        },
        components: {
        }
    }
</script>

<style lang="less">
</style>
