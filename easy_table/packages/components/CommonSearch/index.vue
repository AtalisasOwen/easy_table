<template>
    <div class="app-container">
        <div class="filter-container">
            <el-select v-model="listQuery.type" placeholder="列名" clearable class="filter-item" style="width: 150px">
                <el-option v-for="col in columnOptions" v-if="!col.hideInTable" :key="col.prop" :label="col.label" :value="col.prop" />
            </el-select>
            <el-select v-model="listQuery.bool" placeholder="逻辑" clearable style="width: 150px" class="filter-item">
                <el-option v-for="(item, i) in boolOptions" :key="i" :label="i" :value="item" />
            </el-select>
            <el-autocomplete
                    v-if="judgeDate(listQuery.type)"
                    v-model="listQuery.keyword"
                    placeholder="过滤词"
                    style="width: 200px;"
                    class="filter-item"
                    :fetch-suggestions="querySearch"
                    @select="handleSelectQuery"
                    @keyup.enter.native="addFilterEntity"
            />
            <el-date-picker
                    v-else
                    v-model="listQuery.keyword"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    class="filter-item"
                    @change="addFilterEntity"
            />
            <el-button icon="el-icon-plus" size="small" circle class="filter-item" @click="addFilterEntity" />
            <el-select v-model="logit" placeholder="请选择" style="width: 80px" class="filter-item">
                <el-option label="并且" value="and" />
                <el-option label="或者" value="or" />
            </el-select>
            <!--
            <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
              搜索
            </el-button>
            -->
            <slot name="right"></slot>
        </div>
        <div>
            <el-tag
                    v-for="(tag, ii) in filterEntitys"
                    :key="ii"
                    closable
                    @close="handleDeleteTag(tag)"
            >
                {{ parseTag(tag) }}
            </el-tag>
        </div>
        <slot />
        <pagination
                :total="total"
                :page.sync="listQuery.page"
                :limit.sync="listQuery.limit"
                @pagination="getListByPage"
        />
    </div>
</template>

