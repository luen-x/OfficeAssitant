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
		>添加分单信息</div>
		<div class="v-finance-collage-detail-performance-modal">

			<i-form
				ref="formValidate"
				:model="formValidate"
				:rules="ruleValidate"
				:label-width="80"
			>
				<i-form-item
					label="分单方式"
					prop="gender"
				>
					<i-radio-group v-model="gender">
						<i-radio label="personBill">个人分单</i-radio>
						<i-radio label="departBill">部门分单</i-radio>
						<i-radio
							label="outBill"
							style="marginLeft:50px"
						>外部合作</i-radio>
					</i-radio-group>
				</i-form-item>
				<div v-show="gender=='personBill'">
					<i-form-item
						label="分单人"
						prop="city"
					>
						<i-select
							v-model="formValidate.staffs"
							:remote-method="loadStaffData"
							:loading="staffLoading"
							:placeholder="'请输入姓名'"
							style="width: 400px"
							filterable
							remote
							clearable
							multiple
							transfer
						>
							<i-option
								v-for="(item, index) in staffData"
								:key="index"
								:value="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</div>
				<div v-show="gender=='departBill'">
					<i-form-item
						label="分单部门"
						prop="city"
					>
						<i-select
							v-model="formValidate.BSDepart"
							style="width: 400px"
							multiple
						>
							<i-option
								v-for="item in BSDepartList"
								:value="item.value"
								:key="item.value"
							>{{ item.label }}</i-option>
						</i-select>
					</i-form-item>
				</div>
				<div v-show="gender=='outBill'">
					<i-form-item
						label="分单金额"
						prop="city"
					>
						<i-input-number
							:min="1"
							v-model="formValidate.external_percents"
							style="width: 400px"
						/>
					</i-form-item>
				</div>
			</i-form>
		</div>
	</i-modal>
</template>

<script>
import {
	Form,
	FormItem,
	Modal,
	Radio,
	RadioGroup,
	Row,
	Col,
	Select,
	Option,
	InputNumber
} from "iview";
import { CreatePortal } from "wya-vc";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from "@stores/apis/root";
import { initTreeData } from "@utils/utils";

export default {
	name: "v-finance-collage-detail-performance-modal",
	components: {
		"i-modal": Modal,
		"i-radio": Radio,
		"i-radio-group": RadioGroup,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-select": Select,
		"i-option": Option,
		"i-input-number": InputNumber
	},
	props: {
		propsStaffs: Array,
		propsBSDepart: Array,
		propsexternal_percents: Number
	},
	data() {
		let propsStaffsArr = [];
		let propsBSDepartArr = [];
		[...this.propsStaffs].forEach(item => {
			propsStaffsArr.push(Number(item.id));
		});
		[...this.propsBSDepart].forEach(item => {
			propsBSDepartArr.push(Number(item.id));
		});
		return {
			staffLoading: false,
			staffData: [], // 符合远程搜索条件的商学院和营销中心的员工
			allStaffList: [], // 所有商学院和营销中心的员工
			BSDepartList: [], // 商学院的部门
			visible: false,
			gender: "personBill", // 默认展示分单人的选项
			formValidate: {
				staffs: propsStaffsArr, // 选择的分单人数据
				BSDepart: propsBSDepartArr, // 选择的商学院部门数据
				external_percents: this.propsexternal_percents // 外部合作金额
			},
			ruleValidate: {
			}
		};
	},
	mounted() {
		this.visible = true;
		this.loadAllStaffData();
		this.loadBSDepart();
	},
	methods: {
		handleOk() {
			let innerCount = 0; // 统计营销中心的人数
			let outerCount = 0; // 统计营销中心之外的人数
			if (this.formValidate.staffs.length) {
				this.formValidate.staffs.forEach((item, index) => {
					this.allStaffList.forEach(i => {
						if (item.id) {
							if (item.id == i.staff_id) {
								if (i.type === "inner") {
									innerCount++;
								}
								if (i.type === "outer") {
									outerCount++;
								}
							}
						} else if (item == i.staff_id) {
							if (i.type === "inner") {
								innerCount++;
							}
							if (i.type === "outer") {
								outerCount++;
							}
							this.formValidate.staffs[index] = {
								depart_id: i.depart_id,
								id: i.staff_id,
								label: i.staff_name,
								value: null,
								is_invite: 0,
								type: i.type
							};
						}
					});
				});
			}
			if (innerCount > 2) {
				this.$Message.error("只能选择两位营销中心的员工");
				this.$refs.modal.buttonLoading = false;
				return false;
			}
			if (outerCount > 2) {
				this.$Message.error("只能选择两位营销中心之外的员工");
				this.$refs.modal.buttonLoading = false;
				return false;
			}
			if (this.formValidate.BSDepart.length) {
				if (this.formValidate.BSDepart.length > 2) {
					this.$Message.error("只能选择两个部门分单");
					this.$refs.modal.buttonLoading = false;
					return false;
				}
				this.formValidate.BSDepart.forEach((item, index) => {
					this.BSDepartList.forEach(i => {
						if (item == i.value) {
							this.formValidate.BSDepart[index] = {
								id: i.value,
								label: i.label,
								value: null,
								is_invite: 0,
								type: "depart"
							};
						}
					});
				});
			}
			const selectArr = [
				...this.formValidate.staffs,
				...this.formValidate.BSDepart
			];
			if (this.formValidate.external_percents > 0) {
				selectArr.push({
					value: this.formValidate.external_percents,
					type: 'external',
					label: "外部合作"
				});
				selectArr[selectArr.length - 1].value = this.formValidate.external_percents;
			}
			this.$emit("sure", selectArr);
		},
		handleCancel() {
			this.$emit("close");
		},
		// 获取所有商学院和营销中心员工
		loadAllStaffData() {
			this.$request({
				url: API_ROOT._SALE_PAYMENT_STAFF_LIST_GET,
				type: "GET",
				param: {
					is_page: 0,
					type: 1
				},
				loading: false
			})
				.then(res => {
					this.allStaffList = res.data.list;
					this.staffData = initTreeData(
						res.data.list,
						"staff_id",
						"staff_name"
					);
				})
				.catch(error => {});
		},
		// 远程搜索 商学院和营销中心员工
		loadStaffData(query) {
			if (query !== "") {
				this.staffLoading = true;
				this.$request({
					url: API_ROOT._SALE_PAYMENT_STAFF_LIST_GET,
					type: "GET",
					param: {
						is_page: 0,
						type: 1,
						search: query && query.trim().replace(/\(.*?\)/g, "").replace(/（.*?）/g, "")
					},
					loading: false
				})
					.then(res => {
						this.staffLoading = false;
						this.staffData = initTreeData(
							res.data.list,
							"staff_id",
							"staff_name"
						);
					})
					.catch(error => {
						this.staffLoading = false;
					});
			}
		},
		// 获取 商学院部门
		loadBSDepart() {
			this.$request({
				url: API_ROOT._FINANCE_GET_BS_TWO_DEPART_GET,
				type: "GET",
				param: {},
				loading: false
			})
				.then(res => {
					this.BSDepartList = initTreeData(
						res.data,
						"depart_id",
						"depart_name"
					);
				})
				.catch(error => {});
		}
	}
};
export const PerformanceModal = CreatePortal(
	{ store: app.$store },
	module.exports.default
);
</script>

<style lang="scss">
.v-finance-collage-detail-performance-modal {
  padding: 20px;
}
</style>


