<template>
	<div class="v-hr-archives-employee-customer-detail g-pd-20">
		<div class="_company-info g-pd-lr-30">
			<i-row class="g-fs-16 g-c-black1" style="line-height: 56px;">
				{{ info.company_name }}（{{ info.sale_status === 1 ? '服务中' : (info.sale_status === 3 ? '已到期' : '已失效') }}）
			</i-row>
			<i-row class="g-fs-14 g-lh-34">
				<span class="g-c-black4" style="margin-right: 50px">
					客户姓名：
					<span class="g-c-black2">{{ info.customer_name }}</span>
				</span>
				<span class="g-c-black4" style="margin-right: 50px">
					邀约人：
					<span class="g-c-black2">{{ info.staff_name }}</span>
				</span>
				<span class="g-c-black4" style="margin-right: 50px">
					部门：
					<span class="g-c-black2">{{ info.depart_name }}</span>
				</span>
			</i-row>
		</div>
		<div
			v-if="info.customer_type === 1 && info.list"
			class="_contract-info g-m-t-20">
			<div
				v-for="(con, index) in info.list"
				:key="con.contract_id"
				class="_contract-item g-m-b-20">
				<div
					class="_header g-fs-14 g-pd-lr-20 g-pd-tb-10 g-pointer g-flex-ac g-jc-sb"
					@click="handleToggle(`contract${index}`)">
					<div>
						<div class="g-c-black6 g-lh-34">
							合同编号：{{ con.contract_num }}
						</div>
						<div class="g-lh-34">
							<span class="g-c-black4">
								产品：{{ con.product_names }}
							</span>
							<i-divider type="vertical"/>
							<span class="g-c-black4">
								下单时间：{{ con.order_time }}
							</span>
							<i-divider v-if="con.status === 3" type="vertical"/>
							<span style="color: #e84c57;">
								{{ con.status === 3 ? '已失效' : '' }}
							</span>
						</div>
					</div>
					<span v-if="(con.service_stage && con.service_stage.length) || con.contract_items.length">
						{{ con.show ? '收起' : '展开' }}
						<i
							:class="con.show ? 'icon-triangle-up' : 'icon-triangle-down'"
							class="iconfont g-m-l-5 g-fs-10"
							style="color: #666;"
						/>
					</span>
				</div>
				<vc-expand
					v-if="(con.service_stage && con.service_stage.length) || con.contract_items.length"
					:ref="`contract${index}`"
					v-model="con.show" >

					<!-- 常规 -->
					<div v-if="con.type === 1" class="g-pd-20 g-pd-t-10">
						<div
							v-for="(item, index1) in con.service_stage"
							:key="index1"
							:class="index1 === con.service_stage.length - 1 ? 'g-m-b-12' : 'g-m-b-20'">
							<div
								class="_stage-header g-fs-12 g-pd-r-20 g-c-black6 g-flex-ac g-jc-sb g-pointer"
								@click="handleToggle(`stage${index1}`, index)">
								<div style="margin-left: 60px">
									<div class="g-c-black g-lh-24 g-fs-14">
										{{ item.stage_name }}
									</div>
									<div class="g-c-black6 g-lh-22">
										{{ item.start_time }} ~ {{ item.end_time }}
									</div>
								</div>
								<i
									v-if="item.items && item.items.length"
									:class="item.show ? 'icon-triangle-up' : 'icon-triangle-down'"
									class="iconfont g-m-l-5 g-fs-10 g-fr"
									style="color: #666;"
								/>
								<div class="_remark g-absolute g-m-l-10 g-bg-red-mid">
									{{ item.stage }}
									<div class="_square"/>
								</div>
							</div>
							<vc-expand
								v-if="item.items && item.items.length"
								:ref="`stage${index1}`"
								v-model="item.show"
							>
								<div>
									<div
										v-for="service in item.items"
										:key="service.service_item_id"
										class="g-pd-lr-20 g-c-black6 g-flex-ac g-jc-sb"
										style="border-bottom: 1px solid #E5E5E5;line-height: 60px">

										<div class="g-flex">
											<div style="transform: rotate(180deg)">
												<i
													class="iconfont icon-gantan g-fs-16"
													style="color: #BBBBBB;"
												/>
											</div>
											<span v-if="service.set_type === 1" class="g-m-l-10">
												{{ service.service_name }}（{{ service.now_service_times }}/{{ service.required_service_times }}）
											</span>
											<span v-else-if="service.set_type === 2" class="g-m-l-10">
												{{ service.service_name }}（选做）
											</span>
											<span v-else class="g-m-l-10">
												{{ service.service_name }}
											</span>
											<span class="g-m-l-20">{{ service.is_close === 1 ? '已关闭' : '' }}</span>
										</div>

										<i-button
											v-if="$auth[1112]"
											type="primary"
											@click="handleWatchDetail(service)">
											查看
										</i-button>

									</div>
								</div>
							</vc-expand>
						</div>
					</div>
					<!-- 服务项在合同下面 -->
					<div v-if="con.type === 2" class="g-pd-lr-20 g-pd-b-20">
						<div
							v-for="(item, index1) in con.contract_items"
							:key="index1"
							class="_contract-service g-pd-lr-20 g-c-black6 g-flex-ac g-jc-sb"
							style="border-bottom: 1px solid #E5E5E5;line-height: 60px">

							<div class="g-flex">
								<div style="transform: rotate(180deg)">
									<i
										class="iconfont icon-gantan g-fs-16"
										style="color: #BBBBBB;"
									/>
								</div>
								<span class="g-m-l-10">
									{{ item.service_name }}
								</span>
								<span
									v-if="item.set_type === 1"
									class="g-fs-14"
									style="color:#484F57"
								>
									（{{ item.reference_num }}次/{{ item.reference_period }}个月）
								</span>
								<span v-else-if="item.set_type === 2">（选做）</span>
								<span class="g-m-l-20">{{ item.is_close === 1 ? '已关闭' : '' }}</span>
							</div>
							<i-button
								v-if="$auth[1112]"
								type="primary"
								@click="handleWatchDetail(item)">
								查看
							</i-button>
						</div>
					</div>
				</vc-expand>
			</div>
		</div>
		<!-- 服务项在公司下面 -->
		<div
			v-if="info.customer_type === 2 && serviceList.length"
			class="_only-service g-m-t-20 g-pd-20 g-pd-t-10">
			<div
				v-for="(item, index) in serviceList"
				:key="index"
				class="_company-service g-pd-lr-20 g-c-black6 g-flex-ac g-jc-sb"
				style="border-bottom: 1px solid #E5E5E5;line-height: 60px">

				<div class="g-flex">
					<div style="transform: rotate(180deg)">
						<i
							class="iconfont icon-gantan g-fs-16"
							style="color: #BBBBBB;"
						/>
					</div>
					<span class="g-m-l-10">
						{{ item.service_name }}
					</span>
					<span v-if="item.set_type === 1">
						<span
							v-if="item.is_show_reference"
							class="g-fs-14"
							style="color:#484F57"
						>
							（{{ item.reference_num }}次/{{ item.reference_period }}个月）
						</span>
					</span>
					<span v-else-if="item.set_type === 2">（选做）</span>
					<span class="g-m-l-20">{{ item.is_close === 1 ? '已关闭' : '' }}</span>
				</div>
				<i-button
					v-if="$auth[1112]"
					type="primary"
					@click="handleWatchDetail(item)">
					查看
				</i-button>
			</div>
		</div>
	</div>
