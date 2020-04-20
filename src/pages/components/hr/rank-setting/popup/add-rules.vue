<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:mask-closable="false"
			class="c-add-rules-modal"
			@on-ok="handleOk"
		>
			<div slot="header" class="g-tc">
				新增规则
			</div>
			<i-checkbox-group v-model="rule_type" class="g-flex g-fd-c g-pd-lr-15 g-pd-tb-10" >
				<i-checkbox
					v-for="(item) in rules" 
					:key="item.value"
					:label="item.value" 
					:disabled="disabled.indexOf(item.value) > -1"
					class="g-m-b-10"
				>
					<span class="g-c-black1  g-fs-14">
						&nbsp;{{ item.name }}
						<span class="g-c-black4">({{ item.extra }})</span>
					</span>
				</i-checkbox>
			</i-checkbox-group>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Checkbox, CheckboxGroup } from 'iview';
import { CreatePortal } from 'wya-vc';
import { debounce } from 'lodash';

export default {
	name: 'hr-rank-delete-tip-modal',
	components: {
		'i-modal': Modal,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
	},
	props: {
		type: String,
		info: Object,
		ranksArr: Array,
		disabled: {
			type: Array,
			default: () => ([])
		}
	},
	data() {
		return {
			visible: false,
			rule_type: [],
			rules: [
				{
					value: '1',
					name: '称号类级称条件项',
					extra: '某称号类级称体系的某个级称达到规定次数'
				},
				{
					value: '2',
					name: '晋级类级称条件项',
					extra: '某晋级类级称体系内达到规定级称'
				},
				{
					value: '3',
					name: '累计业绩条件项',
					extra: '累计N个月内的业绩达到规定额'
				},
				{
					value: '4',
					name: '最低业绩条件项',
					extra: '累计N个月内的每月最低业绩要达到规定额'
				},
				{
					value: '5',
					name: '工龄条件项',
					extra: '当前工龄要求，精确到月'
				},
				{
					value: '6',
					name: '素材上传条件项',
					extra: '规定时间段内累计素材上传数量达到规定要求'
				},
				{
					value: '7',
					name: '标杆案例条件项',
					extra: '规定时间段内累计服务的客户达到标案案例数量达到要求'
				},
				{
					value: '8',
					name: '评分数量条件项',
					extra: '规定时间段内客户评分的规定分值数量要求'
				},
				{
					value: '9',
					name: '评分比例条件项',
					extra: '规定时间段内客户评分的规定分值占比要求'
				},
				{
					value: '10',
					name: '投诉量条件项',
					extra: '规定时间段内客户投诉数量要求'
				},
				{
					value: '11',
					name: '所在部门业绩条件项',
					extra: '规定时间段内所在部门每月最低业绩达到规定额'
				},
				{
					value: '12',
					name: '所在部门平均业绩条件项',
					extra: '规定时间段内所在部门平均每人每月最低业绩达到规定额'
				}
			]
		};
	},
	computed: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure', this.rule_type);
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const AddRulesModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.c-add-rules-modal {
	.ivu-modal-wrap .ivu-modal {
		width: 680px !important;
	}
	.ivu-form-item-label {
		color: #333333;
	}
	._content {
		padding: 0;
		color: #333333;
		font-size: 14px;
	}
}
</style>