<template>
  <div>
    <e-pagination
      v-if="pageInfo.show && pageInfo.total > 0"
      :total="pageInfo.total"
      :current-page="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      :page-sizes="pageSizes"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
    ></e-pagination>
  </div>
</template>
<script>
import EPagination from '../EPagination'
export default {
  components: { EPagination },
  props: {
    pageInfo: {
      type: Object,
      default: () => ({
        show: true,
        total: 0,
        pageNum: 1,
        pageSize: 20,
      }),
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 30, 50],
    },
  },

  methods: {
    handleCurrentChange(pageNum) {
      this.$emit('paginationEvent', {
        pageNum,
      })
    },
    handleSizeChange(pageSize) {
      this.$emit('paginationEvent', {
        pageNum: 1,
        pageSize,
      })
    },
  },

}
</script>
