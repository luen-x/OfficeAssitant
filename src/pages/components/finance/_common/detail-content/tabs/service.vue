<template>
	<div class="v-finance-service-amount g-relative g-m-t-20" style="min-height:260px;width:903px">
		<oa-loading v-if="!spin" fixe/>
		<div class="g-fs-14 g-m-t-30" >
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
				popper-class="v-finance-service-amount-poptip"
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
				<i-tooltip
					v-if="serviceData.product_names.length > 15"
					:content="serviceData.product_names"
					placement="bottom"
					max-width="200"
					transfer
				>
					{{ serviceData.product_names.slice(0,15) + "...." }}
				</i-tooltip>
				<span v-else>{{ serviceData.product_names }}</span>
				
			</span>
			<span class="_title-item">总实付金额：<span >¥{{ serviceData.payment_amount }}</span></span>
			<span class="_title-item">服务提成：<span >¥{{ serviceData.need_service_amount_total }}</span></span>
			<span class="_title-item">已发服务提成：
				<span v-if="+serviceData.service_amount_total== '0.00'" >¥{{ serviceData.service_amount_total }}</span>
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
			:columns="columns"
			:data="serviceData.stage_list"
		/>

	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import Loading from '@components/_common/loading/loading';
import { Timeline, TimelineItem, Spin, Button, Poptip, Table, Tooltip } from 'iview';
import Steps from '@components/_common/steps/steps';
import Title from '../../title';
import Record from '../../../../sale/_common/record';

export default {
	name: 'finance-detail-tabs-service',
	components: {
		'i-timeline': Timeline,
		'i-timeline-item': TimelineItem,
		'oa-title': Title,
		'oa-loading': Loading,
		'oa-steps': Steps,
		'oa-record': Record,
		'i-button': Button,
		'i-poptip': Poptip,
		'i-table': Table,
		'i-tooltip': Tooltip
	},
	props: {
		contractId: Number,
		show: Boolean,
		contractType: Number
	},
	data() {
		return {
			data: {
				service_record: []
			},
			spin: true,
			isfetching: 0,
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
			changeRecord: []
		};
	},
	watch: {
		show(val, old) {
			val && this.isfetching === 0 && this.loadData();
		},
		contractId() {
			this.loadData();
		}
	},
	created() {
		this.show && this.loadData();
	},
	mounted() {
		this.$vc.on('remain-refresh', (res) => {
			this.loadData();
		});
	},
	beforeDestroy() {
		this.$vc.off('remain-refresh');
	},
	methods: {
		loadData() {
			this.spin = false;
			this.isfetching = 1;
			this.$request({
				url: "_SALE_CONTRACT_SERVICE_AMOUNT_GET",
				type: "GET",
				param: { contract_id: this.contractId, contract_type: this.contractType },
				loading: false,
			}).then(res => {
				this.serviceData = res.data;
				this.serviceData.stage_list.forEach(item => {
					item.stage = '第' + item.stage + "阶段 (" + item.start_time + '~' + item.end_time + ')';
					// item.score_name = item.score + (item.score == '-' ? '' : '分');
					// item.return_amount += (item.return_amount == '-' ? '' : '万');
					item.finish_num = item.finish_num + '/' + item.need_service_num + '项';
				});
				this.spin = true;
			}).catch((res) => {
				console.error(res);
				this.spin = true;
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
.v-finance-service-amount {
	._title-item {
		display: inline-block;
		min-width:300px;
		margin-top: 10px;
	}
	._konw-tip{
		position: absolute;
		right: 0px;
	}


}
.v-finance-service-amount-poptip{
	.ivu-poptip-inner {
		background:rgb(88, 94, 107);
			.ivu-poptip-body{
				background:rgb(88, 94, 107);
				border-radius: 4px;
				color: #fff;
				overflow-y: overlay;
				padding-right: 5px;
				padding-left: 5px;
			}
	}
	.ivu-poptip-arrow:after{
			border-left-color:  rgb(102, 102, 102) !important;
	}
	
}
</style>


