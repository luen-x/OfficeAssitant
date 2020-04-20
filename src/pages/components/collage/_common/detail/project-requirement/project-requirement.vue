<template>
	<div class="v-collage-project-requirement g-pd-l-20 g-m-t-30 g-relative">
		<div v-if="spin">
			<div v-if="invalid_show" class="g-m-b-30">
				<div class="g-m-t-30 g-pointer">
					<span 
						class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
						style="border-left: 2px solid #e84854;height: 16px;"
					>
						失效记录
					</span>
				</div>

				<div class="g-m-l-15">
					<oa-detail-item 
						:content="project_data.invalid_record.refund_type_name"
						class="g-m-t-30"
						label="失效原因"
					/>
					<oa-detail-item
						:content="project_data.invalid_record.create_time"
						class="g-m-t-30"
						label="失效时间"
					/>
				</div>
			</div>
			
			<div>
				<div class="g-flex g-jc-sb">
					<div>
						<span 
							class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
							style="border-left: 2px solid #e84854;height: 16px;"
						>
							款项信息
						</span>
						<template v-if="$auth[1813]">
							<span
								v-if="name === 'cooperate'"
								class="g-operation g-m-l-20"
								@click="handleSignRebuy"
							>
								标记复购
							</span>
							<span 
								v-if="tagData.is_repeat && name === 'cooperate'"
								class="g-operation g-m-l-10"
								@click="handleCancelRebuy"
							>
								取消标记
							</span>
						</template>
					</div>
					

					<i-button
						v-if="name === 'cooperate' && $auth[1814]"
						slot="extra" 
						type="primary"
						class="g-m-r-30"
						@click="handleRebuyRecord"
					>
						标记记录
					</i-button>
				</div>

				<div class="g-m-t-5 g-m-l-15">
					<oa-detail-item
						:content="project_data.contract_info.contract_amount"
						label="合同金额"
						class="g-m-t-15"
					/>
					<oa-detail-item 
						:content="project_data.contract_info.need_amount"
						label="应付金额"
						class="g-m-t-15"
					/>
					<oa-detail-item 
						:content="project_data.contract_info.payment_amount"
						label="实付金额"
						class="g-m-t-15"
					/>
					<oa-detail-item 
						:content="project_data.contract_info.last_amount"
						label="剩余尾款"
						class="g-m-t-15"
					/>
					<oa-detail-item
						:content="project_data.contract_info.total_need_cost_amount"
						label="产品成本"
						class="g-m-t-15"
					/>
					<oa-detail-item 
						:content="project_data.contract_info.total_cost_amount"
						label="实扣成本"
						class="g-m-t-15"
					/>
					<oa-detail-item 
						:content="project_data.contract_info.commission_performance"
						label="提成业绩"
						class="g-m-t-15"
					/>
					<oa-detail-item 
						:content="project_data.contract_info.service_amount"
						label="服务提成"
						class="g-m-t-15"
					/>
					<oa-detail-item 
						v-if="+tagData.repeat_amount>-1"
						:content="tagData.repeat_amount"
						label="复购金额"
						class="g-m-t-15"
					/>
				</div>
			</div>

			<div class="g-m-t-30">
				<div class="g-flex g-jc-sb">
					<div>
						<span 
							class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
							style="border-left: 2px solid #e84854;height: 16px;"
						>
							产品信息
						</span>
						<template v-if="$auth[1815]">
							<span
								v-if="name === 'cooperate'"
								class="g-operation g-m-l-20" 
								@click="handleSignRenew"
							>
								标记续费
							</span>
							<span 
								v-if="tagData.is_renew && name === 'cooperate'" 
								class="g-operation g-m-l-10" 
								@click="handleCancelRenew"
							>
								取消标记
							</span>
						</template>
					</div>

					<i-button
						v-if="name === 'cooperate' && $auth[1816]"
						slot="extra" 
						type="primary"
						class="g-m-r-10"
						@click="handleRenewRecord"
					>
						标记记录
					</i-button>
				</div>

				<div style="margin-right: 50px;">
					<div 
						class="g-m-t-30 g-pointer" 
						style="height: 50px;line-height: 50px;background: #F0F4FC;padding-left: 22px;"
						@click="handleToggle('soft_ware_expand')"
					>
						<i
							:class="show_software ? 'icon-triangle-down' : 'icon-triangle-up'"
							class="iconfont g-fs-10"
						/>
						<span style="margin-left: 22px;" class="g-fs-14">
							{{ project_data.project[0].product_name }}
						</span>
						<span style="margin: 0 68px;">
							标准价：{{ project_data.project[0].need_amount }}元
						</span>
						<span>
							成本：{{ project_data.project[0].need_cost_amount }}元
						</span>
						<span v-if="getRenewAmount(project_data.project[0].product_id)!=-1" class="g-m-l-30">
							续费金额： {{ getRenewAmount(project_data.project[0].product_id) }}
						</span>
					</div>

					<vc-expand ref="soft_ware_expand" v-model="show_software">
						<div class="g-relative" style="background: #FAFAFA;">
							<div
								:style="{top: show ? '110px' : '20px'}"
								class="g-absolute g-inline-block" 
								style="width: 80px;right: 20px;top: 110px;"
							>
								<oa-product-label
									v-if="getRenewAmount(project_data.project[0].product_id)!=-1"
									:type="5"
									class="g-m-b-20"
								/>
								<template v-for="(item,index) in project_data.project[0].project_label">
									<oa-product-label
										:key="'me' + index"
										:name="['赠送','已更换','已退款','换后产品','续费产品'][item.value * 1 - 1]" 
										:color="['#ed8f4a','#2397f9','#4fc43d','#f97923','#7e23f9'][item.value * 1 - 1]" 
										class="g-m-b-20"
									/>
								</template>
							</div>

							<img 
								v-if="show" 
								:src="auditIcon[project_data.project[0].status]" 
								class="__audit-img"
							>

							<div 
								:style="project_data.project[0].status <= 1 ? {'padding-bottom' : '40px'} : ''" 
								class="g-pd-t-20 g-flex g-fw-w" 
								style="padding-left: 50px;"
							>
								<template v-for="(item,index) in project_data.project[0].sku">
									<oa-detail-item
										:key="index"
										:content="item.specs_name"
										:label="item.specs_label"
										class="g-m-t-15"
										style="width: 340px;"
									/>
								</template>
								<oa-detail-item
									:content="project_data.project[0].need_cost_amount"
									label="业绩金额"
									class="g-m-t-15"
									style="width: 340px;"
								/>
								<oa-detail-item
									:content="project_data.project[0].cost_amount"
									label="商学院金额"
									class="g-m-t-15"
									style="width: 340px;"
								/>
								<template v-for="(item,index) in project_data.project[0].project_request">
									<oa-detail-item
										:key="'index_' + index"
										:content="item.component_value"
										:label="item.component_label"
										:component_type="item.component_type"
										class="g-m-t-15"
										style="width: 340px;"
									/>
								</template>
							</div>
							<div v-if="project_data.project[0].status > 1" style="padding-bottom: 40px;">
								<span 
									class="g-block g-c-black2 g-fs-14 g-m-t-20 g-m-b-20"
									style="margin-left: 40px;"
								>
									审核信息
								</span>

								<div style="padding-left: 50px;">
									<oa-detail-item 
										:content="project_data.project[0].audit_staff_name"
										label="审核人"
										style="width: 340px;"
									/>
									<oa-detail-item 
										:content="project_data.project[0].audit_time"
										label="审核时间"
										style="width: 340px;"
									/>
									<oa-detail-item
										:content="project_data.project[0].audit_remark"
										:label="project_data.project[0].remark_explain"
										class="g-m-t-15"
										style="width: 340px;"
									/>
								</div>
							</div>
						</div>
					</vc-expand>
				</div>
			</div>

			<div 
				v-if="(name=='cooperate' || name =='refund') && project_data.finance_audit.status" 
				class="g-m-t-30"	
			>
				<span 
					class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					财务审核
				</span>

				<div class="g-m-l-15 g-m-t-15">
					<oa-detail-item 
						:content="project_data.finance_audit.audit_staff_name"
						label="审核人"
					/>
					<oa-detail-item
						:content="project_data.finance_audit.audit_time"
						label="审核时间"
					/>
					<oa-detail-item
						:content="project_data.finance_audit.audit_remark"
						:label="project_data.finance_audit.remark_explain"
						class="g-m-t-15"
					/>
				</div>
			</div>

			<div 
				v-if="(name=='cooperate' || name=='refund') && project_data.cost_record[0].list.length > 1" 
				class="g-m-t-30"
			>
				<span 
					class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
					style="border-left: 2px solid #e84854;height: 16px;"
				>
					成本修改记录
				</span>

				<div class="g-m-l-10" style="margin-right: 50px;">
					<div 
						class="g-m-t-30 g-pointer" 
						style="height: 50px;line-height: 50px;background: #F0F4FC;padding-left: 22px;"
						@click="handleToggle('cost_expand')"
					>
						<i
							:class="show_cost ? 'icon-triangle-down' : 'icon-triangle-up'"
							class="iconfont g-fs-10"
						/>
						<span style="margin-left: 22px;">成本修改记录</span>
					</div>

					<vc-expand ref="cost_expand" v-model="show_cost">
						<div style="background: #FAFAFA;padding-left: 54px;">
							<div class="g-c-black g-fs-14 g-pd-t-30 g-m-b-20">
								{{ project_data.cost_record[0].product_name }}
							</div>
							<oa-steps
								:data-source="project_data.cost_record[0].list"
								:type="1"
								:render-title="renderTitle"
								:render-content="renderContent"
							/>
						</div>
					</vc-expand>
				</div>
			</div>

			<div v-if="project_data.other_project.length > 0" class="g-m-t-30">
				<div class="g-m-b-30 g-pointer" @click="handleToggle('other_expand')">
					<span 
						class="g-fs-14 g-c-black3 g-inline-block g-lh-16 g-pd-l-10"
						style="border-left: 2px solid #e84854;height: 16px;"
					>
						合同内其他产品
					</span>
					<i
						:class="show_other ? 'icon-triangle-down' : 'icon-triangle-up'"
						class="iconfont g-fs-10"
					/>
				</div>

				<vc-expand ref="other_expand" v-model="show_other">
					<div 
						v-for="(item,index) in project_data.other_project" 
						:key="'we' + index" 
						class="g-m-b-10" 
						style="margin-right: 50px;"
					>
						<div 
							class="g-m-t-10 g-pointer" 
							style="height: 50px;line-height: 50px;background: #F0F4FC;padding-left: 22px;"
							@click="handleToggle(`expand_${index}`)"
						>
							<i
								:class="item.show ? 'icon-triangle-down' : 'icon-triangle-up'"
								class="iconfont g-fs-10"
							/>
							<span style="margin-left: 22px;">{{ item.product_name }}</span>
							<span style="margin: 0 68px;">
								标准价：{{ item.need_amount }}元
							</span>
							<span>
								成本：{{ item.need_cost_amount }}元
							</span>
						</div>
						<vc-expand :ref="`expand_${index}`" v-model="item.show">
							<div class="g-relative" style="background: #FAFAFA;">
								<div
									:style="{top: (name == 'cooperate' && showAudit(type, item.status) && type != 6) ? '110px' : '20px'}"
									class="g-absolute g-inline-block" 
									style="width: 80px;right: 20px;top: 110px;"
								>
									<template v-for="(element,id) in item.project_label">
										<oa-product-label
											:key="id"
											:name="['赠送','已更换','已退款','换后产品','续费产品'][element.value * 1 - 1]" 
											:color="['#ed8f4a','#2397f9','#4fc43d','#f97923','#7e23f9'][item.value * 1 - 1]"
											class="g-m-b-20"
										/>
									</template>
								</div>

								<img 
									v-if="name == 'cooperate' && showAudit(type, item.status) && type != 6" 
									:src="auditIcon[item.status]" 
									class="__audit-img"
								>

								<div
									:style="item.status <= 1 ? {'padding-bottom' : '40px'} : ''"
									class="g-pd-t-20 g-flex g-fw-w" 
									style="padding-left: 50px;"
								>
									<template v-for="(element,id) in item.sku">
										<oa-detail-item
											:key="'i' + id"
											:content="element.specs_name"
											:label="element.specs_label"
											class="g-m-t-15"
											style="width: 340px;"
										/>
									</template>
									<oa-detail-item
										:content="item.need_cost_amount"
										label="产品成本"
										class="g-m-t-15"
										style="width: 340px;"
									/>
									<oa-detail-item
										:content="item.cost_amount"
										label="实扣成本"
										class="g-m-t-15"
										style="width: 340px;"
									/>
									<template v-for="(element,id) in item.project_request">
										<oa-detail-item
											:key="id"
											:content="element.component_value"
											:label="element.component_label"
											:component_type="element.component_type"
											class="g-m-t-15"
											style="width: 340px;"
										/>
									</template>
								</div>
								<div v-if="item.status > 1" style="padding-bottom: 40px;">
									<span 
										class="g-block g-c-black2 g-fs-14 g-m-t-20 g-m-b-20"
										style="margin-left: 40px;"
									>
										审核信息
									</span>

									<div style="padding-left: 50px;">
										<oa-detail-item 
											:content="item.audit_staff_name"
											label="审核人"
											style="width: 340px;"
										/>
										<oa-detail-item 
											:content="item.audit_time"
											label="审核时间"
											style="width: 340px;"
										/>
										<oa-detail-item
											:content="item.audit_remark"
											:label="item.remark_explain"
											class="g-m-t-15"
											style="width: 340px;"
										/>
									</div>
								</div>
							</div>
						</vc-expand>
					</div>
				</vc-expand>
			</div>
		</div>

		<oa-loading v-else />
	</div>
