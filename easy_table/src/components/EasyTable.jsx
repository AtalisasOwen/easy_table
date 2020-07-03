import EasyForm from './EasyForm'
import CommonSearch from './CommonSearch'


export default {
    props: {
        easyColumns: Array,
        formMethods: Object,
        tableMethods: Object
    },
    data() {
        return {
            show: false,
            form: null,
            dialogVisible: false,
            sort: null,
            listLoading: false,
            refresh: false,
            data: [],
        }
    },
    created(){
    },
    methods: {
        sortFn(data) {
            const { prop, order } = data;
            if (order === 'descending') {
                this.sort = '-' + prop
            } else if (order === 'ascending') {
                this.sort = '=' + prop
            } else {
                this.sort = null
            }
        },
        handleClose(done) {
            this.dialogVisible = false
            done()
            // this.$confirm('确认关闭？')
            //     .then(_ => {
            //         this.dialogVisible = false
            //         done()
            //     })
            //     .catch(_ => {
            //     })
        },
        onEdit(props) {
            return () => {
                this.form = props.row
                this.dialogVisible = true
            }
        },
        onCreate() {
            return () => {
                this.form = undefined
                this.dialogVisible = true
            }
        }
    },
    render(h) {
        const elColumns = this.easyColumns
            .filter(c => !c.hideInTable)
            .map(c =>
                <el-table-column
                    prop={ c.prop }
                    label={ c.label }
                    show-overflow-tooltip={ true }
                    width={ c.width ? c.width : 120 }
                    sortable={ c.sortable ? 'custom' : false }
                    scopedSlots={ {
                        default: this.$scopedSlots[c.prop]
                    } }
                >
                </el-table-column>)

            return (
                <div>
                    <CommonSearch
                        columnOptions={this.easyColumns}
                        props={this.tableMethods}
                        vpageList={this.data}
                        listLoading={this.listLoading}
                        sort={this.sort}
                        refresh={this.refresh}
                        on={
                            {
                                'update:listLoading': newValue => this.listLoading = newValue,
                                'update:pageList': newValue => this.data = newValue,
                                'update:refresh': newValue => this.refresh = newValue

                            }
                        }
                        scopedSlots={{
                            right: (props) => <span style="float: right;margin-right: 10%;"><el-button icon="el-icon-plus" type="primary" onClick={ this.onCreate() }>新建</el-button></span>
                        }}
                    >
                        <el-table
                            data={ this.data }
                            style="width: 100%"
                            vLoading={this.listLoading}
                            max-height={600}
                            cell-style={{padding: '1px'}}
                            border={true}
                            fit={true}
                            highlightCurrentRow={true}
                            vOn:sort-change={ this.sortFn }
                        >
                            { ...elColumns }
                            <el-table-column
                                fixed="right"
                                label="操作"
                                width="180"
                                scopedSlots={ {
                                    default: props => {
                                        return (
                                            <span>
                                    <el-button onClick={ this.onEdit(props) } type="text" size="small">编辑</el-button>
                                    <el-button type="text" size="small">删除</el-button>
                                </span>
                                        )
                                    }
                                } }>
                            </el-table-column>
                        </el-table>
                        <el-dialog
                            before-close={ this.handleClose }
                            title="提示"
                            visible={ this.dialogVisible }
                            width="35%">
                            <EasyForm easyForm={ this.form ? {...this.form} : undefined } easyColumns={ this.easyColumns } methods={
                                {
                                    onCancel: () => {
                                        this.dialogVisible = false
                                    },
                                    onSubmitCreate: (form) => {
                                        this.formMethods.onSubmitCreate(form)
                                        this.dialogVisible = false
                                        this.refresh = true
                                    },
                                    onSubmitUpdate: (form) => {
                                        this.formMethods.onSubmitUpdate(form)
                                        this.dialogVisible = false
                                        this.refresh = true
                                    }
                                }
                            }/>
                        </el-dialog>
                    </CommonSearch>
                </div>

            )

    }
}
