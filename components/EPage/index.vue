<template>
  <div class="container">
    <el-card class="search-container">
      <e-search
        ref="searchForm"
        :form-data="formData"
        :form-config="formConfig"
        :form-list="formList"
        :options-data="optionsData"
        v-bind="$attrs"
        v-on="$listeners"
        :formExtraComponent="formExtraComponent"
      >
        <template>
          <div class="search-wrapper-btns">
            <el-button
              v-if="config.events.search"
              :loading="loading"
              type="primary"
              size="small"
              icon="el-icon-search"
              @click="initSearch"
            >
              查询
            </el-button>
            <el-button
              v-if="config.events.reset"
              type="primary"
              icon="el-icon-refresh-right"
              size="small"
              @click="reset"
            >
              重置
            </el-button>

          </div>
        </template>
      </e-search>
    </el-card>
    <el-card class="table-container">
      <e-table
        ref="costomTable"
        :list="list"
        :columns="columns"
        :loading="loading"
        v-bind="{
          ...$attrs,
          ...config.table,
        }"
        v-on="$listeners"
      >
        <template #headerBtn>
          <slot name="headerBtns"></slot>
          <el-button
            v-if="config.events.import"
            icon="el-icon-upload2"
            v-bind="{...config.events.import}"
            @click="handlerImport"
          >
            {{ config.events.import.text || '导入' }}
          </el-button>
          <el-button
            v-for="(btn, btnIdx) in config.table.headerBtn || []"
            :key="`table_header_${btnIdx}`"
            v-bind="btn"
            @click="handleEvent(btn, btn.data)"
          >
            {{ btn.text }}
          </el-button>
          <el-button
            v-if="config.events.add"
            type="primary"
            size="small"
            icon="el-icon-document-add"
            @click="addItem"
          >
            {{ config.events.add.text || '新增' }}
          </el-button>
          <el-button
            v-if="config.events.export"
            type="primary"
            size="small"
            icon="el-icon-download"
            @click="exportFile"
          >
            导出
          </el-button>
        </template>
        <template v-for="(columnSlot, slotIdx) in columnsSlotList" v-slot:[columnSlot.slotName]="{ row }">
          <div v-if="columnSlot.btnGroup" :key="`column_slot_tpl_${slotIdx}`">
            <template v-for="(btn, idx) in columnSlot.btnGroup">
              <slot v-if="btn.slotName" :name="btn.slotName" :row="{ ...row }"></slot>
              <template v-else>
                <el-button
                  v-if="!(btn.isHide && btn.isHide(row))"
                  v-show="showBtn(btn, row)"
                  :key="`custom_btn_${idx}`"
                  :type="btn.type"
                  :class="[btn.textWrap && 'text-wrap']"
                  v-bind="btn"
                  @click="handleEvent(btn, row)"
                >
                  {{ row[btn.prop] || columnSlot.defaultValue || btn.text }}
                </el-button>
              </template>
            </template>
          </div>
          <div v-else :key="`column_slot_tpl_else_${slotIdx}`">
            <slot v-if="columnSlot.slotName" :name="columnSlot.slotName" :row="{ ...row }"></slot>
          </div>
        </template>
      </e-table>
      <e-pagination
        :page-info="pagination"
        :page-sizes="pageSizes"
        @paginationEvent="paginationEvent"
      ></e-pagination>
    </el-card>
  </div>
</template>
<script>
import ESearch from '../ESearch'
import ETable from '../ETable'
import EPagination from './pagination'
import _ from 'lodash'

