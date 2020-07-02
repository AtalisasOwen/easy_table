export default {
    props: {
      data: Array,
      easyColumns: Array
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
            <el-table
                data={this.data}
                style="width: 100%">
                {...elColumns}
                <el-table-column
                    fixed="right"
                    label="操作"
                    width="180">
                    <el-button onClick={value => console.log(value)} type="text" size="small">编辑</el-button>
                    <el-button type="text" size="small">删除</el-button>
                </el-table-column>
            </el-table>
        )
    }
}
