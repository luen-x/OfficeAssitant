<template>
	<div class="v-sc-customer-product-distribute g-m-t-15 g-pd-l-30 g-pd-r-20 g-relative">
		<div v-if="spin">	
			<oa-title title="分配信息" class="g-m-b-20"/>

			<div class="g-flex g-jc-sb g-flex-ac g-fs-12 g-m-b-25">
				<div class="g-flex g-flex-ac">
					<p style="margin-right: 46px;">
						<span style="color: #7f8794;">产品名称：</span>
						<span class="g-c-black">{{ product }}</span>
					</p>
					<p v-if="has_main_person">
						<span>
							主要负责人
							<oa-explain
								title="指的是合同中单个产品的主要负责人，指定主要负责人后，还可以针对产品的分工来指定具体的负责人"
								content="举例：下单百度推广后，需要先指定百度推广的主要负责人，再根据详细的分工（百度端优化、软文等）去指定具体的负责人"
							/>
							：</span>
						<i
							v-if="$auth[314] && type != 6 && !main_person"
							class="iconfont icon-add1 g-pointer g-fs-16"
							style="color: #2397f9; margin-top: 2px;"
							@click="handleAddChargePerson"
						/>
						<span v-show="main_person">{{ main_person }}</span>
						<span
							v-if="$auth[314] && type != 6 && main_person"
							class="g-pointer g-m-l-5"
							style="color: #2397f9;"
							@click="handleAddChargePerson"
						>
							更改
						</span>
					</p>
				</div>

				<div v-if = "name === 'cooperate'">
					<i-button 
						v-if="(is_submit == '0' || is_submit == '2') && $auth[682]" 
						@click="handleSelectPrompt('1')"
					>
						已提交给设计
					</i-button>
					<i-button 
						v-if="is_submit == '1' && $auth[681]"
						@click="handleSelectPrompt('2')"
					>
						取消提交
					</i-button>
				</div>
			</div>

			<i-table 
				ref="selection" 
				:columns="columns" 
				:data="sub_product"
				:stripe="true"
				@on-row-click="handleRowClick"
				@on-row-dblclick="handleDbClick"
			/>
			
			<div v-if="other_project.length != 0" class="g-m-t-30">
				<div class="g-relative g-pointer" @click="handleToggle('other_expand')">
					<div class="g-absolute" style="left: -10px;">
						<span 
							class="g-fs-14 g-inline-block g-pd-l-10"
							style=" color: #4b4f57;border-left: 2px solid #e84854;height: 16px;line-height: 16px;"
						>
							合同内其他产品负责人
						</span>
						<i
							:class="show_other ? 'icon-triangle-down' : 'icon-triangle-up'"
							class="iconfont g-m-l-5 g-fs-14"
						/>
					</div>
				</div>

				<vc-expand ref="other_expand" v-model="show_other">
					<div 
						v-for="(item,index) in other_project"
						:key="index"
						class="g-pd-t-20"
					>
						<div class="g-pd-t-20">
							<div class="g-flex g-m-b-20">
								<p style="margin-right: 50px;">
									<span style="color: #7f8794">产品名称：</span>
									<span class="g-c-black">{{ item.product_name }}</span>
									<span 
										v-if="item.is_refund == 1" 
										class="g-m-l-10 g-inline-block g-c-white g-m-r-5 g-fs-12 g-tc"
										style="background: #e74b56;border-radius: 3px;height: 20px;line-height: 20px;width: 60px;"
									>
										产品退款
									</span>
								</p>
								<p v-if="item.has_main_person">
									<span style="color: #7f8794">
										主要负责人
										<oa-explain
											title="指的是合同中单个产品的主要负责人，指定主要负责人后，还可以针对产品的分工来指定具体的负责人"
											content="举例：下单百度推广后，需要先指定百度推广的主要负责人，再根据详细的分工（百度端优化、软文等）去指定具体的负责人"
										/>
										：
									</span>
									<span class="g-c-black">{{ item.staff_name }}</span>
								</p>
							</div>

							<i-table 
								:columns="product_name"
								:stripe="true" 
								:data="item.assign"
								class="g-m-t-20"
							/>
						</div>
					</div>
				</vc-expand>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import Explain from '@components/_common/explain/explain';
import { Table, Radio, Button } from "iview";
import API_ROOT from "@stores/apis/root";
import { Title } from "@components/sc/_common";
import { Expand } from "wya-vc";
import { Confirm } from "@components/_common/confirm/confirm";
import { SelectChargePersonModal } from "./select-charge-person";

