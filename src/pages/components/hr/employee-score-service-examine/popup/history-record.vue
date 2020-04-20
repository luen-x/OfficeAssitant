<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="评定"
		width="400"
		class-name="v-hr-employee-score-service-examine-history-record"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div
			class="g-m-t-30 g-m-b-20 g-flex g-jc-sb"
			style="cursor:pointer;"
			@click="handleToggle('sc_expand')"
		>
			<div>
				<i
					:class=" sale_expand ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-m-l-5 g-fs-12"
				/>
				<span class="g-fs-14">
					立客户提交{{ sc.length }}条
				</span>
			</div>
		</div>
		<vc-expand ref="sc_expand" v-model="sale_expand">
			<div v-for="(item,index) in sc" :key="index" class="g-m-l-20" >
				<div class="_item">
					<label >评定时间：</label><span>{{ item.service_audit_time }}</span>
				</div>
				<div class="_item">
					<label >回款金额：</label><span>{{ item.return_amount }}</span>
				</div>
				<div class="_item">
					<label >代理人数：</label><span>{{ item.agent_num }}</span>
				</div>
				<div class="_item">
					<label >立客户备注：</label>
					<oa-auto-tooltip
						:content="item.remarks"
						:force-show="true"
						style="width:160px"
						width="160px"
						theme="dark"
						placement="bottom"
						label-class="g-pointer"
					/>
				</div>
				<div class="_item">
					<label>评定结果：</label>
					<span v-if="item.service_status==4">{{ item.point }}分</span>
					<span v-else>{{ service_status[item.service_status] }}</span>
				</div>
				<div v-if="item.service_status==3" class=" _item g-flex">
					<label >驳回原因：</label>
					<oa-auto-tooltip
						:content="item.service_audit_mark"
						:force-show="true"
						style="width:160px"
						width="160px"
						theme="dark"
						placement="bottom"
						label-class="g-pointer"
					/>
				</div>
			</div>
		</vc-expand>
		<div
			class="g-m-t-30 g-m-b-20 g-flex g-jc-sb"
			style="cursor:pointer;"
			@click="handleToggle('sale_expand')"
		>
			<div>
				<i
					:class=" sc_expand ? 'icon-triangle-up' : 'icon-triangle-down'"
					class="iconfont g-m-l-5 g-fs-12"
				/>
				<span class="g-fs-14">
					销售提交{{ sale.length }}条
					<!-- {{ name }} -->
				</span>
			</div>
		</div>
		<vc-expand ref="sale_expand" v-model="sc_expand">
			<div v-for="(item,index) in sale" :key="index" class="g-m-l-20">
				<div class="_item">
					<label >评定时间：</label><span>{{ item.service_audit_time }}</span>
				</div>
				<div class="_item">
					<label >回款金额：</label><span>{{ item.return_amount }}</span>
				</div>
				<div class="_item">
					<label >代理人数：</label><span>{{ item.agent_num }}</span>
				</div>
				<div class="g-m-t-20 g-m-l-30 g-flex">
					<span class="g-inline-block">服务凭证：</span>
					<oa-imgae-preview :data-source="[]&&item.fileImage.map(ele => ({url: ele.img_url}))"/>
				</div>
				<div class="_item">
					<label>销售备注：</label><span>{{ item.remarks }}</span>
				</div>
				<div class="_item">
					<label>评定结果：</label>
					<span v-if="item.service_status==4">{{ item.point }}分</span>
					<span v-else>{{ service_status[item.service_status] }}</span>
				</div>
				<div v-if="item.service_status==3" class=" _item g-flex">
					<label >驳回原因：</label>
					<oa-auto-tooltip
						:content="item.service_audit_mark"
						style="width:160px"
						width="160px"
						theme="dark"
						placement="bottom"
						label-class="g-pointer"
					/>
				</div>
			</div>
		</vc-expand>
	</i-modal>
</template>
<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal, Expand } from 'wya-vc';
import ImagePreview from '@components/hr/_common/image-preview';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { dataValidity, objRegex } from '@utils/utils';

export default {
	name: "oa-sale-",
	components: {
		'vc-expand': Expand,
		'oa-auto-tooltip': AutoToolTip,
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'oa-imgae-preview': ImagePreview
	},
	props: {
		data: Object, // customer_id
		sale: Array,
		sc: Array,
	},
	data() {
		return {
			service_status: ['', '待审核', '通过', '驳回', '已评分', '未评'],
			visible: false,
			sale_expand: false,
			sc_expand: false,
			formData: {
				prop: ''
			},
			rules: {
				prop: []
			}
		};
	},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleToggle(value) {
			this.$refs[value].toggle();
		},
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave() {
			this.visible = false;
			this.$emit('sure');
		}
	}
};
export const HistoryRecord = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
	.v-hr-employee-score-service-examine-history-record{
		._item{
			margin-top:20px ;
			display: flex;
			label{
				width: 100px;
				text-align: right;
			}
		}
	}
</style>