</template>

<script>
import { Expand } from "wya-vc";
import { Button, Row, Col, Divider } from 'iview';
import { PModal } from './popup/modal';
import { DelTipModal } from '../_common/delete-tip';

export default {
	name: 'oa-content',
	components: {
		"i-row": Row,
		"i-col": Col,
		"i-button": Button,
		"vc-expand": Expand,
		"i-divider": Divider
	},
	data() {
		return {
			info: {},
			serviceList: []
		};
	},
	created() {
		const { query } = this.$route;
		this.$request({
			url: 'HR_ARCHIVES_EMPLOYEE_CUSTOMER_DETAIL_POST',
			type: 'POST',
			param: {
				// 1330 1224 哲国平仄医疗化妆品有限公司(1076) 啃老1347
				contract_company_id: query.contract_company_id
			},
		}).then((res) => {
			this.info = res.data;
			if (this.info.customer_type === 1) {
				if (this.info.list && this.info.list.length) {
					this.info.list.forEach((item, index) => {
						this.info.list[index].show = false;
					});
				}
				if (this.info.list && this.info.list.service_stage && this.info.list.service_stage.length) {
					this.info.list.service_stage.forEach((item, index) => {
						this.info.list.service_stage[index].show = false;
					});
				}
			} else if (this.info.customer_type === 2 && res.data.company_service_item) {
				this.serviceList = res.data.company_service_item;
			}

		}).catch((error) => {
		});
	},
	methods: {
		// getConStatus(status) {
		// 	switch (status) {
		// 		case '0':
		// 			return '待审核';
		// 		case '1':
		// 			return '已通过';
		// 		case '2':
		// 			return '未通过';
		// 		case '3':
		// 			return '已失效';
		// 		default:
		// 			break;
		// 	}
		// },
		handleToggle(name, index) {
			if (index || index === 0) { 	// 服务项展开收起
				let arr = [];
				// 合同存在无服务项的情况
				Object.keys(this.$refs).forEach((item, i) => {
					if (item.indexOf('contract') !== -1) {
						arr.push(+item.split('contract')[1]);
					}
				});
				this.$refs[name] ? this.$refs[name][arr.findIndex(item => item === index)].toggle() : '';
			} else { 	// 合同展开收起
				this.$refs[name] ? this.$refs[name][0].toggle() : '';
			}
			this.$forceUpdate();
		},
		handleWatchDetail(ser) {
			this.$request({
				url: 'HR_ARCHIVES_EMPLOYEE_SERVICE_DETAIL_GET',
				type: 'GET',
				param: {
					// this.info.service_item_id 39366
					service_item_id: ser.service_item_id
				},
			}).then((res) => {
				if (res.data.length) {
					PModal.popup({
						detail: res.data
					}).then(() => {
					}).catch(err => {});
				} else {
					DelTipModal.popup({
						title: '提示',
						content: '此服务项暂未提交服务凭证'
					}).then(() => {
					}).catch(() => {});
				}
			}).catch((error) => {
			});
		}
	},
};
</script>

