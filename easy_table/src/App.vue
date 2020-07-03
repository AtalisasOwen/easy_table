<template>
    <div id="app">
        <EasyTable
                v-if="show"
                :easy-columns="this.columns"
                :table-methods="tableMethods"
                :form-methods="formMethods">
            <template #phone="props">
                <el-tag size="small" v-if="props.row.phone">{{ props.row.phone }}</el-tag>
            </template>
        </EasyTable>
    </div>
</template>

<script>
    import Hello from './components/Hello.jsx'
    import EasyTable from './components/EasyTable'
    import {
        getColumns,
        getEmployeesDetailCount,
        getEmployeesDetaildByPaging,
        getEmployeesDetaildByPagingWithFilter,
        getEmployeesDetaildByPagingWithFilterCount,
        getEmployeeDetailFieldOptions,
        changeEmployeeDetails
    } from './api/employee'

    export default {
        name: 'App',
        data() {
            return {
                show: false,
                columns: [],
                formMethods: {
                    onSubmitCreate: (form) => {
                        alert("无法新增")
                    },
                    onSubmitUpdate: (form) => {
                        changeEmployeeDetails(form).then(resp => console.log('OK'))
                        // console.log(form.department)
                    }
                },
                tableMethods: {
                    getAllListByPagingCount: getEmployeesDetailCount,
                    getAllListByPaging: getEmployeesDetaildByPaging,
                    getFilteredListByPaging: getEmployeesDetaildByPagingWithFilter,
                    getFilteredListByPagingCount: getEmployeesDetaildByPagingWithFilterCount,
                    getOptions: getEmployeeDetailFieldOptions
                }
            }
        },
        created(){
          getColumns().then(resp => {
              this.columns = resp
              this.show = true
          })
        },
        methods: {
        },
        components: {
            Hello, EasyTable
        }
    }
</script>

<style lang="less">
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;

        color: #2c3e50;
        margin-top: 60px;
    }
</style>
