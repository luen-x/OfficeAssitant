<template>
	<div class="v-sc-service-manage-customer g-m-t-30">
		<div v-if="spin">
			<div v-if="list.length" class="g-m-r-30">
				<oa-title title="对接人信息" class="g-m-b-20"/>
				<i-table 
					ref="tableTarget" 
					:columns="columns"
					:data="list" 
				/>
			</div>

			<oa-title title="下单信息" class="g-m-b-20 g-m-t-20"/>

			<div 
				v-for="(item,index) in contract"
				:key="index"
				class = "g-pd-l-20 g-pd-t-20 g-m-b-20 _customer"
			>
				<div 
					v-if="item.status != '1'" 
					class = "g-pd-l-10 g-pd-r-10 g-absolute" 
					style="background: #EAEAEA;top: 0px;right: 0px;height: 28px;line-height: 28px;"
				>
					{{ ["待审核","已通过","未通过","已失效"][item.status * 1] }}
					({{ ["","合同退款","换合同退款","","产品退款","换产品退款"][item.invalid_type * 1] }}) 
				</div>
                
				<div class = "__header">
					<span>
						合同编号：{{ item.contract_num }}
						（{{ ["新建合同","补充协议","更换产品","续费合同"][item.contract_type * 1] }}）
					</span>
					<span class="g-m-l-10 __orderdate">下单日期：{{ item.create_time }}</span>
				</div>

				<div class="g-flex g-flex-cc __top">
					<span>合同金额：{{ item.contract_amount }}</span>
					<span>应付金额：{{ item.need_amount }}</span>
					<span>实付金额：{{ item.payment_amount }}</span>
					<span>剩余尾款：{{ item.last_amount }}</span>
				</div>

				<div class="g-flex g-flex-cc __center">
					<span>产品成本：{{ item.need_cost_amount }}</span>
					<span>实扣成本：{{ item.cost_amount }}</span>
					<span>邀约人：
						<i-tooltip 
							v-if="item.inviter.length > 10"
							:max-width="200" 
							:content="item.inviter"
							placement="bottom"
							transfer
						>
							{{ item.inviter.slice(0, 10) + '...' }}
						</i-tooltip>
						<div v-else class="g-inline-block">{{ item.inviter }}</div>
					</span>
					<span>谈判人：{{ item.negotiator.join(",") }}</span>
				</div>

				<div class="__order-product">
					<span v-if="item.product_sku_items.length">
						下单产品：
						<span v-for="(item1, index1) in item.product_sku_items" :key="index1" style="display: inline;">
							<i-tooltip 
								v-if="item1.project_assign_staff.staff"
								:max-width="400" 
								placement="bottom"
								transfer
							>
								<div slot="content">
									<span>主负责人：{{ item1.project_assign_staff.staff }}</span>
									<div v-for="(item2, index2) in item1.project_assign_staff.child" :key="index2">
										<span v-if="item2.staff_name[0]">{{ item2.child_product_name }}：{{ item2.staff_name.join('、') }}</span>
									</div>
								</div>
								{{ item1.product_sku_items }}
							</i-tooltip>
							<span v-else>{{ item1.product_sku_items }}</span>
							<div v-if="index1 !== item.product_sku_items.length - 1 " class="g-inline-block">、</div>
						</span>
					</span>
					<span v-else>下单产品：--</span>
				</div>
				<div class="__return-money">
					<span v-if="item.refund_sku_items.length">
						退款产品：
						<span 
							v-for="(item1, index1) in item.refund_sku_items"
							:key="index1"
						>
							<i-tooltip 
								v-if="item1.project_assign_staff.staff"
								:max-width="400" 
								placement="bottom"
								style="display: inline"
								transfer
							>
								<div slot="content">
									<span>主负责人：{{ item1.project_assign_staff.staff }}</span>
									<div v-for="(item2, index2) in item1.project_assign_staff.child" :key="index2">
										<span v-if="item2.staff_name[0]">{{ item2.child_product_name }}：{{ item2.staff_name.join('、') }}</span>
									</div>
								</div>
								{{ item1.product_sku_items }}
							</i-tooltip>
							<span v-else style="display: inline">{{ item1.product_sku_items }}</span>
							<div v-if="index1 !== item.refund_sku_items.length - 1 " style="display: inline">、</div>
						</span>
					</span>
					<span v-else>退款产品：--</span>
				</div>

				<div class="g-flex g-flex-cc __center __footer">
					<span>老板姓名：{{ item.boss_name }}</span>
					<span>
						老板电话：
						<div v-if="item.boss_tel" class="g-inline-block">
							<div v-if="!$global.staff.seat_number" class="g-inline-block">{{ item.boss_tel }}</div>
							<div v-else class="g-operation g-inline-block" @click="handleCall(item.boss_tel)">
								{{ item.boss_tel }}
								<i class="icon iconfont icon-call2 g-m-l-5" />
							</div>
						</div>
					</span>
					<span>对接人姓名：{{ item.contact_name }}</span>
					<span>
						对接人电话：
						<div v-if="item.contact_tel" class="g-inline-block">
							<div v-if="!$global.staff.seat_number" class="g-inline-block">{{ item.contact_tel }}</div>
							<div v-else class="g-operation g-inline-block" @click="handleCall(item.contact_tel)">
								{{ item.contact_tel }}
								<i class="icon iconfont icon-call2 g-m-l-5" />
							</div>
						</div>
					</span>
				</div>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { Title } from "@components/sc/_common";
