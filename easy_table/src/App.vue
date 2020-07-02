<template>
    <div id="app">
        <Hello/>
        <EasyTable :easy-columns="columns" :data="form" :form-methods="formMethods"/>
    </div>
</template>

<script>
    import Hello from "./components/Hello.jsx";
    import EasyForm from "./components/EasyForm";
    import EasyTable from "./components/EasyTable";

    export default {
        name: "App",
        data() {
            return {
                form: [
                    {
                        date: "2016-05-02",
                        name: "王小虎1",
                        address: "上海市普陀区金沙江路 1518 弄",
                        money: 20006600,
                        dprt: {
                            id: 1,
                            name: "A部门",
                            phone: "021-0000000",
                        },
                        ddd: {
                            dsdsd: {
                                birthday: "2019-01-02T08:00:00",
                            },
                        },
                    },
                    {
                        date: "2016-05-02",
                        name: "王小虎2",
                        address: "上海市普陀区金沙江路 1518 弄",
                        money: 20006600,
                        dprt: {
                            id: 1,
                            name: "A部门",
                            phone: "021-0000000",
                        },
                        ddd: {
                            dsdsd: {
                                birthday: "2019-01-02T08:00:00",
                            },
                        },
                    },
                    {
                        date: "2016-05-02",
                        name: "王小虎3",
                        address: "上海市普陀区金沙江路 1518 弄",
                        money: 20006600,
                        dprt: {
                            id: 1,
                            name: "A部门",
                            phone: "021-0000000",
                        },
                        ddd: {
                            dsdsd: {
                                birthday: "2019-01-02T08:00:00",
                            },
                        },
                    },
                ],
                emptyForm: {},
                columns: [
                    {
                        prop: "date",
                        label: "日期",
                        valueType: "date",
                    },
                    {
                        prop: "money",
                        label: "工资",
                        valueType: "money",
                    },
                    {
                        prop: "name",
                        label: "姓名",
                    },
                    {
                        prop: "address",
                        label: "地址",
                    },
                    {
                        prop: "dprt.id",
                        label: "部门ID",
                        valueType: "enum",
                        width: 100,
                        enumUrl: "/api/XXX/",
                        enumItems: [
                            {
                                value: "A部门", id: 1,
                            },
                            {
                                value: "B部门", id: 2,
                            },
                        ],
                        hideInTable: true
                    },
                    {
                        prop: "dprt.name",
                        label: "部门名称",
                        hideInForm: true,
                        render: Hello
                    },
                    {
                        prop: "dprt.phone",
                        label: "部门电话",
                    },
                    {
                        prop: "ddd.dsdsd.birthday",
                        label: "生日",
                        valueType: "datetime",
                        width: 180,
                    },
                ],
                formMethods:{
                    onSubmitCreate: (form) => {
                        console.log("cccc")
                        console.log(JSON.stringify(form));
                    },
                    onSubmitUpdate: (form) => {
                        console.log("uuuu")
                        console.log(JSON.stringify(form));
                    }
                }
            };
        },
        components: {
            Hello, EasyForm, EasyTable,
        },
    };
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
