<template>
  <div class="pagination">
    <el-row type="flex" justify="end">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper, slot"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
        <span v-if="showTips" style="color: red;padding-left:10px;">*由于数据量过大，当前限制最多可查询至第100页</span>
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'EPagination',
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 20,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
    showTips: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
  },
}
</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>
