
<template>
	<i-drawer
		v-model="visible"
		:mask="false"
		:mask-closable="false"
		class-name="v-sale-receive-drawer"
		@on-close="handleCancel"
	>
		<p slot="header">
			<span class="_header">{{ result.invoice_title }}</span>
		</p>
		<div class="_border"/>
		<div style=" padding-buttom: 14px;" class="v-ticketed-detail">
			<div class="g-flex">
				<div class="__detail-body page-detail-body">
					<oa-info-block
						title="基本信息"
						style="max-width: 670px;" >
						<oa-info-item :content="basicInfo.customer_name" label="客户姓名"/>
						<oa-info-item :content="basicInfo.contract_num" label="合同编号"/>
						<oa-info-item :content="basicInfo.customer_phone" label="客户电话"/>
						<oa-info-item :content="basicInfo.ratepayer_number" label="纳税人识别号"/>
						<oa-info-item :content="basicInfo.customer_address" label="客户地址"/>
						<oa-info-item :content="basicInfo.open_bank" label="开户行"/>
						<oa-info-item :content="basicInfo.project" label="合作项目"/>
						<oa-info-item :content="basicInfo.public_account" label="对公账号"/>
						<oa-info-item :content="basicInfo.invoice_type_name" label="发票类型"/>
						<oa-info-item :content="basicInfo.invoice_money" label="发票金额"/>
						<oa-info-item :content="basicInfo.invoice_title" label="发票抬头"/>
						<oa-info-item :content="basicInfo.payment_type_amount_name" label="汇款方式"/>
						<oa-info-item :content="basicInfo.our_company_name" label="我方合同公司">
							<i-tooltip
								v-if="basicInfo.our_company_name.length>16"
								:content="basicInfo.our_company_name"
								max-width="200"
								transfer>
								{{ basicInfo.our_company_name.substring(0,15)+"..." }}
							</i-tooltip>
						</oa-info-item>
						<oa-info-item v-if="!loading" :content="basicInfo.invoice_list" type="imgs" label="发票资料"/>
						<oa-info-item v-if="!loading" :content="basicInfo.voucher_list" type="imgs" label="打款凭证"/>
						<oa-info-item v-if="!loading" :content="basicInfo.contract_list" type="imgs" label="电子合同"/>
						<oa-info-item
							v-if="!loading&&payment_show"
							:content="basicInfo.entrusted_payment_list"
							type="imgs"
							label="委托付款三方协议"/>
					</oa-info-block>
					<oa-info-block
						v-if="result.status!=1"
						style="max-width: 670px;"
						title="审核处理"
					>
						<oa-info-item v-if="result.status==4" :content="handleInfo.audit_remark" label="驳回原因">
							<div v-if="handleInfo.audit_remark.length>16">
								<i-tooltip :content="handleInfo.audit_remark" max-width="200">
									{{ handleInfo.audit_remark.substring(0,15)+"..." }}
								</i-tooltip>
							</div>
						</oa-info-item>
						<oa-info-item v-else :content="handleInfo.audit_remark" label="通过说明">
							<i-tooltip
								v-if="handleInfo.audit_remark.length>16"
								:content="handleInfo.audit_remark"
								max-width="200"
								transfer>
								{{ handleInfo.audit_remark.substring(0,15)+"..." }}
							</i-tooltip>
						</oa-info-item>
						<oa-info-item :content="handleInfo.audit_staff_name" label="审核人"/>
						<oa-info-item :content="handleInfo.audit_time" label="操作时间"/>
					</oa-info-block>
					<oa-info-block
						v-if="result.status==3"
						style="max-width: 670px;"
						title="开票处理"
					>
						<oa-info-item :content="opendInfo.invoice_time" label="开票时间"/>
						<oa-info-item :content="opendInfo.invoice_code" label="发票代码"/>
						<oa-info-item :content="opendInfo.invoice_num" label="发票号码"/>
						<oa-info-item :content="opendInfo.amount" label="金额"/>
						<oa-info-item :content="opendInfo.tax_amount" label="税额"/>
						<oa-info-item :content="opendInfo.total_amount" label="总金额"/>
						<oa-info-item :content="opendInfo.open_holder_name" label="开票人"/>
						<oa-info-item :content="opendInfo.invoice_operate_time" label="开票操作时间"/>
					</oa-info-block>
					<oa-info-block
						v-if="result.receive_holder"
						style="max-width: 670px;"
						title="领票处理"
					>
						<oa-info-item :content="receiveInfo.invoice_number" label="开票份数"/>
						<oa-info-item :content="receiveInfo.receive_holder" label="领票人"/>
						<oa-info-item :content="receiveInfo.invoice_amount_sheets" label="开票张数"/>
						<oa-info-item :content="receiveInfo.receive_time" label="领票时间"/>
					</oa-info-block>
				</div>
			</div>
		</div>
		<oa-loading v-if="loading"/>
		<div v-if="result.status==1" class="_footer-button">
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-20 g-m-t-5"
				@click="handleEidt"
			>重新编辑</vc-debounce-click>
		</div>
	</i-drawer>
