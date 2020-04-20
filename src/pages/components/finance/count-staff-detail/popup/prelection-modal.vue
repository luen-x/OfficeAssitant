<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="600"
		:mask-closable="false"
		:loading="true"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div
			slot="header"
			class="g-tc"
		>修改业绩</div>
		<div v-if="loadDataStatus==1" class="v-finance-collage-detail-performance-modal">
			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="180"
			>
				<div class="g-flex">
					<div class="_title">实付金额：</div>
					<div class="_content">{{ formValidate.pay_amount }}</div>
				</div>
				<div
					v-for="(item,index) in formValidate.percents"
					:key="index"
				>
					<i-form-item
						:label="`${item.label}：`"
						:prop="'percents.' + index + '.value'"
						:rules="ruleValidate.value"
					>
						<i-input-number
							:min="item.is_invite==1?0:1"
							v-model="item.value"
							style="width: 220px"
						/>
						<span
							v-if="item.is_invite !=1"
							style="display:inline-block;marginLeft:20px;width:60px;marginTop:4px"
						>
							<i
								class="iconfont icon-remove-circle g-fs-18 g-c-pink-mid"
								@click="handleRemovePercents(index)"
							/>
						</span>
					</i-form-item>
				</div>
				<i-form-item
					v-if="formValidate.percents.length<8"
					label="分单对象："
					prop="city"
				>
					<i
						class="iconfont icon-add1 g-fs-18 g-c-blue-mid"
						@click="handlePerformanceModal"
					/>
				</i-form-item>
				<i-form-item
					label="业绩归属月份："
					prop="actual_month"
				>
					<i-date-picker
						v-model="formValidate.actual_month"
						style="width: 220px"
						type="month"
						transfer
						placeholder="请选择月份"
						class="g-m-r-5"
					/>
				</i-form-item>
				<i-form-item
					:rules="ruleValidate.is_sync"
					label="同步成本比例："
					prop="is_sync"
				>
					<i-radio-group
						v-model="formValidate.is_sync"
						style="width: 220px;"
					>
						<i-radio label="1">是</i-radio>
						<i-radio label="2">否</i-radio>
					</i-radio-group>
				</i-form-item>
				<i-form-item
					:rules="ruleValidate.remarks"
					label="修改原因："
					prop="remarks"
				>
					<oa-limit-words
						v-model="formValidate.remarks"
						:max="200"
						style="width: 220px"
						placeholder="请输入修改原因"
					/>
				</i-form-item>
			</i-form>
		</div>
		<div v-else class="g-flex g-flex-ac g-flex-cc g-m-t-20">
			<div>
				{{ errMsg }}
			</div>
		</div>
	</i-modal>
</template>

<script>
import {
	Form,
	FormItem,
	Modal,
	InputNumber,
	DatePicker,
	Radio,
	RadioGroup
} from "iview";
import { CreatePortal } from "wya-vc";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from "@stores/apis/root";
import LimitWords from "@components/_common/limit-words/limit-words";
import { staffByMutiTermNew } from "@stores/services/hr";
import moment from "moment";
import { PerformanceModal } from "./performance-modal";

