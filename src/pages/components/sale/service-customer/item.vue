<template>
	<div :key="id" class="v-sale-service-item">
		<div class="_top g-flex g-jc-sb g-ai-fs">
			<div class="g-fs-14">
				<span 
					class="g-operation g-c-blue-mid" 
					@click="handleDetail"
				>
					{{ contract_company_name }}
				</span>
				<span 
					v-if="+last_time > 0 && +last_time <= 30 && id !== '2' && id !== '3'"
					style="color: #d9444f"
					class="g-pd-l-5"
				>
					还剩{{ last_time }}天到期
				</span>
				<span 
					v-if="is_remind === 1 && id !== '2' && id !== '3'" 
					class="g-bg-red-mid g-fs-12" 
					style="border-radius: 2px;padding: 1px 5px;"
				>
					需跟进
				</span>
				<span 
					v-if="id === '3' && invalid_type" 
					class="g-bg-red-mid g-fs-12" 
					style="border-radius: 2px;padding: 1px 5px;"
				>
					{{ ['客户退款失效', '暂停服务失效'][+invalid_type - 1] }}
				</span>
			</div>
			<vc-debounce-click
				v-if="sign_star === 1"
				tag="i"
				class="iconfont icon-star1 g-pointer"
				@click="handleStar"
			/>
			<vc-debounce-click
				v-else-if="sign_star === 0"
				tag="i"
				class="iconfont icon-star g-pointer"
				@click="handleStar"
			/>
		</div>
		<div class="_bottom g-flex g-jc-sb g-ai-fs">
			<div class="__left">
				<div class="__info g-flex">
					<div>
						<span class="g-c-black4">服务人：</span>
						<span class="__content">{{ staff_name || '--' }}</span>
					</div>
					<span class="g-m-lr-30 g-c-black7">|</span>
					<div>
						<span class="g-c-black4">最近服务时间：</span>
						<span class="__content">{{ last_service_time || '--' }}</span>
					</div>
					<span class="g-m-lr-30 g-c-black7">|</span>
					<div>
						<span class="g-c-black4">服务提成：</span>
						<span class="__content">
							<span style="color: #e84854">
								{{ send_quality_control_amount || '0.00' }}
							</span>
							<span style="color:#333">/{{ quality_control_amount || '0.00' }}</span>
						</span>
					</div>
				</div>
				<div class="__progress">
					<span class="g-c-black4">服务进度：</span>
					<i-progress 
						v-if="is_service_amount === 1"
						:percent="+service_progress" 
						status="active"
					/>
					<span v-else>该客户暂无服务提成~</span>
				</div>
				<div class="__to">
					<span class="g-c-black4">可做服务项：</span>
					<span class="__content">{{ waite_service_item }}</span>
					<span 
						v-if="$auth[488]"
						class="g-m-l-10 g-pointer g-c-blue-mid" 
						@click="handleDoService"
					>
						点击查看更多
					</span>
				</div>
			</div>
			<div class="__right g-flex g-jc-fe g-ai-fe">
				<i-button 
					v-if="$auth[488]"
					type="primary" 
					class="__btn g-m-l-10" 
					@click="handleDoService"
				>
					做服务
				</i-button>
				<i-select
					ref="my-select"
					class="g-m-l-10"
					placeholder="更多"
					clearable
					transfer
					@on-change="handleChange"
				>
					<i-option 
						v-if="$auth[494]" 
						:value="1"
					>
						提交回款/满意度信息
					</i-option>
					<i-option 
						v-if="id !== '1' && id !== '2' && enable_open" 
						:value="2"
					>
						开启服务
					</i-option>
					<i-option 
						v-if="(id !== '2' && id !== '3' && !enable_open) && $auth[495]" 
						:value="3"
					>
						申请暂停服务
					</i-option>
				</i-select>
			</div>
		</div>
	</div>
</template>

<script>
import { Progress, Button, Select, Option } from 'iview';
import { Confirm } from '@components/_common/confirm/confirm';
import { ServiceDetail } from "../_common/service/detail";
import { ServiceStop } from "../_common/service/stop";
import { ServiceSubmitIntegral } from '../_common/service/submit-integral';

