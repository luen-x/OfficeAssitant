<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		:title="datas.prop_name"
		width="400"
		class="v-sale-property-mine-property-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div v-if="first" class="_text g-fs-14">{{ first }}</div>
		<div v-if="second" class="_text g-fs-14">{{ second }}</div>
		<div v-if="third" class="_text" style="color: #F21E1E;">{{ third }}</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "v-sale-property-center-detail-modal",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
	},
	props: {
		datas: {
			type: Object,
			default: () => {}
		},
		number: {
			type: String,
			default: '0'
		},
	},
	data() {
		return {
			visible: false,
			first: '',
			second: '',
			third: '',
			toPath: '', // 跳转路由
		};
	},
	computed: {
		customerType() {
			return this.datas.type_id == 2 ? '普通' : '重要';
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		async loadData() {
			if (this.datas.type_id == 1) {
				this.first = `您的“今日领取公海资料”名额还剩${this.number}个。`;
				this.second = `当您的“今日领公海资料”的名额为0时，如果继续领取公海资料，将触发使用该道具。`;
				this.third = `是否确定转跳去“公海资料”库里领资料？`;
				this.toPath = `/sale/sea/archive`;
			} else if (this.datas.type_id == 2 || this.datas.type_id == 3) {
				this.first = `当前您的${this.customerType}客户名额还剩${this.number}个。`;
				this.second = `当您的“${this.customerType}客户”名额为0时，如果继续升级客户为“${this.customerType}客户”，将触发使用该道具。`;
				this.third = `是否确定转跳去“意向客户”库里升级客户？`;
				this.toPath = `/sale/customer/intention`;
			} else if (this.datas.type_id == 6) {
				this.first = `保护的普通及以上的客户中，低于30天保护期的客户有${this.number}个。限每个客户资料使用1张延长盾牌。`;
				this.second = `是否确定跳转去“意向客户”库里延长客户保护期？`;
				this.toPath = `/sale/customer/intention`;
			} else {
				this.first = `当您在“添加资料”资料过程中，搜索的资料已被别人领取时，可触发使用该道具。`;
				this.second = `是否确定转跳去“添加资料”页面搜索客户？`;
				this.toPath = `/sale/customer/intention/add`;
			}
		},
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
			this.$router.push({
				path: this.toPath,
				query: {}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const PropertyModal = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-sale-property-mine-property-modal {
		.ivu-modal-body {
			padding: 25px;
		}
    ._text {
			word-break: break-word;
			margin: 0 0 15px 15px;
		}
}
</style>