export default {
	name: "v-finance-collage-detail-prelection-modal",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input-number": InputNumber,
		"i-date-picker": DatePicker,
		"oa-limit-words": LimitWords,
		"i-radio-group": RadioGroup,
		"i-radio": Radio
	},
	mixins: [staffByMutiTermNew],
	props: {
		staff_id: Number,
		payment_id: Number
	},
	data() {
		return {
			visible: false,
			loadDataStatus: 1,
			errMsg: '',
			formValidate: {
				pay_amount: '',
				actual_month: "",
				is_sync: "2",
				remarks: "",
				percents: [],
				external_percents: null,
			},
			ruleValidate: {
				remarks: [
					{ required: true, message: "修改原因为必填", trigger: "blur" }
				],
				value: [
					{ required: true, type: 'number', message: "金额为必填", trigger: "blur" }
				],
				external_percents: [
					{ required: true, type: 'number', message: "金额为必填", trigger: "blur" }
				],
				is_sync: [
					{ required: true, message: '是否显示不能为空', trigger: 'blur' }
				],
				actual_month: [
					{
						required: true,
						pattern: /.+/,
						message: "业绩归属月份为必选",
						trigger: "change"
					}
				],
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		handleOk() {
			this.$refs["formValidate"].validate(valid => {
				if (valid) {
					let sum = 0;
					let external_percents_index = -1;
					let newPercentsArr = [];
					this.formValidate.percents.forEach((item, index) => {
						sum += item.value;
						if (item.label == "外部合作") {
							this.formValidate.external_percents = item.value;
							external_percents_index = index;
						}
					});
					if (sum - this.formValidate.pay_amount != 0) {
						this.$Message.error("填写金额与实付金额不相等");
						this.$refs.modal.buttonLoading = false;
						return;
					}
					if (external_percents_index >= 0) {
						newPercentsArr = [...this.formValidate.percents];
						newPercentsArr.splice(external_percents_index, 1);
					} else {
						this.formValidate.external_percents = 0;
						newPercentsArr = [...this.formValidate.percents];
					}
					// this.$emit("sure");
					this.$request({
						url: API_ROOT._FINANCE_EDIT_PERFORMANCE_EDIT_POST,
						type: "POST",
						param: {
							payment_id: this.payment_id,
							...this.formValidate,
							actual_month: moment(this.formValidate.actual_month).format("YYYY-MM"),
							percents: newPercentsArr,
							remarks: this.formValidate.remarks,
							is_sync: this.formValidate.is_sync
						},
						loading: false
					}).then(res => {
						this.visible = false;
						this.$Message.success(res.msg);
						this.$emit("sure");
					}).catch(err => {
						this.$Message.error(err.msg);
						this.$refs.modal.buttonLoading = false;
					});
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},
		handleCancel() {
			this.$emit("close");
		},
		loadData() {
			this.$request({
				url: API_ROOT._FINANCE_EDIT_PERFORMANCE_INFO_GET,
				type: "GET",
				param: {
					payment_id: this.payment_id
				},
				loading: false
			}).then(res => {
				this.loadDataStatus = res.status;
				this.formValidate = res.data;
				if (res.data.external_percents != undefined) {
					res.data.percents.push({
						label: "外部合作",
						type: 'external',
						value: res.data.external_percents,
					});
				}
				this.formValidate.percents = res.data.percents.length ? res.data.percents : [];
				this.formValidate.is_sync = '2';
			}).catch(err => {
				this.loadDataStatus = err.status;
				this.errMsg = err.msg;
				// this.$Message.error(err.msg);
			});
		},
		handlePerformanceModal() {
			let tempInvite = {};
			let propsStaffs = [];
			let propsBSDepart = [];
			let propsExternal = 0;
			this.formValidate.percents.forEach((item, index) => {
				// 备份邀约人数据并且把邀约人从数组中删除，之后传递给弹窗
				if (item.is_invite === 1) {
					tempInvite = item;
				}
				if (
					(item.type == "inner" && item.is_invite == 0) || (item.is_invite == 0 && item.type == "outer")
				) {
					propsStaffs.push(item);
				}
				if (item.type === "depart") {
					propsBSDepart.push(item);
				}
				if (item.type === "external") {
					if (item.value) {
						propsExternal = item.value;
					}
				}
			});
			PerformanceModal.popup({
				propsStaffs,
				propsBSDepart,
				propsexternal_percents: propsExternal
			}).then(res => {
				res.unshift(tempInvite);
				res.map((item, index) => {
					return this.formValidate.percents.forEach(i => {
						if (item.id == i.id) {
							if (item.type !== "external") {
								item.value = i.value;
							}
						}
					});
				});
				this.formValidate.percents = res;
			});
		},
		// 移除
		handleRemovePercents(index) {
			this.formValidate.percents.splice(index, 1);
		}
	}
};
export const PrelectionModal = CreatePortal(
	{ store: app.$store },
	module.exports.default
);
</script>

<style lang="scss">
.v-finance-collage-detail-performance-modal {
  padding: 20px;
  ._title {
    width: 180px;
    text-align: right;
    padding: 10px 10px 30px 0;
  }
  ._content {
    padding: 10px 30px 0px 4px;
  }
}
</style>


