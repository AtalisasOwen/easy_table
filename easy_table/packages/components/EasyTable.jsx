
import EasyForm from './EasyForm'
import CommonSearch from './CommonSearch'
import './EasyTable.css'
import { PlTable, PlTableColumn, PlxTableGrid, PlxTableColumn } from 'pl-table';

import 'pl-table/themes/index.css' // 引入样式（必须引入)，vuecli3.0不需要配置，cli2.0请查看webpack是否配置了url-loader对woff，ttf文件的引用,不配置会报错哦

export default {
    name: 'EasyTable',
    props: {
        easyColumns: Array,         // 列定义
        formMethods: Object,        // onSubmitCreate, onSubmitUpdate
        tableMethods: Object,       // getAllListByPagingCount, getAllListByPaging, getFilteredListByPaging, getFilteredListByPagingCount, getOptions
        defaultQuery: Object,       // 传出表格中的查询条件
        onlyTable: Boolean,         // 只展示表格
        // slot: custom, buttons,  `prop`
    },
    components:{
        PlTable,
        PlTableColumn,
        PlxTableGrid,
        PlxTableColumn
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
            selectedColumns: [],
            selectedColumnsVisible: false,
            listQuery: {},
            renderRowsStart: 0,
            renderRowsEnd: 20
        }
    },
    created(){
    },
    mounted(){
    },
    watch:{
        listQuery: {
            handler(newValue, oldValue) {
                this.$emit('update:defaultQuery', newValue)
            },
            immediate: true,
            deep: true
        }
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
        },
        onSelectColumns(){
            return () => {

            }
        },
        onScroll(params){
            // this.renderRowsStart = Math.round(params.scrollTop / 35)
            // this.renderRowsEnd = this.renderRowsStart + Math.round(params.clientHeight / 35)
            console.log(params)
        },
        hidingRow({rowIndex}){
        }
    },
    render(h) {

        const options = this.easyColumns
            .filter(c => !c.hideInTable)
            .map(c => <el-option
                    label={ c.label }
                    value={ c.prop } />);

        const elColumns = this.easyColumns
            .filter(c => !c.hideInTable)
            .filter(c => this.selectedColumns.indexOf(c.prop) < 0)
            .map(c =>
                <pl-table-column
                    // className={ this.selectedColumns.indexOf(c.prop) < 0 ? "" : "easy-hidden"}
                    fixed={c.fixed}
                    prop={ c.prop }
                    label={ c.label }
                    show-overflow-tooltip={ true }
                    width={ c.width ? c.width : 120 }
                    sortable={ c.sortable ? 'custom' : false }
                    scopedSlots={ {
                        default: this.$scopedSlots[c.prop]
                    } }
                >
                </pl-table-column>);

        const customColumns = [<pl-table-column
            fixed="right"
            prop={ 'custom' }
            label="操作"
            width="120"
            scopedSlots={ {
                default:  this.$scopedSlots['custom'] ? this.$scopedSlots['custom'] : props => {
                    return (
                        <span>
                                    <el-button onClick={ this.onEdit(props) } type="text" size="small">编辑</el-button>
                                    <el-button type="text" size="small">删除</el-button>
                                </span>
                    )
                },
            } }
        >
        </pl-table-column>];


            return (
                <div>
                    <CommonSearch
                        showFilter={!this.onlyTable}
                        columnOptions={this.easyColumns}
                        props={this.tableMethods}
                        vpageList={this.data}
                        listLoading={this.listLoading}
                        sort={this.sort}
                        refresh={this.refresh}
                        defaultQuery={this.listQuery}
                        on={
                            {
                                'update:listLoading': newValue => this.listLoading = newValue,
                                'update:pageList': newValue => this.data = newValue,
                                'update:refresh': newValue => this.refresh = newValue,
                                'update:defaultQuery': newValue => this.listQuery = newValue

                            }
                        }
                        scopedSlots={{
                            right: (props) => <span style="float: right;margin-right: 2%;">
                                  <el-button type="primary" icon="el-icon-plus" circle onClick={ this.onCreate() }></el-button>
                                  <el-button type="info" icon="el-icon-refresh" circle onClick={ () => this.refresh = true }></el-button>
                                    { this.$scopedSlots['buttons'] ? this.$scopedSlots['buttons']() : null }
                             <el-select
                                vModel={this.selectedColumns}
                                multiple={true}
                                collapseTags={true}
                                style="margin-left: 20px;"
                                placeholder="请选择不展示列">
                                {
                                    options
                                }
                            </el-select>
                            </span>
                        }}
                    >
                        <pl-table
                            ref="plTable"
                            useVirtual={true}
                            rowHeight={35}
                            rowKey={'employeeId'}
                            excessRows={5}
                            data={ this.data }
                            style="width: 100%"
                            vLoading={this.listLoading}
                            max-height={600}
                            cell-style={{padding: '1px', color: 'black'}}
                            border={true}
                            fit={true}
                            // highlightCurrentRow={true}
                            vOn:sort-change={ this.sortFn }
                            rowClassName={this.hidingRow}
                        >
                            { ...elColumns }
                            {...customColumns}
                        </pl-table>
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
