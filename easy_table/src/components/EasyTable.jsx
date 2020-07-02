import EasyForm from "./EasyForm";
import fa from "element-ui/src/locale/lang/fa";

export default {
    props: {
      data: Array,
      easyColumns: Array
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
              this.dialogVisible = true;
              this.form = props.row;
          }
      },
        onCreate(){
            this.dialogVisible = true;
            this.form = undefined
        }
    },
    render(h){
        const elColumns = this.easyColumns.map(c =>
            <el-table-column
            prop={c.prop}
            label={c.label}
            show-overflow-tooltip={true}
            width={c.width ? c.width : 120}>
        </el-table-column>);
        return (
            <div>
                <div>
                    <el-button type="primary" onClick={this.onCreate}>新建</el-button>
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
                    <EasyForm easyForm={ this.form === undefined ? undefined : {...this.form}} easyColumns={this.easyColumns} methods={
                        {
                            onCancel: () => this.dialogVisible = false,
                            onSubmit: (form) => () => {
                                console.log(JSON.stringify(form));
                                this.dialogVisible = false
                            }
                        }
                    } />
                </el-dialog>
            </div>

        )
    }
}
