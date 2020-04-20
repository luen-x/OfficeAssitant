<template>
	<div class="v-content-edit-detail">
		<i-form :label-width="120">
			<i-form-item label="活动分类：">
				<i-input
					:disabled="true"
					:value="data.category_name"
					style="width: 320px;"
				/>
			</i-form-item>
			<i-form-item label="活动名称：">
				<i-input
					v-model="data.activity_name"
					:disabled="true"
					style="width: 320px"
				/>
			</i-form-item>
			<i-form-item label="报名时间：">
				<i-input
					:value="`${data.apply_start_time}至${data.apply_end_time}`"
					:disabled="true"
					style="width: 320px;"
				/>
			</i-form-item>
			<i-form-item label="活动时间：">
				<i-input
					:value="`${data.start_time}至${data.end_time}`"
					:disabled="true"
					style="width: 320px"
				/>
			</i-form-item>
			<i-form-item label="是否上传凭证：">
				<i-input
					:value="+ data.has_voucher ? '是' : '否'"
					:disabled="true"
					style="width: 320px;"
				/>
			</i-form-item>
			<i-form-item label="显示报名人数：">
				<i-input
					:value="+ data.show_apply_num ? '是' : '否' "
					:disabled="true"
					style="width: 320px"
				/>
			</i-form-item>
			<i-form-item label="填写复训次数：">
				<i-input
					:value="+ data.write_retrain_num ? '填写' : '不填写'"
					:disabled="true"
					style="width: 320px;"
				/>
			</i-form-item>
			<i-form-item label="填写是否听完：">
				<i-input
					:value="+ data.write_listen_finish ? '填写' : '不填写'"
					:disabled="true"
					style="width: 320px"
				/>
			</i-form-item>
			<i-form-item label="填写合作类别：">
				<i-input
					:value="+ data.write_category ? '填写' : '不填写'"
					:disabled="true"
					style="width: 320px;"
				/>
			</i-form-item>
			<i-form-item label="每家报名限制人数：">
				<i-input
					v-model="data.apply_limit"
					:disabled="true"
					style="width: 320px"
				/>
			</i-form-item>
			<i-form-item label="可多报名人数：">
				<i-input
					v-model="data.extra_apply"
					:disabled="true"
					style="width: 320px;"
				/>
			</i-form-item>
			<i-form-item label="可报客户类型：">
				<i-input
					v-model="data.customer_type_name"
					:disabled="true"
					style="width: 320px"
				/>
			</i-form-item>
			<i-form-item label="活动地址：" class="g-relative">
				<oa-limit-words
					ref="input"
					:max="50"
					v-model="newAddress"
					placeholder="请输入活动地址"
				/>
			</i-form-item>
			<i-form-item label="活动说明：" class="g-relative">
				<oa-limit-words
					ref="input"
					:max="500"
					:autosize="{ minRows: 4, maxRows: 6 }"
					v-model="newDescribe"
					width="320px"
					placeholder="请输入活动说明"
				/>
			</i-form-item>
		</i-form>
	</div>
</template>

<script>
import { Form, FormItem, Input } from 'iview';

export default {
	components: {
		'i-form': Form,
		'i-form-item': FormItem,
		'i-input': Input
	},
	props: {
		data: {
			require: true,
			type: Object,
		}
	},
	data() {
		return {
			newAddress: '',
			newDescribe: '',
		};
	},
	created() {
		this.newAddress = this.data.address;
		this.newDescribe = this.data.describe;
	},
};
</script>

<style lang="scss">
.v-content-edit-detail {
  padding: 20px 0 0 10px;
  .ivu-form-item {
    display: inline-block;
  }
  textarea {
    // resize: none;
    height: 80px;
  }
}
</style>