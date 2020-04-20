<template>
	<div 
		:style="isFinance ? 'width:900px' : 'width:680px'"
		class="v-sale-customer-service-amount g-relative g-m-t-20" 
		style="min-height:260px;"
	>
		<oa-loading v-if="loading"/>
		<div class="g-fs-14 g-m-t-20" >
			<span class="_title-bar g-bg-red-mid" />
			<span class="g-m-lr-5">合同编号:</span>
			<span 
				v-for="(con,index) in serviceData.contract" 
				:key="con.contract_id" 
			>
				{{ con.contract_type_name }} {{ con.contract_num }} {{ con.invalid_type?'（已失效）':'' }}
				{{ index==serviceData.contract.length-1?'':"、" }}
			</span>
			<i-poptip
				v-if="changeRecord.length"
				ref="know"
				width="300" 
				class="_konw-tip" 
				placement="left-start"
				popper-class="v-sale-customer-service-amount-poptip"
				transfer
				word-wrap
			>
				<i-button type="primary" > 服务提成变更记录 </i-button>
				<!-- eslint-disable -->
					<oa-record slot="content" :records="changeRecord" max-height="300px" ><div style="position:relative;top:-16px" slot-scope="{data}">
							<template v-if="data.record_id"><div ><span class="g-fs-14">{{ data.type_name }}</span><span class="g-fs-14 g-m-l-10">{{ data.create_time }}</span></div><div class="g-m-t-5">{{ data.content }}</div></template><div v-else>暂无服务提成变更记录</div>
						</div>
					</oa-record>
				<!-- eslint-enable -->
			</i-poptip>
		</div>
		<div class="g-m-b-10">
			<span class="_title-item">合作项目：
				<oa-auto-tooltip
					:content="serviceData.product_names"
					width="220px"
					style="width:230px"
					label-class="def"
				/>
				<!-- <span>{{ serviceData.product_names }}</span> -->
			</span>
			<span class="_title-item">总实付金额：<span >¥{{ serviceData.payment_amount }}</span></span>
			<span class="_title-item">服务提成：<span >¥{{ serviceData.need_service_amount_total }}</span></span>
			<span class="_title-item">已发服务提成：
				<span v-if="+serviceData.service_amount_total==0" >¥{{ serviceData.service_amount_total }}</span>
				<i-poptip v-else trigger="hover" >
					<span class="g-operation">¥{{ serviceData.service_amount_total }}</span>
					<div slot="content">
						<div v-for="(item,index) in serviceData.service_amount_grant_assign" :key="index">
							{{ item.staff_name }}：{{ item.service_amount }}
						</div>
					</div>
				</i-poptip>
			</span>
		</div>
		<i-table 
			v-if="serviceData.stage_list && serviceData.stage_list.length>0"
			:columns="columns"
			:data="serviceData.stage_list"
		/>

	</div>
</template>
<script >
import { Table, Tooltip, Button, Poptip } from 'iview';
import Loading from '@components/_common/loading/loading';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import SaleExpand from '../../../../expand';
import Record from '../../../../record';

