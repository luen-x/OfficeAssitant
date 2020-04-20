<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="680"
		:loading="true"
		:mask-closable="false"
		class="v-content-add-service-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			{{ set_id ? "编辑服务项" : "添加服务项" }}
		</div>

		<i-form
			ref="form"
			:label-width="110"
			:model="form"
			:rules="rule"
			class="g-m-t-20"
		>
			<i-form-item label="服务项名称：" prop="service_name">
				<i-input 
					v-model="form.service_name" 
					:maxlength="20" 
					placeholder="请输入服务项名称"
					style="width: 300px;"
					clearable
				/>
			</i-form-item>

			<i-form-item label="服务项类型：" prop="service_type">
				<i-select
					v-model="form.service_type"
					clearable
					transfer
					style="width:300px;"
					placeholder="请选择服务项类型"
				>
					<i-option 
						v-for="(item, index) in service_types" 
						:value="item.value" 
						:key="index"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="是否关联积分：" prop="relation_point">
				<i-radiogroup v-model="form.relation_point">
					<i-radio label="1">
						<span>关联</span>
					</i-radio>
					<i-radio label="0">
						<span>不关联</span>
					</i-radio>
				</i-radiogroup>
			</i-form-item>

			<i-form-item label="适用部门：" prop="depart_type">
				<i-radiogroup 
					v-model="form.depart_type" 
					style="display: block"
					@on-change="handleRadioSelect"
				>
					<i-radio label="1">
						<span>所有</span>
					</i-radio>
					<i-radio label="2">
						<span>个别</span>
					</i-radio>
				</i-radiogroup>
			</i-form-item>

			<div class="_depart">
				<i-form-item v-if="form.depart_type == '2'" label=" " prop="depart_ids">
					<oa-tree-select
						v-model="form.depart_ids"
						:data-source="departAll"
						:label-in-value="true"
						:width="300"
						:max-width="300"
						class="g-m-t-10"
						placeholder="请选择适用部门"
						clearable
					/>
				</i-form-item>
			</div>

			<i-form-item label="适用职位：" prop="">
				<i-select
					v-model="form.position_ids"
					clearable
					transfer
					filterable
					multiple
					style="width:300px;"
					placeholder="请选择适用职位"
				>
					<i-option 
						v-for="(item, index) in role_date" 
						:value="item.position_id" 
						:key="index"
					>
						{{ item.position_name }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="服务项定义：" prop="service_define">
				<i-radiogroup v-model="form.service_define">
					<i-radio :disabled="set_id ? true : false" label="1">
						<span>通用服务项</span>
					</i-radio>
					<i-radio :disabled="set_id ? true : false" label="2">
						<span>专项服务项</span>
					</i-radio>
				</i-radiogroup>
			</i-form-item>

			<div v-if="form.service_define === '2'" class="g-m-b-20 __product">
				<i-form-item label="关联产品：" prop="about_product">
					<i-switch v-model="type_switch" size="default"/>
					<span class="g-m-l-20">仅显示有服务提成的产品</span>

					<div class="g-m-b-10">
						<i-table
							:columns="columns"
							:data="tableData"
							:row-key="true"
							stripe
							border
							class="g-m-t-10"
							@on-selection-change="handleSelect"
							@on-select-cancel="handleSelectCancel"
							@on-select-all-cancel="handleSelectAllCancel"
						/>
					</div>
				</i-form-item>
			</div>

			<i-form-item v-if="form.service_define === '1'" label="是否必做：" prop="must_do">
				<i-radiogroup v-model="form.must_do">
					<i-radio label="1">
						<span>是</span>
					</i-radio>
					<i-radio label="2">
						<span>否</span>
					</i-radio>
				</i-radiogroup>
			</i-form-item>

			<div 
				v-if="(form.service_define === '1' && form.must_do === '1') || form.service_define === '2'"
				class="g-flex" 
			>
				<i-form-item label="参考次数：" prop="reference_period">
					每
					<i-select
						v-model="form.reference_period"
						clearable
						transfer
						style="width:130px;"
						placeholder="请选择时间"
					>
						<i-option 
							v-for="(item, index) in reference_periods" 
							:value="item.value" 
							:key="index"
						>
							{{ item.label }}
						</i-option>
					</i-select>
				</i-form-item>

				<i-form-item 
					label=""
					prop="reference_num"
					class="_count"
				>
					<i-input-number 
						v-model="form.reference_num"
						:min="1"
						:max="99"
						:precision="0"
						placeholder="请输入次数" 
						style="width: 130px;"
						clearable
					/>
					次
				</i-form-item>
			</div>

			<i-form-item 
				v-if="(form.service_define === '1' && form.must_do === '1') || form.service_define === '2'"
				label="服务阶段次数："
				prop="first_time"
			>
				第一阶段
				<i-input-number 
					v-model="form.first_time"
					:min="0"
					:max="99" 
					:precision="0"
					placeholder="请输入次数"
					style="width: 230px;"
					clearable
				/>
				次
			</i-form-item>

			<i-form-item 
				v-if="(form.service_define === '1' && form.must_do === '1') || form.service_define === '2'"
				label=" "
				prop="second_time"
				class="_second"
			>
				第二阶段
				<i-input-number
					v-model="form.second_time"
					:min="0"
					:max="99" 
					:precision="0"
					placeholder="请输入次数"
					style="width: 230px;"
					clearable
				/>
				次
			</i-form-item>

			<i-form-item 
				v-if="(form.service_define === '1' && form.must_do === '1') || form.service_define === '2'"
				label=" "
				prop="third_time"
				class="_third"
			>
				第三阶段
				<i-input-number 
					v-model="form.third_time"
					:min="0" 
					:max="99"
					:precision="0"
					placeholder="请输入次数" 
					style="width: 230px;"
					clearable
				/>
				次
			</i-form-item>

			<i-form-item 
				v-if="(form.service_define === '1' && form.must_do === '1') || form.service_define === '2'"
				label="服务项有效期：" 
				prop="service_validity"
			>
				<i-select
					v-model="form.service_validity"
					clearable
					transfer
					style="width:300px;"
					placeholder="请选择时间"
				>
					<i-option 
						v-for="(item, index) in service_validitys" 
						:value="item.value" 
						:key="index"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</i-form-item>

			<i-form-item label="服务项说明：" prop="service_memo">
				<oa-limit-words
					v-model="form.service_memo"
					:max="500"
					placeholder="请输入标签备注"
					style="width: 520px;"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import {
	Modal, Form, 
	FormItem, RadioGroup, 
	Radio, Input, Select, 
	Option, Switch, Table, 
	InputNumber 
} from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import { services } from '@stores/services/hr';
import treeSelect from "@common/tree-select/tree-select";

export default {
	name: "sc-customer-add-label-modal",

	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-radiogroup": RadioGroup,
		"i-radio": Radio,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-switch": Switch,
		"i-table": Table,
		"oa-tree-select": treeSelect
	},

	mixins: [services.departAll()],

	props: {
		set_id: Number
	},

	data() {
		return {
			visible: false,
			indeterminate: true,
			checkAll: false,
			type_switch: false,
			form: {
				service_name: "", // 服务项名称
				service_type: "", // 服务项类型 
				relation_point: "", // 0不关联 1关联
				service_define: "", // 1通用服务 2专项服务
				service_memo: "", // 服务项说明
				position_ids: [], // 适用职位
				must_do: "", // 通用服务项是否必做 1是 2否
				reference_period: "", // 参考周期（1,3,6,12个月）
				reference_num: null, // 参考次数
				first_time: null, // 服务阶段次数 第一阶段
				second_time: null, // 服务阶段次数 第二阶段
				third_time: null, // 服务阶段次数 第三阶段
				service_validity: "", // 服务项有效期
				about_product: [],
				depart_type: "1", // 1所有 2个别
				depart_ids: [] // 适用部门
			},
			rule: {
				service_name: [
					{
						required: true,
						message: "服务项名称是必填的！",
						trigger: "blur"
					}
				],
				service_type: [
					{
						required: true,
						message: "请选择服务项类型！",
						trigger: "change"
					}
				],
				relation_point: [
					{
						required: true,
						message: "请选择是否关联积分！",
						trigger: "change"
					}
				],
				depart_type: [{ 
					required: true, 
					message: "请选择适用部门", 
					trigger: "change" 
				}],
				depart_ids: [{ 
					type: "array", 
					required: true, 
					message: "请选择适用部门", 
					trigger: "change"
				}],
				service_define: [
					{
						required: true,
						message: "请选择服务项定义！",
						trigger: "change"
					}
				],
				service_memo: [
					{
						required: true,
						message: "服务项说明是必填的！",
						trigger: "blur"
					}
				],
				must_do: [
					{
						required: true,
						message: "请选择是否必做！",
						trigger: "change"
					}
				],
				reference_period: [
					{
						required: true,
						message: "请选择参考时间！",
						trigger: "change"
					}
				],
				reference_num: [
					{
						required: true,
						type: "number",
						message: "参考次数是必填的！",
						trigger: "blur"
					}
				],
				first_time: [
					{
						required: true,
						type: "number",
						message: "第一阶段参考次数是必填的！",
						trigger: "blur"
					}
				],
				second_time: [
					{
						required: true,
						type: "number",
						message: "第二阶段参考次数是必填的！",
						trigger: "blur"
					}
				],
				third_time: [
					{
						required: true,
						type: "number",
						message: "第三阶段参考次数是必填的！",
						trigger: "blur"
					}
				],
				service_validity: [
					{
						required: true,
						message: "请选择时间！",
						trigger: "change"
					}
				],
				about_product: [
					{ 
						required: true,
						type: "array",  
						message: "请选择关联产品！", 
						trigger: "blur" 
					}
				]
			},
			service_types: [
				{
					value: "1",
					label: "基础服务"
				},
				{
					value: "2",
					label: "咨询服务"
				}
			],
			role_date: [],
			reference_periods: [	
				{
					value: "1",
					label: "1个月"
				},
				{
					value: "3",
					label: "3个月"
				}, {
					value: "6",
					label: "6个月"
				},
				{
					value: "12",
					label: "12个月"
				}
			],
			service_validitys: [
				{
					value: "0",
					label: "0个月"
				},
				{
					value: "1",
					label: "1个月"
				}, {
					value: "3",
					label: "3个月"
				},
				{
					value: "6",
					label: "6个月"
				}
			],
			productList: [{
				id: "1",
				name: "1"
			}, {
				id: "2",
				name: "2"
			}, {
				id: "3",
				name: "3"
			}],
			columns: [
				{
					type: "selection",
					minWidth: 60,
					align: "center"
				},
				{
					title: "产品名称",
					key: "product_name",
					minWidth: 140,
					tooltip: true
				},
				{
					title: "产品类型",
					key: "category_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "是否必做",
					key: "is_check",
					minWidth: 120,
					render: (h, params) => {
						if (params.row.is_check != 0) {
							return h(
								"div",
								{
									class: "g-flex _radio"
								},
								[
									h(RadioGroup, {
										props: {
											value: params.row.service_type
										},
										on: {
											"on-change": (status) => {
												if (status == "1") {
													params.row.service_type = 1;
													this.tableData.splice(params.row._index, 1, params.row);
												} else {
													params.row.service_type = 2;	
													this.tableData.splice(params.row._index, 1, params.row);
												}

												this.form.about_product.forEach(item => {
													if (item.product_id === params.row.product_id) {
														item.service_type = params.row.service_type;
													}
												});
											}
										}
									},
									[h(Radio, {
										props: { label: 1 }
									}, "必做"), h(Radio, {
										props: {
											label: 2
										}
									}, "选做")])
								]
							);
						} else {
							return null;
						}
					}
				}
			],
			tableData: [],
			allData: [], // 所有数据
			royaltyData: [] // 有服务提成的数据
		};
	},

	watch: {
		type_switch(v) {
			// 防止watch在页面渲染完之前监听
			if (this.allData.length === 0 || this.royaltyData.length === 0) {
				return;
			}
			
			if (v) {
				this.allData = JSON.parse(JSON.stringify(this.tableData));

				this.royaltyData.forEach(item => {
					if (+item.is_check === 1) {
						item.is_check = 1;
						item._checked = true;

						return;
					}
				});

				this.tableData = JSON.parse(JSON.stringify(this.royaltyData));
			} else {
				this.royaltyData = JSON.parse(JSON.stringify(this.tableData));

				this.allData.forEach(item => {
					if (+item.is_check === 1) {
						item.is_check = 1;
						item._checked = true;

						return;
					}
				});

				this.tableData = JSON.parse(JSON.stringify(this.allData));
			}
		},

		"form.service_define": {
			handler(value) {
				if (value === "2" && !this.type_switch && this.tableData.length === 0) {
					this.tableData = this.allData;
				}
			}
		}
	},

	async mounted() {
		this.loadRoadData();

		if (this.set_id) {
			this.loadData();
		} else {
			this.loadProductData(1);
			this.loadProductData(5);
		}

		this.visible = true;
	},

	methods: {
		handleOk() {
			this.$refs.form.validateAndScroll((valid) => {
				if (valid) {
					this.visible = false;
					this.handleSave();
				} else {
					this.$refs.modal.buttonLoading = false;
				}
			});
		},

		// 编辑时的数据
		loadData(type) {
			this.$request({
				url: API_ROOT._CONTENT__SERVICE_SETTING_GET_ITEM_SET_INFO_GET,
				type: "GET",
				param: {
					set_id: this.set_id
				}
			}).then(res => {
				this.form.service_name = res.data.service_name;
				this.form.service_type = "" + res.data.service_type;
				this.form.relation_point = "" + res.data.relation_point;
				this.form.depart_type = "" + res.data.depart_type;
				this.form.position_ids = res.data.position_ids.split(",");
				this.form.service_define = "" + res.data.service_define;
				this.form.service_memo = res.data.service_memo;
				this.form.must_do = res.data.must_do ? "" + res.data.must_do : "";
				this.form.reference_period = "" + res.data.reference_period;
				this.form.reference_num = res.data.reference_num || res.data.reference_num === 0 ? +res.data.reference_num : null;
				this.form.first_time = res.data.first_time || res.data.first_time === 0 ? +res.data.first_time : null;
				this.form.second_time = res.data.second_time || res.data.second_time === 0 ? +res.data.second_time : null;
				this.form.third_time = res.data.third_time || res.data.third_time === 0 ? +res.data.third_time : null;
				this.form.service_validity = "" + res.data.service_validity;

				if (+this.form.service_define === 2) {
					this.type_switch = +res.data.product_type === 1;

					this.type_switch ? this.tableData = res.data.product_one_names : this.tableData = res.data.product_two_names;

					this.tableData.forEach(item => {
						if (+item.is_check === 1) {
							item._checked = true;
							this.form.about_product.push(item);
						} else {
							item._checked = false;
						}
					});
				}

				this.$nextTick(() => {
					this.allData = res.data.product_two_names;
					this.royaltyData = res.data.product_one_names;
				});

				// 通过id遍历筛选出所选部门信息 
				this.searchSelectedDepart(this.departAll, res.data.depart_ids.split(","));

				let arr = [];
				this.form.position_ids.forEach(item => {
					arr.push(+item);
				});

				this.form.position_ids = arr;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		searchSelectedDepart(departArr, selectedIds) {
			for (let depart of departArr) {
				if (selectedIds.includes(depart.value + "")) {
					const selectedDepart = {
						value: depart.value,
						label: depart.label
					};

					this.form.depart_ids.push(selectedDepart);
					if (this.form.depart_ids.length === selectedIds.length) return;
				}

				if (depart.children && depart.children.length) {
					this.searchSelectedDepart(depart.children, selectedIds);
				}
			}
		},
        
		// 获取适用角色列表
		loadRoadData() {
			this.$request({
				url: API_ROOT._CONTENT_SERVICE_SETTING_ROLE_DATA_GET,
				type: "GET",
				param: {}
			}).then(res => {
				this.role_date = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		loadProductData(type) {
			// type 1代表有服务提成 5代表所有
			this.$request({
				url: API_ROOT._CONTENT__SERVICE_SETTING_PRODUCT_NAME_GET,
				type: "GET",
				param: {
					type
				}
			}).then(res => {
				if (type == 1) {
					this.royaltyData = res.data;

					this.royaltyData.forEach(item => {
						item.is_check = 0;
						item._checked = false;
						item.service_type = 1;
					});
				} else {
					this.allData = res.data;

					this.allData.forEach(item => {
						item.is_check = 0;
						item._checked = false;
						item.service_type = 1;
					});

					this.tableData = this.allData;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleSave() {
			this.form.about_product = [];
			this.tableData.forEach(item => {
				+item.is_check === 1 && this.form.about_product.push({
					product_id: item.product_id,
					product_name: item.product_name,
					is_check: item.is_check,
					service_type: item.service_type
				});
			});

			let API = this.set_id ? "_CONTENT_SERVICE_SETTING_EDIT_POST" : "_CONTENT_SERVICE_SETTING_SET_POST";
			let depart_ids = [];

			if (this.form.depart_ids.length != 0) {
				this.form.depart_ids.map(item => {
					depart_ids.push(item.value);
					return;
				});
			}

			let product_type = this.type_switch ? 1 : 2;

			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					set_id: this.set_id,
					...this.form,
					must_do: this.form.must_do ? this.form.must_do : 0,
					position_ids: this.form.position_ids.length != 0 ? this.form.position_ids.join(",") : "",
					about_product: this.form.service_define == "2" && this.form.about_product.length != 0 ? this.form.about_product : "",
					depart_type: this.form.depart_type,
					depart_ids: depart_ids.length != 0 ? depart_ids.join(",") : "",
					product_type,
					reference_period: this.form.service_define === "1" && this.form.must_do === "2" ? "" : this.form.reference_period,
					reference_num: this.form.service_define === "1" && this.form.must_do === "2" ? "" : this.form.reference_num,
					first_time: this.form.service_define === "1" && this.form.must_do === "2" ? "" : this.form.first_time,
					second_time: this.form.service_define === "1" && this.form.must_do === "2" ? "" : this.form.second_time,
					third_time: this.form.service_define === "1" && this.form.must_do === "2" ? "" : this.form.third_time,
					service_validity: this.form.service_define === "1" && this.form.must_do === "2" ? "" : this.form.service_validity
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.visible = true;
			});
		},
		
		handleSelect(row) {
			let arr = [];

			arr = JSON.parse(JSON.stringify(this.tableData));
			this.form.about_product = [];

			arr.forEach((item, index) => {
				item._checked = false;
				item.is_check = 0;

				row && row.forEach(element => {	
					if (item.product_id === element.product_id) {
						item.is_check = 1;
						item._checked = true;

						this.form.about_product.push(item);
					}
				});
			});	

			this.tableData = arr;
		},

		// 在多选模式下有效，取消选中某一项时触发
		handleSelectCancel(selection, row) {
			this.tableData.forEach(item => {
				if (item.product_id == row.product_id) {
					item._checked = false;
					item.is_check = 0;
					item.service_type = 1;
				}
			});

			let arr = [];

			this.form.about_product.forEach(item => {
				if (item.product_id != row.product_id) {
					arr.push(item);
				}
			});

			this.form.about_product = arr;
		},

		// 在多选模式下有效，点击取消全选时触发
		handleSelectAllCancel() {
			this.tableData.forEach(item => {
				item._checked = false;
				item.is_check = "0";
				item.service_type = "1";
			});

			this.form.about_product = [];
		},

		handleRadioSelect(e) {
			this.form.depart_ids = [];
		}
	}
};

export const AddServiceModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-content-add-service-modal{
	.ivu-modal-body{
		max-height: 460px;
		overflow-y: auto;
	}

	.ivu-table{
		max-height: 200px;
		overflow-y: auto;
	}

	.ivu-table-cell-tooltip-content{
		margin-top: 10px;
	}

	._count{
		.ivu-form-item-content{
			margin-left: 10px !important;
		}
	}

	._second,._third{
		.ivu-form-item-label:before{
			color: #ffffff !important;
		}
	}

	._table{
		width: 520px;
		height: 180px;
		overflow: auto;

		h6{
			width: 100%;
			height: 36px;
			background: #F0F4FC;
			justify-content: space-around;
		}
	}

	._radio {
		.ivu-radio-wrapper {
			&:first-child {
				margin-right: 10px;
			}
		}
	}

	._depart{
		.ivu-form-item-required{
			.ivu-form-item-label{
				&:before{
					content: " ";
				}
			}
		}
	}

	.ivu-input-number-handler-wrap{
		display: none;
	}

	.ivu-table-overflowX{
		    overflow-x: hidden;
	}

	.ivu-radio-inner, .ivu-radio-inner:after{
		transition: no;
		-webkit-transition: no;
	}
}
</style>