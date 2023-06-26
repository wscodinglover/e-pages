<template>
  <el-date-picker
    :picker-options="{
      onPick: ({ maxDate, minDate }) => onPick({ maxDate, minDate }, $attrs.prop),
      disabledDate: (time) => disabledDate(time, $attrs.maxLimit, $attrs.prop, $attrs.minDate),
    }"
    v-bind="{
      type: 'datetimerange',
      'range-separator': '至',
      'start-placeholder': '开始日期',
      'end-placeholder': '结束日期',
      ...$attrs
    }"
    v-on="$listeners"
    @change="handlerChange($attrs.prop)"
    @blur="handlerChange($attrs.prop)"
  ></el-date-picker>

</template>

<script>
import dayjs from 'dayjs'

const isDuringDate = (time, beginDateStr, endDateStr) => {
  var curDate = new Date(time)
  var beginDate = new Date(beginDateStr)
  var endDate = new Date(endDateStr)
  if (curDate >= beginDate && curDate <= endDate) {
    return true
  }
  return false
}

export default {
  name: 'EDateRange',
  data() {
    return {
      minPickerDate: {},
    }
  },
  methods: {
    onPick({ minDate }, type) {
      this.minPickerDate[type] = dayjs(minDate).format('YYYY-MM-DD 00:00:00')
    },
    disabledDate(time, maxLimit, type, minDate) {
      const currDateDiff = dayjs().diff(dayjs(time), 'day') > minDate
      if (!this.minPickerDate[type] && minDate) return currDateDiff
      // 只有最小日期限制
      if (!maxLimit && minDate) return currDateDiff
      if (this.minPickerDate[type] && maxLimit) {
        const diff = dayjs(this.minPickerDate[type]).diff(dayjs(), 'day') < maxLimit - minDate
        // 有最小日期 和 日期范围限制
        // 只有当 最小日期存在 且 选择的第一个时间 小于（日期范围限制 - 最小日期）
        if (minDate && diff) {
          const min = dayjs().subtract(minDate, 'day').format('YYYY-MM-DD 00:00:00')
          const max = dayjs(this.minPickerDate[type]).add(maxLimit, 'day').format('YYYY-MM-DD 23:59:59')
          const curr = dayjs(time).format('YYYY-MM-DD HH:mm:ss')
          return !isDuringDate(curr, min, max)
        }
        // 只有日期范围限制
        const flag = Math.abs(dayjs(time).diff(dayjs(this.minPickerDate[type]), 'day')) > maxLimit
        return flag
      }
      return false
    },
    handlerChange(type) {
      this.minPickerDate[type] = ''
    },
  },
}
</script>