import API_ROOT from "@stores/apis/root";
import { Tooltip, Table, Message } from "iview";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { Confirm } from '@common/confirm/confirm';
import callService from '@components/sale/call-manage/call/service';
import { ContractModal } from "./contract-modal";

export default {
	name: "sc-service-manage-customer",
    
	components: {
		"oa-title": Title,
		"i-tooltip": Tooltip,
		"i-table": Table
	},
	
	props: {
		contract_company_id: Number,
		data: Object
	},
    
	data() {
		return {
			contract: [],
			spin: false,
			columns: [
				{
					title: '对接人姓名',
					key: 'name',
					minWidth: 100,
					render: (h, params) => {
						let name = params.row.name;
						return (
							<AutoToolTip 
								content={name}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '对接人电话',
					key: 'phone',
					minWidth: 120,
					render: (h, { row }) => {
						if (!_global.staff.seat_number) {
							return (
								<span>{row.phone}</span>
							);
						} else {
							return (
								<span
									class="_value g-operation"
									onClick={
										() => {
											this.handleCall(row.phone);
										}
									}
								>
									{row.phone}
									<i class="icon iconfont icon-call2 g-m-l-5" />
								</span>
							);
						}
					}
				},
				{
					title: '备注',
					key: 'memo',
					minWidth: 120,
					render: (h, params) => {
						let memo = params.row.memo;
						return (
							<AutoToolTip 
								content={memo}
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '添加人',
					key: 'staff_name',
					minWidth: 120
				},
				{
					title: '添加时间',
					key: 'create_time',
					minWidth: 120
				},
				{
					title: '操作',
					key: 'options',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div class="g-m-r-20" style="min-width: 150px;">
								{ this.$auth[1349] ? <span 
									class="g-pointer"
									style={{ color: "#2397f9", padding: "2px 8px 2px 0px" }}
									onClick={
										() => {
											ContractModal.popup({
												name: "edit",
												contact_id: params.row.contact_id
											}).then(res => {
												this.loadListData();
											});
										}
									}
								>
									编辑
								</span> : ''
								}
								{this.$auth[1349] && this.$auth[1350]
									? <span style={{ color: "#2397f9", width: "1px", height: "10px" }}>
									|</span> : ''}
								{this.$auth[1350] ? <span 	class="g-pointer"
									style={{ color: "#2397f9", padding: "2px 8px" }}
									onClick={
										() => {
											Confirm.popup({ msg: '确认删除该联系方式？' }).then(() => {
												this.$request({
													url: "_SC_MANAGE_INSPECTION_QUALITY_CONTRACT_INFO_DELET_GET",
													type: "GET",
													param: {
														contact_id: params.row.contact_id
													},
													loading: false,
												}).then(res => {
													this.$Message.success(res.msg);
													this.loadListData();
												}).catch((res) => {
													this.$Message.error(res.msg);
												});
											});
										}
									}
								>
									删除
								</span> : ''}
							</div>
						);
					}
				}
			],
			list: [],
		};
	},

	mounted() {
		this.loadData();
		this.loadListData();
	},

	methods: {
		handleCall(phone) {
			let cus = {
				...this.data,
				tel: phone
			};
			callService.prepareToCallOut(phone, { customer: cus });
		},
		loadData() {
			this.spin = false;
        
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_CUSTOMER_INFO_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.contract = res.data.contract;
				this.contract.forEach(item => {
					item.product_name = item.product_sku_items.join("+");
					item.inviter = item.invite_person + '(' + item.invite_person_depart + ')';
				});
				this.spin = true;
			}).catch(error => {
				this.spin = true;
				this.$Message.error(error.msg);
			});
		},
		loadListData() {
			this.$request({
				url: API_ROOT._SC_MANAGE_INSPECTION_QUALITY_CONTRACT_LIST_GET,
				type: "GET",
				param: {
					contract_company_id: this.contract_company_id
				},
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-sc-service-manage-customer{
    padding-left: 32px;
	padding-bottom: 120px;

    ._customer{
        width: 96%;
        background: #FFFFFF;
        border: 1px solid #e8e8e8;
        border-radius: 4px;
        font-size: 12px;
        color: #818794;
        font-family:MicrosoftYaHei;
        font-weight:400;
        position: relative;
		padding-bottom: 20px;
		&:hover {
			box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
		}

        .__header{
            font-size: 15px;
            color: #333333;
			padding-bottom: 10px;
			margin-right: 20px;
			border-bottom: 1px solid #ebeef1;
            .__orderdate{
                font-size: 12px;
                color: #818794;
                font-family:MicrosoftYaHei;
                font-weight:400;
            }
        }

        .__top, .__center,.__bottom,.__return-money,.__order-product{
            margin-top: 18px;
			margin-right: 20px;

            span{
                width: 25%;
                display: inline-block;
                // border-right: 1px solid #D4D7DB;
                height: 12px;
                line-height: 12px;

                &:nth-of-type(1){
                    padding-left: 0px;
                }

                &:nth-of-type(4){
                    border-right: none;
                }
            }
        }
		.__order-product {
			span{
				border-right: none;
				display: inline;
            }
		}

		.__return-money{
			span{
                border-right: none;
				display: inline;
            }
		}

		.__footer{
			padding-top: 17px;
			margin-right: 20px;
			border-top: 1px solid #E8E8E8;
		}
    }
}
</style>