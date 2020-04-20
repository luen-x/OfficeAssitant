<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="600"
		:mask-closable="false"
		:loading="true"
		class="v-finance-remain"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">更改到账</div>
		<oa-title style="paddingLeft: 12px">
			<template slot="title">到账记录</template>
			<div slot="content">
				<i-checkbox-group v-model="chosen_payments">
					<div 
						v-for="item of data"
						:key="item.payment_id"
					>
						<i-checkbox :label="item.payment_id">到账业绩归属：{{ item.actual_month }}</i-checkbox>
						<div 
							style="background: #f1f1f1; padding: 10px; margin-top: 10px; font-size: 12px"
						>
							<div>
								<div>
									实付金额：
									<i-poptip
										v-if="item.pay_array"
										trigger="hover"
										style="margin-right: 40px"
									>
										<span class="g-operation">{{ item.pay_amount }}</span>
										<div slot="content">
											<p v-for="(data, index) of item.pay_array.inner" :key="index + '1'">
												{{ data.label }}： {{ data.value }}
											</p>
											<p v-for="(data, index) of item.pay_array.outer" :key="index + '2'">
												{{ data.label }}： {{ data.value }}
											</p>
											<p v-for="(data, index) of item.pay_array.depart" :key="index + '3'">
												{{ data.label }}： {{ data.value }}
											</p>
										</div>
									</i-poptip>
									剩余金额：
									<i-poptip
										v-if="item.rest_array"
										trigger="hover"
										style="margin-right: 40px"
									>
										<span class="g-operation">{{ item.rest_amount }}</span>
										<div slot="content">
											<p v-for="(data, index) of item.rest_array.inner" :key="index + '1'">
												{{ data.label }}： {{ data.value }}
											</p>
											<p v-for="(data, index) of item.rest_array.outer" :key="index + '2'">
												{{ data.label }}： {{ data.value }}
											</p>
											<p v-for="(data, index) of item.rest_array.depart" :key="index + '3'">
												{{ data.label }}： {{ data.value }}
											</p>
										</div>
									</i-poptip>
								</div>
								审核时间：<span style="margin-right: 40px">{{ item.audit_time }}</span>
							</div>
							<div class="g-m-t-10">
								<span v-for="(info, index) of item.categories" :key="index">
									{{ info.category_name }}<span style="margin-right: 40px">{{ info.rest_amount }}</span>
								</span>
							</div>
						</div>
					</div>
				</i-checkbox-group>
			</div>
		</oa-title>
		<oa-title class="g-m-t-20" style="paddingLeft: 12px">
			<template slot="title">分单比例方式</template>
			<div slot="content">
				<i-radio-group v-model="share_type" vertical>
					<i-radio :label="1">
						<span>分业绩比例</span>
						<span>分单比例：</span>
						<span v-for="(item, i) of fenArr" :key="item.id">
							<span v-if="i">;</span>
							{{ item.label }}({{ item.percent }})
						</span>
					</i-radio>
					<i-radio :label="2">
						<span>总业绩比例</span>
						<span>分单比例：</span>
						<span v-for="(item, i) of allArr" :key="item.id">
							<span v-if="i">;</span>
							{{ item.label }}({{ item.percent }})
						</span>
					</i-radio>
				</i-radio-group>
			</div>
		</oa-title>
	</i-modal>
</template>

<script>
import { Divider, Modal, Checkbox, CheckboxGroup, RadioGroup, Radio, Poptip } from 'iview';
import { CreatePortal } from 'wya-vc';
import { cloneDeep } from 'lodash';
import API_ROOT from '@stores/apis/root';
import Title from '../title';

export default {
	name: 'finance-remain-modal',
	components: {
		'i-modal': Modal,
		'i-checkbox': Checkbox,
		'i-checkbox-group': CheckboxGroup,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'oa-title': Title,
		'i-poptip': Poptip
	},
	props: {
		contract_id: Number,
		contract_company_id: Number,
		supply_id: Number
	},
	data() {
		return {
			visible: false,
			checked: [],
			data: [],
			share_type: 1,
			radio: 1,
			chosen_payments: [],
			fenArr: [],
			allArr: []
		};
	},
	watch: {
		chosen_payments(val) {
			let copyData = cloneDeep(this.data);
			let arr = val.map(item => copyData.filter(info => info.payment_id === item)[0]);
			let fen = [];
			let all = [];
			let fenSum = 0;
			let allSum = 0;
			arr.forEach(item => {
				const { inner, outer = [], depart = [] } = item.pay_array;
				inner.forEach(info => {
					let isExist = fen.some(mess => mess.id === info.id);
					fenSum += +info.value;
					allSum += +info.value;
					if (isExist) {
						fen.forEach(mess => {
							if (mess.id === info.id) {
								mess.value = +mess.value + (+info.value);
							}
						});
						all.forEach(mess => {
							if (mess.id === info.id) {
								mess.value = +mess.value + (+info.value);
							}
						});
					} else {
						info.value = +info.value;
						fen.push({ ...info });
						all.push({ ...info });
					}
				});
				let mainIndex = all.findIndex(info => info.is_invite === 1);
				const main = all[mainIndex];
				outer.forEach(info => {	
					allSum += (+info.value);
					main.value += (+info.value);
				});
				depart.forEach(info => {
					allSum += (+info.value);
					main.value += (+info.value);
				});
			});
			fen.forEach(item => {
				item.percent = (100 * (+item.value) / fenSum).toFixed(2) + '%';
			});
			all.forEach(item => {
				item.percent = (100 * (+item.value) / allSum).toFixed(2) + '%'; 
			});
			this.fenArr = fen;
			this.allArr = all;
		}
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		},
		loadData() {
			this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CHANGE_PAYMENTS_LIST_GET,
				type: 'GET',
				param: {
					supply_id: this.supply_id,
					contract_company_id: this.contract_company_id,
					contract_id: this.contract_id
				},
				loading: false
			}).then(res => {
				this.data = res.data.list;
				this.share_type = res.data.share_type;
				this.radio = res.data.share_type;
				res.data.list.forEach(item => {
					if (item.is_chosen) {
						this.checked.push(item.payment_id);
						this.chosen_payments.push(item.payment_id);
					}
				});
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
		handleSave() {
			this.$refs['modal'].buttonLoading = false;
			let change;
			if (this.share_type !== this.radio) {
				change = true;
			} else if (this.checked.length !== this.chosen_payments.length) {
				change = true;
			} else {
				change = !this.checked.every(item => this.chosen_payments.some(info => info === item));
			}
			change ? this.$request({
				url: API_ROOT._FINANCE_CUSTOMER_CHANGE_PAYMENTS_GET,
				type: 'GET',
				param: {
					supply_id: this.supply_id,
					contract_id: this.contract_id,
					chosen_payments: this.chosen_payments,
					share_type: this.share_type
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.handleOk();
			}).catch(err => {
				this.$Message.error(err.msg);
			}) : this.handleOk();
		}
	}
};
export const RemainModal = CreatePortal({ store: app.$store }, module.exports.default);

</script>

<style lang="scss">
.v-finance-remain {
	.ivu-radio-wrapper {
		white-space: normal;
	}
	.ivu-radio-group-vertical .ivu-radio-wrapper {
		height: auto;
	}
}
</style>