</template>

<script type="text/ecmascript-6">
import API from "@stores/apis/root";
import { Drawer, Tabs, TabPane, Input, Button, Tooltip } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import orderModal from '@extends/mixins/orderModal';
import InfoItem from "../../_common/info-item";
import InfoBlock from '../../_common/info-block';
import { setData } from '../../_common/util';

export default {
	name: "to-ticket",
	components: {
		"i-drawer": Drawer,
		"i-tabs": Tabs,
		"i-tabPane": TabPane,
		"i-input": Input,
		"i-tooltip": Tooltip,
		'oa-info-item': InfoItem,
		'oa-info-block': InfoBlock,
		"vc-imgs-preview": ImgsPreview,
	},
	mixins: [orderModal],
	props: {
		data: Object,
	},
	data() {
		return {
			visible: false,
			loading: false,
			result: {},
			payment_show: true,
			basicInfo: {
				customer_name: '',
				customer_phone: '',
				customer_address: '',
				project: '',
				invoice_type_name: '',
				invoice_title: '',
				invoice_list: '', // 开票申请
				contract_list: '', // 电子合同
				our_company_name: '',
				contract_num: '',
				ratepayer_number: '',
				open_bank: '',
				public_account: '',
				invoice_money: '',
				payment_type_amount_name: '',
				voucher_list: '', // 打款凭证
				entrusted_payment_list: "",
			},
			handleInfo: {
				audit_remark: '',
				audit_time: '',
				audit_staff_name: '',
			},
			opendInfo: {
				invoice_time: '',
				invoice_code: '',
				invoice_num: '',
				amount: '',
				tax_amount: '',
				open_holder_name: '',
				total_amount: '',
				invoice_operate_time: '',
			},
			receiveInfo: {
				invoice_number: '',
				invoice_amount_sheets: '',
				receive_holder: '',
				receive_time: '',
			},
			basic: {
				title: '基本信息',
				dataSource: [],
				list: [
					[
						{ name: '客户姓名', value: this.visible, varName: 'customer_name' },
						{ name: '客户电话', value: '**********', varName: 'customer_phone' },
						{ name: '客户地址', value: '**********', varName: 'customer_address' },
						{ name: '合作项目', value: '**********', varName: 'project' },
						{ name: '发票类型', value: '**********', varName: 'invoice_type_name' },
						{ name: '发票抬头', value: '**********', varName: 'invoice_title' },
						{ name: '开票资料',
							value: [],
							varName: 'info_type_1',
							render: (h, params) => {
								return (
									<div class="_info-item ">
										<span class="_label">{params.data.name}</span>
										<span class="_value">
											<ImgsPreview dataSource={params.data.value} render-row={this.renderRow} />
										</span>
									</div>
								);
							} },
						{ name: '电子合同',
							value: [],
							varName: 'info_type_3',
							render: (h, params) => {
								return (
									params.data.value && <div class="_info-item">
										<span class="_label">{params.data.name}</span>
										<span class="_value">
											<ImgsPreview dataSource={params.data.value} render-row={this.renderRow}/>
										</span>
									</div>
								);
							} }
					],
					[
						{ name: '合同编号', value: '**********', varName: 'contract_num' },
						{ name: '纳税人识别号', value: '**********', varName: 'ratepayer_number' },
						{ name: '开户行', value: '**********', varName: 'open_bank' },
						{ name: '对公账号', value: '**********', varName: 'public_account' },
						{ name: '发票金额', value: '**********', varName: 'invoice_money' },
						{ name: '汇款方式', value: '**********', varName: 'payment_type_name' },
						{ name: '打款凭证',
							value: [],
							varName: 'info_type_2',
							render: (h, params) => {
								return (
									params.data.value && <div class=" _info-item">
										<span class="_label">{params.data.name}</span>
										<span class="_value">
											<ImgsPreview dataSource={params.data.value}
												render-row={this.renderRow}/>
										</span>
									</div>
								);
							}
						}
					]
				]

			},
			handle: {
				title: '审核处理',
				list: [
					[
						{ name: '通过说明', value: '**********', varName: 'audit_remark' },
						{ name: '操作时间', value: '**********', varName: 'audit_time' }
					],
					[
						{ name: '审核人', value: '**********', varName: 'audit_staff_name' }
					]
				]
			},
			opend: {
				title: '开票处理',
				list: [
					[
						{ name: '开票时间', value: '**********', varName: 'invoice_time' },
						{ name: '开票操作时间', value: '**********', varName: 'invoice_operate_time' }
					],
					[
						{ name: '开票人', value: '**********', varName: 'open_holder' }
					]
				]
			},
			receive: {
				title: '领票处理',
				list: [
					[
						{ name: '开票分数', value: '**********', varName: 'invoice_number' },
						{ name: '开票张数', value: '**********', varName: 'invoice_amount_sheets' }
					],
					[
						{ name: '领票人', value: '**********', varName: 'receive_holder' },
						{ name: '领票时间', value: '**********', varName: 'receive_time' }
					]
				]
			}
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		if (this.data.invoice_id) {
			this.loadData();
		}
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		renderRow(h, params) {
			const { src, index } = params;
			return h('img', {
				attrs: {
					src: src + '!4-4',
					width: 70,
					height: 70,
				}
			});
		},
		handleSave() {
			this.visible = false;
		},
		loadData() {
			this.loading = true;
			this.$request({
				url: API._SALE_TICKET_INVOICE_DETAIL_GET,
				type: "post",
				loading: false,
				param: {
					invoice_id: this.data.invoice_id
				}
			})
				.then(res => {
					this.loading = false;
					this.result = res.data;
					this.payment_show = this.result.payment_type_amount.some(it => [3, 6].includes(it.payment_type));
					if (this.result.status == 4) {
						this.handle.list[0][0].name = '驳回原因';
					}
					setData(this.basicInfo, this.result);
					setData(this.handleInfo, this.result);
					setData(this.opendInfo, this.result);
					setData(this.receiveInfo, this.result);
					// this.$refs.basic.setData(this.result);
					// this.$refs.handle && this.$refs.handle.setData(this.result);
					// setTimeout(() => {
					// 	this.$refs.opend && this.$refs.opend.setData(this.result);
					// 	this.$refs.receive && this.$refs.receive.setData(this.result);
					// }, 100);

				}).catch(error => {
					console.error(error);
				});
		},
		handleNull() {
			this.visible = false;
		},
		getimgurl(array) {
			let i = [];
			array.forEach(ele => {
				i.push(ele.image_url);
			});
			return i;
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			// this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			// this.visible = false;
			this.$emit('close');
		},
		handleEidt() {
			this.$router.push({ name: "sale-ticket-apply", query: { invoice_id: this.data.invoice_id } });
		},

	}
};
export const ModalReceive = CreatePortal({ alive: true }, module.exports.default);
</script>

<style  lang="scss">
      .v-sale-receive-drawer {
        .ivu-drawer.ivu-drawer-right {
            width:720px !important;
        }
        .ivu-drawer-body {
            border-top: 1px solid #d4d7db;

        }
        ._header {
            font-weight: normal;
            font-size: 16px;
            color: #000;
        }
		.__detail-body{
			margin-bottom:60px;
		}
        ._footer-button {
			background: #fff;
            position: fixed;
            width: 720px;
            bottom: 0;
            right: 0;
            height: 60px;
            line-height: 60px;
            box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
        }
        .ivu-drawer-header {
            border-bottom: none;
        }
        ._title {
            margin-top: 0px;
        }
        ._value {
            img {
                border: 1px solid #d4d7db;
            }
        }
	}
</style>