export default {
	name: "oa-sale-customer-serivce-amount",
	components: {
		'i-table': Table,
		'oa-loading': Loading,
		'i-tooltip': Tooltip,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-record': Record,
		'oa-auto-tooltip': AutoTooltip
	},
	props: {
		contractId: Number,
		contratcType: Number,
		isFinance: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			loading: false,
			serviceData: {
				contract: [],
				stage_list: [],
				service_amount_grant_assign: [
					//  {
					// 	"staff_id": 1,
					// 	"staff_name": "超管", // 发放人
					// 	"service_amount": "0.00", // 发放服务提成
					// 	"assign_type": 0, // 分配原因：1转岗 2 离职  3  指派
					// 	"assign_title": ""// 离职未发放
					// }
				],
				payment_amount: "0.00", // 实付金额
				need_service_amount_total: "0.00", // 需要发放金额
				service_amount_total: "0.00", // 已经发放金额
				product_names: "", // 产品名
				contract_id: ''// 合同id
			},
			columns: [
				{
					title: "服务阶段",
					key: "stage",
					minWidth: 150,
				},
				{
					title: "服务提成",
					key: "service_amount",
					minWidth: 130,
					render: (h, { row }) => {
						if (+row.service_amount == 0) {
							return <span>{row.service_amount}/{row.need_service_amount}</span>;
						} else {
							return (
								<Tooltip trigger="hover" >
									<span class="g-operation">{row.service_amount}/{row.need_service_amount}</span>
									<div slot="content">
										{row.service_amount_assign.map(ass => {
											return <div>{ass.staff_name}:{ass.service_amount}</div>;
										
										})}
									</div>
								</Tooltip>
							);
						}
					}
				},
				{
					title: "质检评分",
					key: "score",
					minWidth: 80,
				},
				{
					title: "回款金额",
					key: "return_amount",
					minWidth: 80,
				},
				{
					title: "服务完成情况",
					key: "finish_num",
					minWidth: 100,
				},
				{
					title: "发放状态",
					key: "is_grant",
					minWidth: 80,
					render: (h, { row }) => {
						const lab = this.grantMap[row.is_grant];
						return <span class={lab.className}>{lab.label}</span>;
					}
				}
			],
			numMap: {
				1: '一',
				2: '二',
				3: '三',
				4: '四',
				5: '五',
				6: '六',
				7: '七',
				8: '八',
			},
			grantMap: {
				0: {
					label: "未发放",
					className: 'g-c-green-mid'
				},
				1: {
					label: '已发放',
					className: "g-c-blue-mid"
				},
				2: {
					label: "部分发放",
					className: 'g-c-orange-mid'
				}
			},
			changeRecord: [
				// {}
				// {
				// 	record_id: 6422,
				// 	type: 1,
				// 	content: "下单产品“微商全套”，实付金额139800.00元，服务提成5452.20元，客户服务年限为1年，各阶段服务提成比例为3271.32:2180.88", // 变更内容
				// 	create_time: "2019-08-06 17:37:50", // 时间
				// 	type_name: "下单"// 类型名称
				// },
				// {
				// 	record_id: 6422,
				// 	type: 1,
				// 	content: "下单产品“微商全套”，实付金额139800.00元，服务提成5452.20元，客户服务年限为1年，各阶段服务提成比例为3271.32:2180.88", // 变更内容
				// 	create_time: "2019-08-06 17:37:50", // 时间
				// 	type_name: "下单"// 类型名称
				// }
			]
			
		};
	},
	computed: {
	},
	watch: {
		contractId() {
			this.loadData();
		}
	},
	created() {
		this.loadData();
	},
	methods: {
		loadData() {
			this.loading = true;
			this.$request({
				url: "_SALE_CONTRACT_SERVICE_AMOUNT_GET",
				type: "GET",
				param: { contract_id: this.contractId, contract_type: this.contratcType },
				loading: false,
			}).then(res => {
				this.serviceData = res.data;
				this.serviceData.stage_list.forEach(item => {
					item.stage = '第' + item.stage + "阶段 (" + item.start_time + '~' + item.end_time + ')';
					// item.score_name = item.score + (item.score == '-' ? '' : '分');
					// item.return_amount += (item.return_amount == '-' ? '' : '万');
					item.finish_num = item.finish_num + '/' + item.need_service_num + '项';
				});
				this.loading = false;
			}).catch((res) => {
				console.error(res);
				this.loading = false;
				this.$Message.error(res.msg);
			});
			this.loadChangeRecord();
		},
		loadChangeRecord() {
			this.$request({
				url: "_SALE_CONTRACT_SERVICE_AMOUNT_CHANGE_RECORD_GET",
				type: "GET",
				param: {
					contract_id: this.contractId
				},
				loading: false,
			}).then(res => {
				this.changeRecord = res.data;


				// if (res.data.length) {
				// 	this.changeRecord = res.data;
				// } else {
				// 	this.changeRecord = [{}];
				// }
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};
</script>
<style lang="scss">
.v-sale-customer-service-amount {
	._title-item {
		display: inline-block;
		width:300px;
		margin-top: 10px;
	}
	._konw-tip{
		position: absolute;
		right: 0px;
		// color: #4B4F57;
		// font-size: 12px;
		// background: #fff;
		// border-radius: 3px;
		// border:1px solid #BFBFBF;
		// padding: 6px 10px;
	}


}
.v-sale-customer-service-amount-poptip{
	.ivu-poptip-inner {
		background:rgb(88, 94, 107);
			.ivu-poptip-body{
				background:rgb(88, 94, 107);
				border-radius: 4px;
				color: #fff;
				// max-height: 250px;
				overflow-y: hidden;
				padding-right: 5px;
				padding-left: 5px;
				// &::-webkit-scrollbar {
				// 	width: 10px;
				// 	height: 10px;
				// }
				// &::-webkit-scrollbar-thumb {
				// 	background-color:#ccc;
				// 	border: solid 1px #ccc;
				// 	border-radius:2px;
				// }
				// &::-webkit-scrollbar-track {
				// 	box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
				// 	border-radius: 2px;
				// 	background: #EDEDED;
				// }
			}
	}
	.ivu-poptip-arrow:after{
			border-left-color:  rgb(102, 102, 102) !important;
	}
	
}
</style>