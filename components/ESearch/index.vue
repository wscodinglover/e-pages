<template>
  <div class="form-wraper">
    <el-form
      ref="form"
      :model="formData"
      v-bind="{ ...formConfig, ...$attrs }"
      v-on="$listeners"
    >
      <template v-for="(item, idx) in formList">
        <el-form-item
          v-if="!item.isHidden"
          :key="`form_item_${idx}`"
          v-bind="{
            ...item,
          }"
        >
          <el-radio-group v-if="item.formType === 'el-radio-group'" v-model="formData[item.prop]">
            <el-radio
              v-for="(option, optIdx) in getOptions(item.options)"
              :key="`radio_item_${optIdx}`"
              v-bind="{
                ...item,
                ...option,
                ...adaptor(option, item.adaptor)
              }"
              :label="option.value"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
          <slot v-else-if="item.slotName" :name="item.slotName" :config="{ ...item }"></slot>
          <component
            :is="`${item.formType}`"
            v-else
            v-model="formData[item.prop]"
            v-bind="{
              clearable: true,
              ...item,
              ...$attrs
            }"
            v-on="{ ...item.event, ...$listeners }"
          >
            <template v-if="item.formType === 'el-select'">
              <el-option v-if="item.showAllOpt" :value="item.allOptionValue || ''" label="全部"></el-option>
              <el-option
                v-for="(option, optIdx) in getOptions(item.options)"
                :key="`select_item_${optIdx}`"
                v-bind="{
                  ...option,
                  ...adaptor(option, item.adaptor)
                }"
              ></el-option>
            </template>
            <template v-else-if="item.formType === 'el-checkbox-group'">
              <el-checkbox
                v-for="(option, optIdx) in getOptions(item.options)"
                :key="`checkbox_item_${optIdx}`"
                v-bind="{
                  ...option,
                  ...adaptor(option, item.adaptor)
                }"
                :name="item.prop"
                :label="option.value"
              >
                {{ option.label }}
              </el-checkbox>

            </template>
          </component>
        </el-form-item>
      </template>
      <div class="btn-item">
        <slot></slot>
      </div>
    </el-form>
  </div>
</template>

<script>
import EDateRange from '../EDateRange'

export default {
  name: 'ESearch',
  components: {
    EDateRange
  },
  inheritAttrs: false,
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    formConfig: {
      type: Object,
      default: () => ({
        labelWidth: '100px',
        inline: true,
      }),
    },
    formList: {
      type: Array,
      default: () => ([]),
    },
    optionsData: {
      type: Object,
      default: () => ({}),
    },
    formExtraComponent: {
      type: Object,
      default: () => ({}),
    },

  },
  data() {
    return {}
  },
  computed: {
    getOptions() {
      return (options) => (Array.isArray(options) ? options : this.optionsData[options])
    },
  },
  methods: {
    adaptor(option, adaptor) {
      if (!adaptor) return {}
      return {
        label: option[adaptor.label] ?? option.label,
        value: option[adaptor.value] ?? option.value,
      }
    },
    validate(cb) {
      return this.$refs.form.validate(cb)
    },
    validateField(prop, cb) {
      return this.$refs.form.validateField(prop, cb)
    },
    resetFields() {
      this.$refs.form.resetFields()
    },
  },
}
</script>

<style scoped>
.btn-item {
  float: right;
}
.form-wraper {
  overflow: hidden;
}
</style>