export default {
	name: "v-cooperate-product-distribute",

	components: {
		"i-table": Table,
		"i-button": Button,
		"oa-title": Title,
		'oa-explain': Explain,
		"vc-expand": Expand
	},

	props: {
		type: String,
		contract_id: Number,
		project_id: Number,
		product: String,
		name: String
	},

	data() {
		return {
			spin: false,
			is_submit: "", // //是否提交给设计 0否（显示提交按钮） 1是（显示取消按钮）
			sub_product: [],
			product_assign_id: "",
			currentId: "",
			main_person: "", // 主负责人 没有为空
			make_id: "",
			count: 0, // 无需制作计数
			count_assign_staff: 0, // 已经制作的数量
			is_dis: -1, // 是否需要制作 0不需要 1需要
			has_main_person: null, // 是否需要主要负责人 0 不需要 1需要
			columns: [
				{
					title: " ",
					key: "radio",
					minWidth: 45,
					render: (h, params) => {
						let id = params.row.product_assign_id;
						let defaultS = false;

						if (this.currentId == id) {
							defaultS = true;
						} else {
							defaultS = false;
						}
			
						let self = this;

						return h(Radio, {
							style: {
								marginRight: "5px"
							},
							props: {
								value: defaultS
							},
							on: {
								input() {
									self.product_assign_id = params.row.product_assign_id;
									self.currentId = id;
									self.is_dis = (params.row.status == 2 ? 0 : 1);
								}
							}
						});
					}
				},
				{
					title: '产品分工',
					key: 'child_product_name',
					minWidth: 210,
					render: (h, params) => {
						if (params.row.status != 2) {
							return (
								<div>{params.row.child_product_name}</div>
							);
						} else {
							return (
								<div>
									<span 
										class="g-inline-block g-c-white g-m-r-5 g-fs-12 g-tc"
										style="border-radius: 3px;background: #e74b56;height: 20px;line-height: 20px;width: 60px;"
									>
										无需制作
									</span>
									<span>{params.row.child_product_name}</span>
								</div>
							);
						}
					}
				},
				{
					title: '分配人',
					key: 'assign_staff_name',
					minWidth: 100,
					tooltip: true
				},
				{
					title: '负责人',
					key: 'child_staff_name',
					minWidth: 150,
					tooltip: true
				},
				{
					title: '分配时间',
					key: 'update_time',
					minWidth: 150,
					tooltip: true
				}
			],
			show_other: false,
			product_name: [
				{
					title: '产品分工',
					key: 'child_product_name',
					minWidth: 100,
					tooltip: true,
					render: (h, params) => {
						if (+params.row.status === 2) {
							return (
								<div>
									<span 
										class="g-inline-block g-c-white g-m-r-5 g-fs-12 g-tc"
										style="border-radius: 3px;background: #ED8F4A;height: 20px;line-height: 20px;width: 60px;"
									>
										无需制作
									</span>
									<span>{params.row.child_product_name}</span>
								</div>
							);
						} else {
							return (
								<div>
									<span>{params.row.child_product_name}</span>
								</div>
							);
						}
					}
				},
				{
					title: '分配人',
					key: 'assign_staff_name',
					minWidth: 100,
					tooltip: true
				},
				{
					title: '负责人',
					key: 'child_staff_name',
					minWidth: 100,
					tooltip: true
				},
				{
					title: '分配时间',
					key: 'update_time',
					minWidth: 100,
					tooltip: true
				}

			],
			other_project: [], // 其他合同
			assign: [] // 产品分工
		};
	},

	mounted() {
		this.loadData();
	},

	methods: {
		// 添加主要负责人
		handleAddChargePerson() {
			SelectChargePersonModal.popup({
				project_id: Number(this.project_id),
				make_id: Number(this.make_id),
				assign: this.assign
			}).then(res => {
				res && this.loadData();
			});
		},

		async loadData() {
			this.spin = false;
			this.count = 0;
			this.count_assign_staff = 0;

			await this.$request({
				url: API_ROOT._SC_CUSTOMER_COOPERATE_PRODUCT_DETAIL_GET,
				type: "GET",
				param: {
					contract_id: this.contract_id,
					project_id: this.project_id
				},
				loading: false
			}).then(res => {
				this.sub_product = res.data.project.assign;
				this.main_person = res.data.project.staff_name;
				this.make_id = res.data.project.make_id;
				this.is_submit = res.data.project.is_submit;
				this.assign = [];
				this.has_main_person = res.data.project.has_main_person;

				this.sub_product.forEach(item => {
					if (item.status == 2) {
						this.count++;
					}

					this.assign.push({
						product_assign_id: item.product_assign_id,
						child_product_name: item.child_product_name
					});

					item.assign_staff_name && this.count_assign_staff++;
				});

				this.other_project = res.data.other_project;
				this.spin = true;
			}).catch(error => {
				this.spin = true;
			});
		},

		handleSelectPrompt(is_submit) {
			Confirm.popup({
				title: "选择已提交",
				msg: is_submit == 1 ? "是否确认该产品已经提交给设计？" : "是否取消提交？"
			}).then(() => {
				this.$request({
					url: API_ROOT._SC_CUSTOMER_COOPERATE_SET_SUBMIT_POST,
					type: "POST",
					param: {
						make_id: this.make_id,
						is_submit,
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadData();
					this.$store.commit("SC_CUSTOMER_COOPERATE_LIST_RESET", { type: '' });
				}).catch(error => {
					this.$Message.warning(error.msg);
				});
			});
		},

		handleRowClick(row) {
			this.currentId = row.product_assign_id;
			this.product_assign_id = row.product_assign_id;
			this.is_dis = row.is_dis;
		},

		handleDbClick(row) {
			this.currentId = row.product_assign_id;
			this.product_assign_id = row.product_assign_id;
			this.is_dis = row.is_dis;
			this.$emit("event");
		},

		handleToggle(value) {
			this.$refs[value].toggle();
		}
	}
};
</script>

<style lang="scss">
.v-sc-customer-product-distribute {
    min-height: 300px;
	padding-bottom: 100px;

	th{
		font-weight: normal !important;
	}
}
</style>