<script>
    import Pagination from '../Pagination/index'

    /**
     * @author 顾文涛
     * @date 2020-03-25
     * 通用搜索，分页组件，使用方法见 src/views/employee/index.vue
     * 省略200行的模板代码，其他地方懒得改了，如果没有变化就等着后人改吧
     * 使用说明：需要提供6个prop：
     *    pageList: 分页组件返回的数据，会直接存入这个对象，这是一个双向绑定的列表数据
     *    columnOptions: 字段配置
     *    之后四个方法，要符合一定规范，不过后端也是我写的，目前没有这个问题
     *    分别代表：获取分页数据，获取分页数据总数，获取筛选后的分页数据，获取筛选后的分页数据总数
     *
     *  TODO:
     *    1. 根据类型，改变不同的输入框，特别像日期，时间这些
     */
    /* eslint-disable */
    export default {
        name: 'CommonSearch',
        components: { Pagination },
        props: [
            'getAllListByPaging',               // 分页获取数据接口
            'getAllListByPagingCount',          // 数据总数量接口
            'getFilteredListByPaging',          // 带筛选的分页接口
            'getFilteredListByPagingCount',     // 带筛选的数量接口
            'pageList',                         // 表格数据
            'columnOptions',                    // 列选项
            'getOptions',                       // 获取筛选数据接口
            'listLoading',                      // 列表loading控制
            'refresh',                          // 刷新控制
            'sort'                              // 排序控制
        ],
        data() {
            return {
                total: 100,
                logit: 'and',
                listQuery: {
                    page: 1,
                    limit: 50,
                    bool: 'EQUALS',
                    type: null,
                    keyword: null,
                    realKeyword: null,
                    sort: null
                },
                boolOptions: {
                    '值中含有': 'CONTAINS',
                    '值中不含有': 'NOT_CONTAINS',
                    '等于': 'EQUALS',
                    '不等于': 'NOT_EQUALS',
                    '大于': 'GREATER_THAN',
                    '小于': 'LESS_THAN'
                },
                list: null,
                dialogFormVisible: false,
                filterEntitys: []
            }
        },
        created() {
            this.getListByPage(this.listQuery)
        },
        watch: {
            refresh(newVal, oldValue) {
                if (newVal){
                    this.getListByPage(this.listQuery)
                    this.$emit('update:refresh', false)
                }
            },
            sort(newVal, oldValue) {
                this.listQuery.sort = newVal
                this.$emit('update:refresh', true)
            },
            logit(newVal, oldValue) {
                this.$emit('update:refresh', true)
            }
        },
        methods: {
            handleDeleteTag(tag) {
                const s = new Set(this.filterEntitys)
                s.delete(tag)
                this.filterEntitys = [...s]
                this.listQuery.page = 1
                this.$emit('update:refresh', true)
            },
            parseTag(tag) {
                console.log(tag)
                let s = '';
                for (const col of this.columnOptions) {
                   if (col.prop === tag.field){
                       s = col.label
                       break
                   }
                }
                for (const key in this.boolOptions) {
                    if (this.boolOptions[key] === tag.logit) {
                        s = s + ' ' + key;
                        break
                    }
                }
                s = s + ' ' + tag.show;
                return s
            },
            addFilterEntity() {
                if (this.listQuery.type && this.listQuery.bool && this.listQuery.keyword) {
                    const entity = {
                        'field': this.listQuery.type,
                        'logit': this.listQuery.bool,
                        'value': this.listQuery.realKeyword == null ? this.listQuery.keyword : this.listQuery.realKeyword,
                        'show': this.listQuery.keyword
                    }
                    this.filterEntitys.push(entity)
                    this.listQuery.type = null
                    this.listQuery.bool = 'EQUALS'
                    this.listQuery.keyword = null
                    this.listQuery.realKeyword = null
                    this.listQuery.page = 1
                }
                this.$emit('update:refresh', true)
            },
            querySearch(queryString, cb) {
                if (this.listQuery.type === null || this.listQuery.type === ''){
                    cb([])
                    return
                }
                const fieldName = this.listQuery.type.split('.')[0]
                this.getOptions(fieldName).then(resp => {
                    if (queryString === undefined || queryString === null) {
                        queryString = ''
                    }
                    cb(resp.filter(options => options.value.startsWith(queryString)))
                })
            },
            handleSelectQuery(item) {
                this.listQuery.keyword = item.value
                this.listQuery.realKeyword = item.id
                this.addFilterEntity()
            },
            handleFilter() {
                this.listQuery.page = 1
                this.$emit('update:listLoading', true)
                if (this.filterEntitys.length === 0) {
                    this.getListByPage(this.listQuery)
                } else {
                    this.getFilteredListByPaging(this.listQuery, this.filterEntitys, this.logit).then(resp2 => {
                        this.$emit('update:pageList', resp2)
                        this.getFilteredListByPagingCount(this.filterEntitys, this.logit).then(resp3 => {
                            this.total = resp3
                            this.$emit('update:listLoading', false)
                        })
                    })
                }
            },
            getListByPage(query) {
                this.$emit('update:listLoading', true)
                if (this.filterEntitys.length === 0) {
                    // TODO 优化点
                    this.getAllListByPaging(query).then(resp => {
                        this.$emit('update:pageList', resp)
                        this.getAllListByPagingCount().then(resp2 => {
                            this.total = resp2
                            this.$emit('update:listLoading', false)
                        })
                    })
                } else {
                    this.getFilteredListByPaging(this.listQuery, this.filterEntitys, this.logit).then(resp2 => {
                        this.$emit('update:pageList', resp2)
                        this.getFilteredListByPagingCount(this.filterEntitys, this.logit).then(resp3 => {
                            this.total = resp3
                            this.$emit('update:listLoading', false)
                        })
                    })
                }
            },
            judgeDate(s) {
                if (s === null || s === undefined) {
                    return true
                }
                let str = s instanceof Array ? s[0] : s
                if ((str.indexOf('Date') >= 0) || (str.indexOf('day') >= 0)){
                    return false
                }
                return true
            }
        }
    }
</script>

<style scoped>

</style>