</template>

<script>
import { DetailItem, Title } from "@components/sc/_common";
import { Icon, Collapse, Panel, Timeline, TimelineItem, Spin, Button } from "iview";
import { Expand } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import Steps from "@components/_common/steps/steps";
import ProductLabel from "@components/_common/product-label/product-label";
import { OSS_REJECT, OSS_PASS, OSS_WAIT_CONFIRM, OSS_ACTIVE } from "@constants/constants";
import { Confirm } from '@components/_common/confirm/confirm';
import { RebuySign } from '../../../../finance/_common/popup/rebuy-sign';
import { RebuySignRecord } from '../../../../finance/_common/popup/rebuy-sign-record';
import { RenewSign } from '../../../../finance/_common/popup/renew-sign';
import { RenewSignRecord } from '../../../../finance/_common/popup/renew-sign-record';

export default {
	name: "sc-cooperate-project-requirement",

	components: {
		"oa-title": Title,
		"oa-detail-item": DetailItem,
		"oa-steps": Steps,
		"oa-product-label": ProductLabel,
		"i-icon": Icon,
		"i-collapse": Collapse,
		"i-panel": Panel,
		"i-time-line": Timeline,
		"i-time-line-item": TimelineItem,
		"i-button": Button,
		"i-spin": Spin,
		"vc-expand": Expand
	},

	props: {
		type: String,
		project_id: Number,
		contract_id: Number,
		name: String
	},

	data() {
		return {
			project_data: {},
			value: "1",
			show_software: true,
			show_cost: true,
			show_other: false,
			spin: false,
			auditIcon: {
				1: OSS_WAIT_CONFIRM,
				2: OSS_PASS,
				3: OSS_PASS,
				4: OSS_PASS,
				5: OSS_REJECT,
			},
			tagData: {}
		};
	},

	computed: {
		invalid_show() {
			return (this.name === "cooperate" && this.type == 6) || (this.name === "service" && this.type == 3);
		},

		show() {
			return (this.name == 'cooperate' && this.showAudit(this.type, this.project_data.project[0].status) && this.type != 6);
		}
	},

	mounted() {
		this.loadData();
		this.loadTagData();
	},

	methods: {
		handleToggle(value) {
			this.$refs[value].length ? this.$refs[value][0].toggle() : this.$refs[value].toggle();
		},

		loadData() {
			this.spin = false;

			this.$request({
				url: API_ROOT._SALE_CONTRACT_PROJECT_GET,
				type: "GET",
				param: {
					project_id: this.project_id ? this.project_id : "",
					contract_id: this.contract_id
				},
				loading: false
			}).then(res => {
				res.data.other_project.forEach((item, index) => {
					item[`expand_show_${index}`] = false;
					item.show = false;
				});
				this.project_data = res.data;
				this.spin = true;
			}).catch(error => {
				console.log(error);
				this.$Message.error(error.msg);
				this.spin = true;
			});
		},

		renderTitle(h, params) {
			const { cost_amount, staff_name, create_time, need_cost_amount, type } = params.rows;

			return (
				<div>
					<div class="g-pd-l-10">
						<span class="g-m-r-30">{create_time}</span>
						{
							+type === 1
								? <span>{staff_name}</span>
								: null 
						}
					</div>
					<div class="g-m-t-5 g-pd-l-10">
						<span class="g-m-r-30">产品成本：{need_cost_amount}</span>
						<span>实扣成本：{cost_amount}</span>
					</div>
				</div>
			);
		},

		renderContent(h, params) {
			const { remark, type } = params.rows;

			if (+type === 1) {
				return (
					<div class="g-m-t-5 g-m-b-20 g-pd-l-10 g-c-black4">修改原因：{remark}</div>
				);
			} else {
				return (
					<div class="g-m-b-20"/>
				);
			}
		},

		showAudit(type, status) {
			switch (type) {
				case "1": return true;
				case "2": return true;
				case "3": return true;
				case "4": return true;
				case "5":
					if (status == 5) return true;
					else return false;
				default: return false;
			}
		},

		handleSignRebuy() {
			RebuySign.popup({
				repeatAmount: this.tagData.is_repeat && this.tagData.is_repeat == 1 
					? this.tagData.repeat_amount : this.project_data.contract_info.contract_amount,
				contractId: this.contract_id
			}).then(() => {
				this.loadTagData();
			}).catch(err => err && console.error(err));
		},

		loadTagData() {
			return this.$request({
				url: "_FINANCE_CUSTOMER_PROJECT_TAG_GET",
				type: "GET",
				param: {
					contract_id: this.contract_id
				},
				loading: false
			}).then(res => {
				this.tagData = res.data;
			}).catch((err) => {
				console.error(err);
			});
		},

		handleCancelRebuy() {
			Confirm.popup({
				title: '取消复购标记',
				msg: "确认取消复购标记吗？"
			}).then(() => {
				this.$request({
					url: "_FINANCE_CUSTOMER_REBUY_SIGN_CANCEL_POST",
					type: "GET",
					param: {
						contract_id: this.contract_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadTagData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(err => err && console.error(err));
		},
		handleRebuyRecord() {
			RebuySignRecord.popup({
				contractId: this.contract_id,
			}).catch(err => err && console.error(err));
		},
		handleSignRenew() {
			RenewSign.popup({
				contractId: this.contract_id,
				productList: this.project_data.project.map(it => ({ product_id: it.product_id, product_name: it.product_name })),
				renewProducts: this.tagData.renew_record
			}).then(() => this.loadTagData()).catch(err => err && console.error(err));
		},
		handleCancelRenew() {
			Confirm.popup({
				title: '取消续费标记',
				msg: "取消后，所有续费产品的续费标签将全部删除，是否确认取消？"
			}).then(() => {
				this.$request({
					url: "_FINANCE_CUSTOMER_RENEW_SIGN_CANCEL_POST",
					type: "GET",
					param: {
						contract_id: this.contract_id
					},
					loading: false,
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadTagData();
				}).catch((res) => {
					this.$Message.error(res.msg);
				});
			}).catch(err => err && console.error(err));
		},
		handleRenewRecord() {
			RenewSignRecord.popup({
				contractId: this.contract_id
			}).catch(err => err && console.error(err));
		},
		getRenewAmount(productId) {
			const exist = this.tagData.renew_record.find(it => it.product_id == productId);
			if (exist && exist.is_renew) {
				return exist.renew_amount;
			} else {
				return -1;
			}
		}

	}
};
</script>

<style lang="scss" scoped>
.v-collage-project-requirement {
	min-height: 300px;
	padding-bottom: 100px;

	.__audit-img {
		width: 120px;
		height: 120px;
		position: absolute;
		left: 710px;
		top: 0px;
		margin-top: -8px;
	}
}
</style>