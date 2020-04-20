import Explain from "@components/_common/explain/explain";
import { Tooltip } from "iview";
import { refundDetail } from '@components/sale/achievement-staff/popup/refund-detail.vue';
import { productRefund } from '@components/sale/achievement-staff/popup/product-refund.vue';
import { PerformanceModal } from './popup/performance-modal';
import { StatusModal } from './popup/status.vue';
import { PrelectionModal } from './popup/prelection-modal.vue';




export default {
	computed: {
		getColumns() {
			switch (this.type) {
				case "1":
					return this.promotionColumns();
				case "3":
					return this.teamColumns();
				case "2":
					return this.lessonColumns(this.lectureStatus);
				case "4":
					return this.refundColumns();
				default:
					break;
			}
		}
	},
	methods: {
		promotionColumns() {
			return [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 240,
					render: (h, params) => {
						const { contract_company_name } = params.row;
						return (
							<div style="display: block">
								{contract_company_name && contract_company_name.length > 15 ? (
									<Tooltip
										transfer
										placement="bottom-start"
										style="margin: 10px auto;display: block;maxWidth:200px"
									>
										<div>
											{contract_company_name.substr(0, 15) + "..."}
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{contract_company_name}
											</p>
										</div>
									</Tooltip>
								) : (
									contract_company_name
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 150
				},
				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 150
				},
		
				{
					title: "促单业绩",
					key: "minus_performance",
					minWidth: 150
				},
				{
					title: "邀约人",
					minWidth: 250,
					key: "invite_staff_name"
				},
				{
					title: "操作",
					minWidth: 150,
					key: "cz",
					fixed: "right",
					render: (h, params) => {
						return (
							<div>
								<span>
									{
										this.$auth['1461'] || this.$auth['1337'] ? <span
											onClick={() => {
												this.handlePerformanceModal(params.row);
											}}
											class="g-operation"
										>
										查看详情
										</span> : ''
									}
									{
										this.$auth['1461'] || this.$auth['1337'] ? <span
											class="g-c-blue-mid"
											style="display:inline-block;margin:0 5px"
										>
										|
										</span> : ''
									}
								</span>
								{
									this.$auth['1463'] || this.$auth['1338'] ? <span
										onClick={e => {
											e.stopPropagation();
											this.handleStatusModal(params.row);
										}}
										class="g-operation"
									>
									修改记录
									</span> : ''
								}
							</div>
						);
					}
				}
			];
		},
		teamColumns() {
			return [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 240,
					render: (h, params) => {
						const { contract_company_name } = params.row;
						return (
							<div style="display: block">
								{contract_company_name && contract_company_name.length > 15 ? (
									<Tooltip
										transfer
										placement="bottom-start"
										style="margin: 10px auto;display: block;maxWidth:200px"
									>
										<div>
											{contract_company_name.substr(0, 15) + "..."}
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{contract_company_name}
											</p>
										</div>
									</Tooltip>
								) : (
									contract_company_name
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 150
				},
				{
					title: "实付金额",
					key: "payment_amount",
					minWidth: 150
				},
			
				{
					title: "促单业绩",
					key: "minus_performance",
					minWidth: 150
				},
				{
					title: "谈判人",
					minWidth: 250,
					key: "negotiator_staff_name"
				},
				{
					title: "邀约人",
					minWidth: 250,
					key: "invite_staff_name"
				},
				{
					title: "操作",
					minWidth: 150,
					key: "cz",
					fixed: "right",
					render: (h, params) => {
						return (
							this.$auth['1461'] || this.$auth['1337'] ? <span
								onClick={() => {
									this.handlePerformanceModal(params.row);
								}}
								class="g-operation"
							>
								查看详情
							</span> : ''
						);
					}
				}
			];
		},
		lessonColumns(lectureStatus) {
			let lessonColumns = [];
			if (lectureStatus === "2") {
				lessonColumns = [
					{
						title: "公司名称",
						key: "contract_company_name",
						width: 240,
						render: (h, params) => {
							const { contract_company_name } = params.row;
							return (
								<div style="display: block">
									{contract_company_name && contract_company_name.length > 15 ? (
										<Tooltip
											transfer
											placement="bottom-start"
											style="margin: 10px auto;display: block;maxWidth:200px"
										>
											<div>
												{" "}
												{contract_company_name.substr(
													0,
													15
												) + "..."}{" "}
											</div>
											<div slot="content">
												<p style="whiteSpace: normal">
													{contract_company_name}
												</p>
											</div>
										</Tooltip>
									) : (
										contract_company_name
									)}
								</div>
							);
						}
					},
					{
						title: "客户姓名",
						key: "customer_name",
						minWidth: 220
					},
					{
						title: "课程类型",
						key: "set_name",
						minWidth: 300
					},
					{
						title: "业绩金额",
						key: "performance",
						minWidth: 150
					},
					{
						title: "讲课时长",
						key: "class_hour",
						minWidth: 150
					},
					{
						title: "课时费",
						key: "class_hour_salary",
						minWidth: 150
					},
					{
						title: "补贴金额",
						key: "allowance_salary",
						minWidth: 150
					},
					{
						title: "操作",
						minWidth: 150,
						key: "cz",
						fixed: "right",
						render: (h, params) => {
							return (
								this.$auth['1461'] || this.$auth['1337'] ? <div
									onClick={e => {
										e.stopPropagation();
										this.handleCheckPass(params.row);
									}}
									class="g-operation"
								>
									查看详情
								</div> : ''
							);
						}
					}
				];
			} else if (lectureStatus === "1") {
				lessonColumns = [
					{
						title: "公司名称",
						key: "contract_company_name",
						width: 240,
						render: (h, params) => {
							const { contract_company_name } = params.row;
							return (
								<div style="display: block">
									{contract_company_name && contract_company_name.length > 15 ? (
										<Tooltip
											transfer
											placement="bottom-start"
											style="margin: 10px auto;display: block;maxWidth:200px"
										>
											<div>
												{" "}
												{contract_company_name.substr(
													0,
													15
												) + "..."}{" "}
											</div>
											<div slot="content">
												<p style="whiteSpace: normal">
													{contract_company_name}
												</p>
											</div>
										</Tooltip>
									) : (
										contract_company_name
									)}
								</div>
							);
						}
					},
					{
						title: "客户姓名",
						key: "customer_name",
						minWidth: 220
					},
					{
						title: "套系名称",
						key: "set_name",
						minWidth: 150
					},
					{
						title: "课时数",
						key: "class_hour",
						minWidth: 150
					},
					{
						title: "课时费",
						key: "class_hour_salary",
						minWidth: 150
					},
					{
						title: "补贴金额",
						key: "allowance_salary",
						minWidth: 150
					},
					{
						title: "操作",
						minWidth: 150,
						key: "cz",
						fixed: "right",
						render: (h, params) => {
							return (
								this.$auth['1461'] || this.$auth['1337'] ? <div
									onClick={e => {
										e.stopPropagation();
										this.handleCheckPass(params.row);
									}}
									class="g-operation"
								>
									查看详情
								</div> : ''
							);
						}
					}
				];
			}
			return lessonColumns;
		},
		refundColumns() {
			return [
				{
					title: "公司名称",
					key: "contract_company_name",
					width: 240,
					render: (h, params) => {
						const { contract_company_name } = params.row;
						return (
							<div style="display: block">
								{contract_company_name && contract_company_name.length > 15 ? (
									<Tooltip
										transfer
										placement="bottom-start"
										style="margin: 10px auto;display: block;maxWidth:200px"
									>
										<div>
											{" "}
											{contract_company_name.substr(0, 15) + "..."}
											{" "}
										</div>
										<div slot="content">
											<p style="whiteSpace: normal">
												{contract_company_name}
											</p>
										</div>
									</Tooltip>
								) : (
									contract_company_name
								)}
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 220
				},
				{
					title: "退款金额",
					key: "refund_amount",
					minWidth: 150
				},
				{
					title: "扣除业绩",
					key: "deduction_performance",
					minWidth: 150
				},
				{
					title: "应扣回提成",
					key: "deduction_commission",
					minWidth: 150
				},
				{
					title: "退款类型",
					key: "refund_type_name",
					minWidth: 150
				},
				{
					title: "邀约人",
					key: "invite_staff_name",
					minWidth: 150
				},
				{
					title: "操作",
					minWidth: 150,
					key: "cz",
					fixed: "right",
					render: (h, params) => {
						return (
							this.$auth['1461'] || this.$auth['1337'] ? <div
								onClick={e => {
									e.stopPropagation();
									this.handleRefundModal(params.row);
								}}
								class="g-operation"
							>
								查看详情
							</div> : ''
						);
					}
				}
			];
		},
		handleLinkTo() {
			this.$router.push("/");
		},
		handlePerformanceModal(val) {
			PerformanceModal.popup({
				record_id: val.record_id,
				month: val.month,
				type: this.type,
			}).then(res => {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			});
		},
		handleStatusModal(val) {
			StatusModal.popup({
				payment_id: val.payment_id
			}).then(res => {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			});
		},
		handleRefundModal(row) {
			productRefund.popup({
				data: {
					refund_id: row.refund_id,
					refund_type: row.refund_type,
					contract_company_name: row.contract_company_name
				 }
			}).then(res => {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			});
		},
		handleCheckPass(val) {
			PrelectionModal.popup({
				type: this.lectureStatus,
				record_id: val.record_id
			}).then(res => {
				this.$store.commit("FINANCE_COUNT_STAFF_DETAIL_ALL_LIST_INIT");
			});
		}
	}
};
