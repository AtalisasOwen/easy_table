import EasyForm from "./EasyForm";


export default {
    props: {
      data: Array,
      easyColumns: Array,
      formMethods: Object
    },
    data(){
        return {
            form: null,
            dialogVisible: false
        }
    },
    methods: {
        handleClose(done) {
            this.$confirm('确认关闭？')
                .then(_ => {
                    this.dialogVisible = false
                    done();
                })
                .catch(_ => {});
        },
      onEdit(props){
          return () =>{
              this.form = props.row;
              this.dialogVisible = true;
          }
      },
        onCreate(){
            this.form = undefined
            this.dialogVisible = true;
        }
    },
    render(h){
        const elColumns = this.easyColumns
            .filter(c => !c.hideInTable)
            .map(c =>
            <el-table-column
            prop={c.prop}
            label={c.label}
            show-overflow-tooltip={true}
            width={c.width ? c.width : 120}
            scopedSlots={{
                default: this.$scopedSlots[c.prop]
            }}
            >
            </el-table-column>);
        return (
            <div>
                <div>
                    <el-button icon="el-icon-plus" type="primary" onClick={this.onCreate}>新建</el-button>
                </div>
                <el-table
                    data={this.data}
                    style="width: 100%">
                    {...elColumns}
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="180" scopedSlots={{
                        default: props => {
                            return (
                                <span>
                                    <el-button onClick={this.onEdit(props)} type="text" size="small">编辑</el-button>
                                    <el-button type="text" size="small">删除</el-button>
                                </span>
                            )
                        }
                    }}>
                    </el-table-column>
                </el-table>
                <el-dialog
                    before-close={this.handleClose}
                    title="提示"
                    visible={this.dialogVisible}
                    width="35%">
                    <EasyForm easyForm={ this.form } easyColumns={this.easyColumns} methods={
                        {
                            onCancel: () => {
                                this.dialogVisible = false
                            },
                            onSubmitCreate: (form) => {
                                this.formMethods.onSubmitCreate(form)
                                this.dialogVisible = false
                            },
                            onSubmitUpdate: (form) => {
                                this.formMethods.onSubmitUpdate(form)
                                this.dialogVisible = false
                            },
                        }
                    } />
                </el-dialog>
            </div>

        )
    }
}
