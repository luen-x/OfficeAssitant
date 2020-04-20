<template>
	<div class="v-finance-services-situation">
		<oa-loading v-if="spin" />

		<div v-else>
			<div v-if="list.length">
				<div
					v-for="(item, companyIndex) in list"
					:key="companyIndex"
					class="_company_item">
					<oa-title :show-type="companyIndex === 0" class="g-m-b-20">
						<span slot="title">
							<span style="color: #000;">{{ item.contract_company_name }}（开始合作日期：{{ item.create_time }}）</span>
							<span 
								v-if="item.is_assist"
								style="padding: 2px 5px 2px 5px; background-color: #e84854;color: #fff;border-radius: 3px;"
							>辅助</span>
						</span>
						<div slot="content" class="g-m-t-20">
							<div v-if="item.contract_info.length !== 0">
								<!-- 合同详情 -->
								<div
									v-for="(it, index) in item.contract_info"
									:key="index"
									class="_item g-m-b-10">

									<div
										class="_header g-fs-14 g-c-black3 g-pd-l-15"
										@click="handleToggle(companyIndex, index)">
										<span class="g-c-black-dark g-pointer g-pd-r-5">
											<i
												:class="it.show ? 'icon-triangle-up' : 'icon-triangle-down'"
												class="iconfont g-fs-12 g-c-black-mid"
											/>
										</span>
										<!-- 合同编号：（已失效）、 -->
										<span
											v-for="(info, i) of it.contract"
											:key="info.contract_id"
										>
											<span v-if="i">、</span>
											合同编号: {{ info.contract_type_name }}
											{{ info.contract_num }}
											<span v-if="info.invalid_type === 1" style="color: red;">
												失效
											</span>
										</span>
									</div>

									<vc-expand
										:ref="`contract${companyIndex}-${index}`"
										v-model="it.show"
									>
										<div class="_desc g-flex g-ai-c">
											<div class="_left g-fs-12 g-c-black3 g-lh-32 g-m-l-20">
												<i-row>
													<i-col span="12">
														合作项目：
														<i-tooltip
															v-if="it.product_names.length > 15"
															:content="it.product_names"
															placement="bottom"
															max-width="200"
															transfer
														>
															{{ it.product_names.slice(0,15) + "...." }}
														</i-tooltip>
														<span v-else>{{ it.product_names }}</span>
													</i-col>
													<i-col span="12">总实付金额：
														<span>{{ it.payment_amount }}</span>
													</i-col>
												</i-row>
												<i-row>
													<i-col span="12">服务提成：
														<span>{{ it.need_service_amount_total }}</span>
													</i-col>
													<i-col span="12">已发服务提成：
														<span v-if="it.service_amount_total == '0.00'">{{ it.service_amount_total }}</span>
														<i-tooltip v-else transfer>
															<span class="g-c-blue-mid g-pointer">{{ it.service_amount_total }}</span>
															<div slot="content">
																<div 
																	v-for="(e, index1) in it.service_amount_grant_assign"
																	:key="index1"
																>
																	{{ e.staff_name + '：' + e.service_amount + '元' }}
																</div>
															</div>
														</i-tooltip>
													</i-col>
												</i-row>
											</div>
											<i-poptip 
												transfer 
												trigger="click"
												placement="left-start"
												width="320"
												word-wrap
												popper-class="v-finance-services-situation"
												@on-popper-show="handleServiceRecord(it.contract_id)"
											>
												<span 
													class="g-red-btn-line"
												>
													服务提成变更记录
												</span>
												<oa-record 
													slot="content" 
													:records="popContent[it.contract_id]"
												>
													<div slot-scope="{data}" style="margin-top: -18px;">
														<div class="g-flex">
															<span>{{ data.create_time }}</span>
															<span class="g-m-l-10">{{ data.type_name }}</span>
														</div>
														<div>{{ data.content }}</div>
													</div>
												</oa-record>
											</i-poptip>
										</div>
										<i-table :columns="columns" :data="it.stage_list" stripe/>
									</vc-expand>

								</div>

							</div>

							<div v-else class="_empty g-flex g-fd-c g-ai-c g-jc-c">
								<img :src="OSS_NO_MESSAGE02">
								<div class="g-fs-12 g-tc g-m-t-10" style="width: 301px;">该客户暂时还未上传任何服务项</div>
							</div>
						</div>
					</oa-title>
				</div>
			</div>
			<div v-else class="_blank">
				<img :src="OSS_NO_MESSAGE03" style="width: 301px;height: 232px;">
	
				<div class="g-m-t-30" style="width: 301px;text-align:center;">
					<span class="g-fs-14">暂无服务提成记录</span>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
import { Table, Tooltip, Row, Col, Poptip, Button } from "iview";
import { OSS_NO_MESSAGE02, OSS_NO_MESSAGE03 } from "@constants/constants";
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import API_ROOT from "@stores/apis/root";
import { Expand } from 'wya-vc';
import { VoucherModal } from "../../../sc/_common/service-manage-detail/voucher";
import Title from './title';
import Record from './service-record';

