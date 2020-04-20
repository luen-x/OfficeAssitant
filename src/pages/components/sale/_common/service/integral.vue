<template>
	<div 
		:style="!return_info.length && !satisfaction_degree.length ? 'height:calc(100% - 60px);' : 'height:auto;'"
		class="g-relative"
	>
		<oa-loading v-if="loading"/>
		<div class="g-m-b-30 v-sale-service-integral">
			<div class="_detail-content">
				<div 
					v-if="!return_info.length && !satisfaction_degree.length" 
					class="g-flex g-jc-c g-ai-c"
					style="height:100%"
				>
					<div style="width:416px;">
						<img :src="OSS_SEARCH_EMPTY" >
						<div class="g-tc">
							<span>你暂时没有提交记录，提交可以得到积分和服务提成哦~</span>
							<span 
								v-if="!fromOther"
								class="g-c-blue-mid g-pointer" 
								@click="handleSubmit"
							>
								点击提交
							</span>
						</div>
					</div>
				</div>
				<div v-else>
					<div v-if="return_info.length">
						<div class="g-m-tb-20 g-fs-14">
							<span class="__title-bar"/>
							<span class="g-pd-l-5">客户回款信息</span>
						</div>
						<div class="_content g-m-r-20">
							<i-table :columns="returnInfo" :data="return_info" stripe/>
						</div>
					</div>
					<div v-if="satisfaction_degree.length">
						<div class="g-m-tb-20 g-fs-14">
							<span class="__title-bar"/>
							<span class="g-pd-l-5">客户满意度</span>
						</div>
						<div class="_content g-m-r-20">
							<i-table :columns="satisfactionDegree" :data="satisfaction_degree" stripe/>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Table } from 'iview';
import Loading from '@components/_common/loading/loading';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { ServiceCertView } from './cert-view';
import { ServiceSubmitIntegral } from './submit-integral';

export default {
	name: "oa-service-integral",
	components: {
		'i-table': Table,
		'oa-loading': Loading
	},
	props: {
		contractCompanyId: [String, Number],
		fromOther: Boolean
	},
	data() {
		return {
			loading: false,
			return_info: [], // 客户回款信息
			satisfaction_degree: [], // 客户满意度
			OSS_SEARCH_EMPTY,
			returnInfo: [// 回款信息
				{
					title: '回款金额',
					key: 'return_amount',
					minWidth: 120
				},
				{
					title: '代理人数',
					key: 'agent_num',
					minWidth: 120
				},
				{
					title: '提交人',
					key: 'staff_name',
					minWidth: 150
				},
				{
					title: '凭证',
					key: 'fileImage',
					minWidth: 90,
					render: (h, params) => {
						return (
							<div>
								{
									params.row.fileImage.length 
										? <span 
											class="g-c-blue-mid g-pointer"
											onClick={() => { this.handleView(params.row, '客户回款凭证'); }}
										>
											查看
										</span> 
										: '--'
								}
							</div>
						);
					}
				},
				{
					title: '备注',
					key: 'remarks',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div>
								{
									params.row.remarks ? <AutoTooltip 
										content={params.row.remarks}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '--'
								}
							</div>
						);
					}
				},
				{
					title: '提交时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '审核结果',
					key: 'service_status',
					minWidth: 90,
					render: (h, params) => {
						return (
							<div>
								<span>
									{['待审核', '通过', '驳回', '已评分', '未评'][+params.row.service_status - 1]}
								</span>
							</div>
						);
					}
				},
				{
					title: '审核人',
					key: 'audit_staff_name',
					minWidth: 150
				},
				{
					title: '审核时间',
					key: 'service_audit_time',
					minWidth: 160
				},
				{
					title: '审核备注',
					key: 'service_audit_mark',
					minWidth: 160,
					render: (h, params) => {
						return (
							<div>
								{
									params.row.service_audit_mark ? <AutoTooltip 
										content={params.row.service_audit_mark}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '--'
								}
							</div>
						);
					}
				}
			],
			satisfactionDegree: [// 客户满意度
				{
					title: '提交内容',
					key: 'satis_type',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div>
								<AutoTooltip 
									content={['合作客户追加签单', '转介绍客户签单成交', '客户好评', '锦旗/授牌'][+params.row.satis_type - 1]}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '提交人',
					key: 'staff_name',
					minWidth: 150
				},
				{
					title: '凭证',
					key: 'cert',
					minWidth: 90,
					render: (h, params) => {
						return (
							<div>
								{
									params.row.fileImage.length 
										? <span 
											class="g-c-blue-mid g-pointer"
											onClick={() => { this.handleView(params.row, '客户满意度凭证'); }}
										>
											查看
										</span> 
										: '--'
								}
							</div>
						);
					}
				},
				{
					title: '备注',
					key: 'remarks',
					minWidth: 120,
					render: (h, params) => {
						return (
							<div>
								{
									params.row.remarks ? <AutoTooltip 
										content={params.row.remarks}
										theme="dark"
										placement="bottom"
										labelClass="g-c-black3"
									/> : '--'
								}
							</div>
						);
					}
				},
				{
					title: '提交时间',
					key: 'create_time',
					minWidth: 160
				}
			]
		};
	},
	watch: {
		contractCompanyId() {
			this.$emit('reset');
			this.loadData();
		}
	},
	mounted() {
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loading = true;
			this.return_info = [];
			this.satisfaction_degree = [];
			this.$request({
				url: '_SALE_SERVICE_INTEGRAL_INDEX_DETAIL_GET',
				type: 'GET',
				loading: false,
				param: {
					contract_company_id: this.contractCompanyId
				},
				autoTip: false
			}).then(res => {
				this.loading = false;

				if (res.data.return_info.length) {
					this.return_info = res.data.return_info;
				}

				if (res.data.satisfaction_degree.length) {
					this.satisfaction_degree = res.data.satisfaction_degree;
				}
			}).catch(error => {
				this.loading = false;
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 查看凭证
		 */
		handleView(row, title) {
			ServiceCertView.popup({
				title,
				fileImage: row.fileImage.map(it => ({
					title: it.img_url.substr(it.img_url.lastIndexOf('/') + 1),
					type: it.img_url.substr(it.img_url.lastIndexOf('.')), 
					url: it.img_url
				}))
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 提交积分指标
		 */
		handleSubmit() {
			ServiceSubmitIntegral.popup({
				contractCompanyId: this.contractCompanyId
			}).then(() => {
				this.loadData();
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};

export const ServiceIntegral = module.exports.default;

</script>

<style lang="scss">
.v-sale-service-integral {
	width: 100%;
	height: 100%;
	._content {
		.__item {
			width: 100%;
			border-radius: 5px;
			border: 1px solid #e8e8e8;
			.__top{
				background-color: #f5f5f6;
			}
			.__img {
				img {
					width: 60px;
					height: 60px;
					border: 1px solid #d4d7db;
				}
			}
			.__tip {
				color: #818794;
			}
			.__audio {
				width: 100%;
				height: 30px;
				background-color: #f5f5f6;
				line-height: 30px;
			}
			.__target {
				max-width: 220px;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
	._detail-content {
		padding: 0 16px;
		height: 100%;
		.__title-bar {
			display: inline-block;
			width: 2px;
			height: 14px;
			position: relative;
			top: 2px;
			background-color: #e84854;
		}
	}
	._more {
		width: 100px;
	}
	.ivu-table th {
		font-weight: normal;
	}
	.ivu-poptip-rel{
		display: inline;
	}
	.ivu-table-cell {
		white-space: nowrap;
	}
}
</style>
