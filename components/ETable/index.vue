<template>
  <div ref="tableContainer" class="instore-table">
    <div v-if="hasBtnGroup" class="header-btn-group">
      <el-popover
        v-if="showFilter"
        placement="right"
        width="300"
        trigger="click"
        class="table-filter"
      >
        <div class="check-all">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-button type="text" @click="initFilter">
            重置
          </el-button>
        </div>
        <el-divider></el-divider>
        <el-checkbox-group v-model="tableColums" class="check-list" @change="handleCheckedChange">
          <el-checkbox v-for="(col, idx) in checkAllList" :key="idx" :label="col">
            {{ col.label }}
          </el-checkbox>
        </el-checkbox-group>

        <i slot="reference" class="el-icon-setting table-icon"></i>
      </el-popover>

      <div><slot name="headerBtn"></slot></div>
    </div>
    <el-table
      ref="elTableContainer"
      :data="list"
      border
      style="width: 100%"
      :loading="loading"
      v-bind="{
        maxHeight: '550',
        ...$attrs
      }"
      v-on="$listeners"
    >
      <el-table-column
        v-for="(col, idx) in tableColums"
        :key="`column_${idx}_${col.label}`"
        v-bind="{
          align: 'center',
          ...col,
        }"
      >
        <template v-if="col.slotName || col.prop" v-slot="{ row }">
          <slot
            v-if="col.slotName"
            :name="col.slotName"
            :row="{ ...row }"
          ></slot>
          <div v-else>
            {{ formatNumber(row[col.prop]) || col.defaultValue }} {{ col.unit }}
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ETable',
  props: {
    list: {
      type: Array,
      default: () => ([]),
    },
    columns: {
      type: Array,
      default: () => ([]),
    },
    showFilter: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    hasBtnGroup: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      hasActions: false,
      checkAll: false,
      tableColums: [],
      checkAllList: [],
      isIndeterminate: false,
    }
  },
  watch: {
    columns: {
      handler() {
        this.tableColums = this.columns
        if (this.showFilter) this.initFilter()
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    initFilter() {
      const temp = this.columns.map((item, idx) => ({ ...item, idx }))
      this.tableColums = temp
      this.checkAllList = temp
      // this.checkAllList = temp.filter(item => !item.type)
      const checkedCount = this.tableColums.length
      this.checkAll = checkedCount === this.columns.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length
    },

    handleCheckAllChange(val) {
      this.tableColums = val ? this.checkAllList : []
      this.isIndeterminate = false
    },
    handleCheckedChange(value) {
      const checkedCount = value.length
      this.checkAll = checkedCount === this.columns.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columns.length
      this.tableColums = this.tableColums.sort((a, b) => a.idx - b.idx)
    },
    clearSelection() {
      this.$nextTick(function () {
        this.$refs.elTableContainer.clearSelection()
      })
    },
    formatNumber(value) {
      if (Object.prototype.toString.call(value) === '[object Number]') {
        return `${value}`
      }
      return value
    },
  },
}
</script>

<style scoped lang="less">
.instore-table {
  .header-btn-group {
    display: flex;
    width: 100%;
    flex-direction: row-reverse;
    align-items: center;
    padding-bottom: 20px;
    .table-filter{
      padding-left: 20px;
    }
  }
  .table-icon {
    font-size: 24px;
  }
}
.check-all{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.check-list{
  display: flex;
  flex-direction: column;
  max-height: 300px;
  overflow-y: auto;
}

</style>