export default {
	name: "oa-service-item",
	components: {
		'i-progress': Progress,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		id: [String, Number],
		last_time: [String, Number],
		sign_star: [String, Number],
		staff_name: String,
		is_remind: [String, Number],
		apply_id: [String, Number],
		enable_open: [String, Number],
		invalid_type: [String, Number],
		last_service_time: String,
		is_service_amount: [String, Number],
		customer_type: [String, Number],
		service_progress: [String, Number],
		contract_company_id: [String, Number],
		waite_service_item: [String, Number],
		send_quality_control_amount: [String, Number],
		quality_control_amount: [String, Number],
		customer_service_id: [String, Number],
		contract_company_name: String,
	},
	data() {
		return {};
	},
	methods: {
		/**
		 * 点击更多
		 */
		handleChange(value) {
			switch (value) {
				case 1:
					ServiceSubmitIntegral.popup({
						contractCompanyId: this.contract_company_id
					}).then(() => {
						this.$emit('reload');
					}).catch(error => {
						error && console.error(error);
					});
					this.$refs["my-select"].clearSingleSelect();
					break;
				case 2:
					this.handleStart();
					this.$refs["my-select"].clearSingleSelect();
					break;
				case 3:
					this.handleStop();
					this.$refs["my-select"].clearSingleSelect();
					break;
				default:
					break;
			}
		},
		/**
		 * 跳转详情
		 */
		handleDetail() {
			if (this.$auth[486]) {
				ServiceDetail.popup({
					type: this.id,
					enableOpen: this.enable_open,
					customerServiceId: this.customer_service_id,
					contractCompanyId: this.contract_company_id,
					pathName: 'sale-service-customer-do'
				}).then(res => {
					if (res.status === 1) {
						this.$emit('reload');
					}
				}).catch(error => {
					error && console.error(error);
				});
			} else {
				this.$Message.warning('您没有权限查看详情');
			}
		},
		/**
		 * 点击做服务或查看更多
		 */
		handleDoService() {
			this.$router.push({ 
				name: "sale-service-customer-do",
				query: {
					contractCompanyId: this.contract_company_id,
					customerServiceId: this.customer_service_id,
					pathName: 'sale-service-customer-do'
				}
			});
		},
		/**
		 * 标星
		 */
		handleStar() {
			this.$request({
				url: '_SALE_SERVICE_SIGN_STAR_POST',
				type: 'POST',
				loading: false,
				param: {
					customer_service_id: this.customer_service_id
				},
				autoTip: true
			}).then(res => {
				this.$store.commit('SALE_SERVICE_CUSTOMER_LIST_INIT');
			}).catch(error => {});
		},
		/**
		 * 暂停服务
		 */
		handleStop() {
			this.$request({
				url: '_SALE_SERVICE_APPLY_GET',
				type: "GET",
				loading: false,
				param: {
					contract_company_id: this.contract_company_id
				},
				autoTip: false
			}).then(res => {
				if (res.data.apply_status) {
					Confirm.popup({
						title: '申请暂停服务',
						msg: '你发起的暂停服务申请正在审核阶段，请在服务申请中查看审核进度'
					}).catch(error => {
						error && console.error(error);
					});
				} else if (res.data.level === 1 || res.data.level === 2) {
					ServiceStop.popup({
						auditSchedule: res.data.audit_schedule,
						contractCompanyId: this.contract_company_id
					}).then(() => {
						this.$emit('reload');
					}).catch(error => {
						error && console.error(error);
					});
				} else {
					Confirm.popup({
						title: '申请暂停服务',
						msg: '确认暂停该客户的服务？'
					}).then(() => {
						this.$request({
							url: '_SALE_SERVICE_STOP_POST',
							type: "POST",
							loading: false,
							param: {
								contract_company_id: this.contract_company_id
							},
							autoTip: true
						}).then(() => {
							this.$emit('reload');
						}).catch(error => {});
					}).catch(error => {
						error && console.error(error);
					});
				}
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 开启服务
		 */
		handleStart() {
			Confirm.popup({
				title: '开启服务确认',
				msg: '确认重新开启该客户的服务？'
			}).then(() => {
				this.$request({
					url: '_SALE_SERVICE_OPEN_APPLY_POST',
					type: "POST",
					loading: false,
					param: {
						contract_company_id: this.contract_company_id
					},
					autoTip: true
				}).then(() => {
					this.$emit('reload');
				}).catch(error => {});
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};
</script>
<style lang="scss">
.v-sale-service-item {
	border: 1px solid #e8e8e8;
	&:hover {
		box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
	}
	._top {
		width: 100%;
		height: 30px;
		line-height: 30px;
		i {
			font-size: 24px;
			color: #ed8f4a;
		}
	}
	._bottom {
		width: 100%;
		height: 90px;
		line-height: 30px;
		.__right {
			height: 100%;
		}
		.__btn {
			height: 32px;
			line-height: 16px;
		}
	}
	.g-operation {
		font-size: 14px;
	}
	.ivu-select {
		width: 60px;
		color: #e84854;
	}
	.ivu-progress{
		width: 300px;
	}
	.ivu-select-selection {
		border: 1px solid #e84854;
		box-shadow: none;
	}
	.ivu-icon-ios-arrow-down:before {
		color: #e84854;
	}
	.ivu-select-placeholder {
		color: #e84854!important;
	}
}
</style>