export default {
  components: {
    ESearch,
    ETable,
    EPagination,
  },
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      formData: {},
      formExtraComponent: {},
      formConfig: {
        inline: true,
        labelWidth: '150px',
      },
      formList: [],
      optionsData: {},
      list: [],
      columns: [],
      loading: false,

      importConfig: {},

      pagination: {
        show: true,
        pageNum: 1,
        pageSize: 20,
        total: 0,
      },
      pageSizes: [10, 20, 30, 50],
      columnsSlotList: [],
      cacheSearchForm: {},
    }
  },
  watch: {
    'config.optionsData': {
      handler(val) {
        this.optionsData = {
          ...this.optionsData,
          ...val,
        }
      },
      // immediate: true,
      deep: true,
    },
  },
  mounted() {
    const {
      events: {
        search: {
          immediate,
        },
      },
    } = this.config
    this.init()
    if (immediate) {
      this.search()
    }
  },
  methods: {
    init() {
      const { form, formConfig, formExtraComponent={}, columns, table, optionsData } = this.config
      if (!form) return this.$message.error('搜索表单配置不存在')
      this.formExtraComponent = { ...formExtraComponent }
      this.formList = _.cloneDeep(form).map((item) => _.omit(item, ['defaultValue']))
      this.formConfig = formConfig ?? {
        inline: true,
        labelWidth: '100px',
      }
      this.formData = form.reduce((total, curr) => {
        const prop = curr.prop
        if (!total[prop]) total[prop] = ''
        total[prop] = curr?.defaultValue || ''
        return total
      }, {})

      this.pageSizes = table?.pageSizes ?? [10, 20, 30, 50]
      if (!columns) return this.$message.error('列表表格配置不存在')
      this.columns = columns
      this.columnsSlotList = columns.filter(item => item.slotName)
      this.optionsData = {
        ...this.optionsData,
        ...optionsData,
      }
    },
    async search() {
      const {
        events: {
          search: {
            url,
            method,
            responseListPath,
            responseTotalPath,
            transformResponse,
            mockData, // 是否需要mock数据
            isValideForm,
            request,
          },
        },
      } = this.config
      let isValid = true
      if (isValideForm) {
        // 因为elementUI form.validate 没有callback会执行promise逻辑，（具体可以看element form 源码）
        // valid 为false 时会返回 Promise.reject(valid)， reject 会阻塞await 语句，
        // 所以在try catch 中处理 表单验证不通过逻辑
        try {
          isValid = await this.$refs.searchForm.validate()
        } catch (valid) {
          isValid = valid
        }
      }
      if (!isValid) return
      const requestConfig = {
        url,
        method,
      }
      const searchParams = this.getSearchParams()
      const params = {
        ...searchParams,
        pageNum: this.pagination.pageNum,
        pageSize: this.pagination.pageSize,
      }
      if (!method || method === 'get') {
        requestConfig.params = params
      } else {
        requestConfig.data = params
      }
      this.cacheSearchForm = _.cloneDeep(searchParams)
      if (mockData) {
        this.list = transformResponse ? transformResponse(mockData) : mockData
        return
      }
      this.list = []
      this.loading = true
      request(requestConfig).then(({ code, data }) => {
        if (code === 200) {
          const list = responseListPath ? _.get(data, responseListPath, []) : data
          this.list = transformResponse ? transformResponse(list) : list
          this.pagination.total = responseTotalPath ? _.get(data, responseTotalPath, 0) : data
        }
      }).finally(() => {
        this.loading = false
      })
    },
    addItem() {
      this.$emit('eventHooks', { event: 'add', data: this.formData })
    },

    exportFile() {
      const {
        events: {
          export: { url, method, type, downloadFile },
        },
      } = this.config
      const params = this.getSearchParams()
      downloadFile && downloadFile(params, url, type, method)
    },
    reset() {
      this.$refs.searchForm.resetFields()
      this.initSearch()
    },
    initSearch() {
      this.pagination.pageNum = 1
      this.search()
    },
    getSearchParams() {
      const {
        events: {
          search: {
            transformRequset,
          },
        },
      } = this.config
      const temp = transformRequset ? transformRequset(this.formData) : this.formData
      return temp
    },
    paginationEvent(pageInfo) {
      const { pageNum, pageSize } = pageInfo
      this.pagination.pageNum = pageNum || this.pagination.pageNum
      this.pagination.pageSize = pageSize || this.pagination.pageSize
      this.search()
    },
    handleEvent(btn, row = {}) {
      if (!btn.events) return this.$message.error(`自定义表格列 ${btn.text} 没有配置 events `)
      const eventData = { event: btn.events, btn, data: row }
      if (btn.needFormData) {
        eventData.formData = this.cacheSearchForm
      }
      this.$emit('eventHooks', eventData)
    },
    clearSelection() {
      this.$nextTick(function () {
        this.$refs.costomTable.clearSelection()
      })
    },
    showBtn(btn, row) {
      let isShow = true
      if (btn.isShow) {
        isShow = btn.isShow(row)
      }
      return isShow
    },
  },
}
</script>
<style lang="less" scoped>
  .table-container{
    margin-top: 20px;
  }
  .text-wrap {
    text-align: left;
    word-break: break-all;
    white-space: pre-line;
  }
</style>