export default {
	name: 'finance-services-commission',
	components: {
		'i-table': Table,
		'i-tooltip': Tooltip,
		'i-row': Row,
		'i-col': Col,
		'vc-expand': Expand,
		'oa-title': Title,
		'i-poptip': Poptip,
		'i-button': Button,
		'oa-record': Record
	},
	props: {
		// list: Array
		info: Object
	},
	data() {
		return {
			popContent: {},
			OSS_NO_MESSAGE02,
			OSS_NO_MESSAGE03,
			spin: true,
			columns: [
				{
					title: "服务阶段",
					key: "create_time",
					minWidth: 200,
					render: (h, params) => {
						return (
							<span>
								第{params.row.stage}阶段
								({params.row.start_time} - {params.row.end_time})
							</span>
						);
					}
				},
				{
					title: "服务提成",
					key: "staff_name",
					minWidth: 100,
					render: (h, params) => {
						let isAssign = params.row.is_grant !== 0;
						return (
							<div>
								{ isAssign && <Tooltip
									transfer={true}>
									<span class="g-c-blue-mid g-pointer">
										{params.row.service_amount}/{params.row.need_service_amount}
									</span>
									<div slot="content">
										{
											params.row.service_amount_assign.map(v => {
												return (
													<Row>
														<Col span={24}>{v.staff_name}：{v.service_amount}</Col>
													</Row>
												);
											})
										}
									</div>
								</Tooltip>}
								{ !isAssign && <span>{params.row.service_amount}/{params.row.need_service_amount}</span> }
							</div>
						);
					}
				},
				{
					title: "质检评分",
					key: "score",
					minWidth: 80,
					render: (h, params) => {
						let score = params.row.score !== '-' ? params.row.score : '--';
						return (
							<span>{score}</span>
						);
					}
				},
				{
					title: "回款金额",
					key: "return_amount",
					minWidth: 80,
					render: (h, params) => {
						let return_amount = params.row.return_amount !== '-' ? params.row.return_amount : '--';
						return (
							<span>{return_amount}</span>
						);
					}
				},
				{
					title: "服务完成情况",
					key: "finish_num",
					minWidth: 80,
					render: (h, params) => {
						return (
							<span>{params.row.finish_num}/{params.row.need_service_num}项</span>
						);
					}
				},
				{
					title: "发放状态",
					key: "status",
					minWidth: 80,
					render: (h, params) => {
						let obj = {
							'0': '未发',
							'1': '已发',
							'2': '部分发放'
						};
						return (
							<span>{obj[params.row.is_grant]}</span>
						);
					}
				}
			],
			list: []
		};
	},
	mounted() {
		this.loadData();
	},
	methods: {
		handleServiceRecord(contract_id) {
			if (this.popContent[contract_id]) return;
			this.$request({
				url: API_ROOT._SALE_SERVICE_AMOUNT_CHANGE_RECORD_GET,
				type: 'GET',
				loading: false,
				param: {
					contract_id
				},
				autoTip: false
			}).then(res => {
				if (res.data.length) {
					this.$set(this.popContent, contract_id, res.data);
				} else {
					this.$set(this.popContent, contract_id, [{ type_name: '暂无服务提成变更记录' }]);
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleToggle(comIndex, index) {
			this.$refs[`contract${comIndex}-${index}`][0].toggle();
			this.$forceUpdate();
		},
		loadData() {
			this.$request({
				url: '_FINANCE_SERVICE_AMOUNT_DETAIL_GET',
				type: 'GET',
				param: {
					staff_id: this.info.staff_id
				}
			}).then(res => {
				res.data.forEach((v, index1) => {
					v.contract_info.forEach((e, index) => {
						!index1 && !index ? e.show = true : e.show = false;
					});
				});
				this.list = res.data;
				this.spin = false;
			}).catch(err => {

			});
		}
	}
};
</script>

<style lang="scss" scoped>
.v-finance-services-situation {
	min-height: 500px;
	position: relative;
	._company_item {
		._item {
			border: 1px solid #E8E8E8;
			._header {
				height: 40px;
				line-height: 40px;
				background: #F0F4FC;
			}
			._desc {
				height: 84px;
				padding: 10px;
				._left {
					flex: 1;
				}
			}
		}
	}

	._empty{
		height: 156px;
		background: rgba(250,250,250,1);
		img {
			width: 100px;
			height: 100px;
		}
	}
	._blank{
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-70%);
		-webkit-transform: translate(-50%,-70%);
	}
}
</style>

<style lang="scss">
.v-finance-services-situation {
	padding-bottom: 50px;
	.ivu-table-wrapper {
        border: none;
    }

    .ivu-table {
        th,td {
            border: none;
        }
    }

    .ivu-table:after {
        width: 0;
    }

    .ivu-table:before {
        height: 0;
    }
}
</style>

