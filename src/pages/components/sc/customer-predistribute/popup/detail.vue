<template>
	<i-drawer
		v-model="closable"
		:mask="false"
		:mask-closable="false"
		class="v-sc-customer-predistribute-detail"
		@on-close="handleCancel"
	>
		<div class="g-pd-b-20 _header">
			<div class="g-m-t-30 g-c-black __title">
				<span class="g-fs-20">{{ pre_detail.contract_company_name }}</span>
			</div>

			<ul class="g-flex g-flex-ac g-m-t-10">
				<li class="g-m-t-20">
					<span>客户姓名：</span>
					<span class="g-c-black">{{ pre_detail.customer_name }}</span>
				</li>

				<li class="g-m-t-20">
					<span>客户电话：</span>
					<span class="g-c-black">{{ pre_detail.phone }}</span>
				</li>

				<li class="g-m-t-20">
					<span>录入时间：</span>
					<span class="g-c-black">{{ pre_detail.create_time }}</span>
				</li>

				<li class="g-m-t-20">
					<span>成交时间：</span>
					<span class="g-c-black">{{ pre_detail.deal_time }}</span>
				</li>
			</ul>
		</div>

		<div class="g-m-t-30 g-pd-r-30" style="margin-left: 22px;">
			<span class="g-fs-14 g-c-black g-m-b-20 _pre-distribute">预分配信息</span>
            
			<div class="_pr-ti">
				<p>
					<span>产品名称：</span>
					<span>{{ pre_detail.product_name }}</span>
				</p>
				<p>
					<span>主要负责人<oa-explain
						title="指的是合同中单个产品的主要负责人，指定主要负责人后，还可以针对产品的分工来指定具体的负责人"
						content="举例：下单百度推广后，需要先指定百度推广的主要负责人，再根据详细的分工（百度端优化、软文等）去指定具体的负责人"/>
						：</span>
					<span>{{ pre_detail.main_person }}</span>
				</p>
				<p v-if="type != '3'">
					<i
						v-if="$auth[838] && !pre_detail.main_person"
						class="iconfont icon-add1 __font-photo"
						style="cursor: pointer;"
						@click="handleAddChargePerson"
					/>
					<span
						v-if="$auth[838] && pre_detail.main_person"
						class="g-inline-block g-m-l-5"
						style="cursor:pointer;color: #2397f9;height:19px;line-height:19px;"
						@click="handleAddChargePerson"
					>
						更改
					</span>
				</p>
			</div>

			<i-table 
				:columns="columns" 
				:data="tableData"
				stripe
				@on-row-click="handleRowClick"
			/>
		</div>
		<div
			v-if="type === '1' || type === '2'"
			class="_footer"
		>
			<i-button
				v-if="type === '1' && $auth[839]"
				style="margin-right: 8px"
				type="primary"
				@click="handleAllocatProduct"
			>
				分配制作
			</i-button>

			<i-button
				v-if="type === '2' && $auth[839]"
				style="margin-right: 8px"
				type="primary"
				@click="handleAllocatProduct"
			>
				重新分配
			</i-button>

			<i-button
				v-if="$auth[841]"
				@click="handleOpenWarmPrompt"
			>
				无需制作
			</i-button>
		</div>
	</i-drawer>
</template>

<script>
import { Drawer, Row, Col, Button, Table, Radio } from "iview";
import { CreatePortal } from "wya-vc";
import Explain from "@components/_common/explain/explain";
import API_ROOT from "@stores/apis/root";
import { Confirm } from "@components/_common/confirm/confirm";
import { PreDistributeModal } from "./pre-distribute";
import { PreChargePersonModal } from "./select-charge-person";