<style lang="scss">
.v-hr-archives-employee-customer-detail {
	._company-info {
		width: 100%;
		height: 100px;
		background:#FAFAFA;
	}
	._contract-info {
        ._contract-item  {
            border-radius:4px;
            border:1px solid rgba(232, 232, 232, 1);
            box-shadow:0px 3px 10px 0px rgba(148,148,148,0.15);
            ._header {
                border-radius:4px;
                border-top-left-radius: 4px;
                border-top-right-radius: 4px;
				.ivu-divider {
					background-color: #e8eaec !important;
					margin: 0 10px;
				}
            }
            ._stage-header {
                position: relative;
                padding-top: 10px;
                padding-bottom: 10px;
                background:rgba(248,248,249,1);
                ._remark {
                    width: 27px;
                    height: 30px;
                    top: 0;
                    padding-top: 3px;
                    color: #fff;
                    text-align: center;
                    font-size: 14px;
                    ._square {
                        position: absolute;
                        width: 15px;
                        height: 15px;
                        left: 5px;
                        transform: rotate(45deg);
                        background-color: #F8F8F9;
                        top: 24px;
                    }
                }
            }
        }
	}
	._only-service {
		border-radius:4px;
		background:rgba(255,255,255,0);
		border:1px solid rgba(232, 232, 232, 1);
		box-shadow:0px 3px 10px 0px rgba(148,148,148,0.15);
		._company-service {
		}
	}
}
</style>