export default {
	name: "sc-customer-predistribute-detail-drawer",

	components: {
		"i-drawer": Drawer,
		"i-button": Button,
		"i-table": Table,
		"oa-explain": Explain
	},

	props: {
		type: String,
		order_product_id: Number,
		contract_id: Number,
		project_id: Number,
		make_id: Number
	},

	data() {
		return {
			closable: false,
			show: false,
			main_person: "",
			product: "微商系统",
			currentId: "", // 子分配ID
			columns: [ 
				{
					title: " ",
					key: "radio",
					minWidth: 45,
					render: (h, params) => {
						let id = params.row.assign_id;
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
									self.currentId = id;
								}
							}
						});
					}
				},
				{
					title: "产品分工",
					key: "sub_product_name",
					minWidth: 200,
					render: (h, params) => {
						if (params.row.status == 2) {
							return h("div", {}, [
								h("span", {
									"class": "_z-wz"
								}, "无需制作"),
								h("span", {}, params.row.child_product_name)
							]);
						} else {
							return h("div", {}, params.row.child_product_name);
						}
					}
				},
				{
					title: "分配人",
					key: "assign_staff_name",
					minWidth: 100,
					tooltip: true
				},
				{
					title: "负责人",
					key: "staff_name",
					minWidth: 150,
					tooltip: true
				},
				{
					title: "分配时间",
					key: "update_time",
					minWidth: 150,
					tooltip: true
				}
			],
			tableData: [],
			pre_detail: {},
			count_status: 0, // 无须制作的个数
			count: 0 // 制作的个数
		};
	},

	computed: {
		showFooter() {
			return true;
		}
	},

	mounted() {	
		this.loadData();
		this.closable = true;
	},

	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._SC_CUSTOMER_PREDISTRIBUTE_DETAIL_GET,
				type: "GET",
				param: {
					order_product_id: this.order_product_id
				},
				loading: false
			}).then(res => {
				this.pre_detail = res.data;
				this.tableData = res.data.child;
				this.count_status = 0;
				this.count = 0;

				this.tableData.forEach(item => {
					item.status === "2" && this.count_status++;
					item.assign_staff_name != "" && this.count++;
				});
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		// 添加主要负责人
		handleAddChargePerson() {
			PreChargePersonModal.popup({
				order_product_id: this.order_product_id
			}).then(res => {
				res && this.loadData();
			});
		},

		handleCancel() {
			this.$emit("close");
		},

		handleWarmPrompt(name) {
			Confirm.popup({
				title: "温馨提示",
				msg: name
			}).then(() => {
			}).catch(error => {});
		},

		// 分配制作
		async handleAllocatProduct() {
			if (!this.pre_detail.main_person) {
				this.handleWarmPrompt("请先选择主要负责人，在进行分配，合同才会变为已分配状态");
				return;
			}

			if (!this.currentId) {
				this.handleWarmPrompt("请选择具体的项目，再进行分配操作");
				return;
			}

			PreDistributeModal.popup({
				assign_id: Number(this.currentId)
			}).then(ress => {
				let child_person_ids = [];

				ress.forEach(item => {
					child_person_ids.push(item.staff_id);
				});

				this.$request({
					url: API_ROOT._SC_CUSTOMER_PREDISTRIBUTE_ASSIGN_CHILD_POST,
					type: "POST",
					param: {
						order_product_id: this.order_product_id,
						assign_id: this.currentId,
						child_person_ids 
					},
					loading: false
				}).then(res => {
					this.$Message.success(res.msg);
				}).then(async () => {
					await this.loadData();

					if (this.count_status + this.count == this.tableData.length) {
						this.$store.commit('SC_CUSTOMER_PREDISTRIBUTE_LIST_RESET', {
							type: this.type
						});

						this.handleCancel();
					}
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			});
		},

		// 温馨提示
		async handleOpenWarmPrompt() {
			if (!this.currentId) {
				this.handleWarmPrompt("请选择无需制作的产品");
				return;
			} else if ((this.count_status + 1) === this.tableData.length) {
				this.handleWarmPrompt("不能将所有的产品都设置为无需制作");
				return;
			}

			this.$request({
				url: API_ROOT._SC_CUSTOMER_PREDISTRIBUTE_NOT_MAKE_POST,
				type: "POST",
				param: {
					order_product_id: this.order_product_id,
					assign_id: this.currentId
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(async () => {
				await this.loadData();

				if (this.count_status + this.count == this.tableData.length) {
					this.$store.commit('SC_CUSTOMER_PREDISTRIBUTE_LIST_RESET', {
						type: this.type
					});

					this.handleCancel();
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},

		handleRowClick(row) {
			this.currentId = row.assign_id;
		}
	}
};

export const DetailDrawer = CreatePortal({
	alive: true
}, module.exports.default);
</script>

<style lang="scss">
.v-sc-customer-predistribute-detail {
    .ivu-drawer-body{
        padding: 0px;
    }

    ._header{
        border-bottom: 1px solid #D4D7DB;
        padding-left: 22px;

        .__title{
            padding-left: 6px;
        }

        ul{
            flex-wrap: wrap;

            li{
                width: 25%;
                list-style: none;
            }
        }
    }

    ._pre-distribute{
        display: inline-block;
        border-left: 2px solid #e84854;
        height: 16px;
        line-height: 16px;
        padding-left: 6px;
    }

    ._pr-ti {
        display: flex;
        align-items: center;
        font-size: 12px;
        margin-bottom: 24px;
        margin-left: 10px;

        p {
            &:nth-of-type(1) {
                margin-right: 46px;
            }

            span {
                &:nth-of-type(1) {
                    color: #7f8794;
                }

                &:nth-of-type(2) {
                    color: #000000;
                }
            }

            &:nth-of-type(2) {
                span {
                    &:nth-of-type(3) {
                        color: #2397f9;
                        margin-left: 5px;
                    }
                }
            }
        }

        .__font-photo{
            color: #2397f9;
            font-size: 16px;
            margin-top: 2px; 
        }
    }

    ._footer {
        width: 940px;
        position: fixed;
        bottom: 0;
        right: 0;
        border-top: 1px solid #e8e8e8;
        padding: 13.5px 16px;
        text-align: left;
        background: #fff;
        box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.1);
    }

	._z-wz {
		display: inline-block;
		padding: 0 4px;
		height: 20px;
		line-height: 20px;
		background: #e74b56;
		color: #ffffff;
		border-radius: 2px;
		margin-right: 5px;
		margin-top: 2px;
	}
}
</style>