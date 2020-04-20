import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import Upload from '@components/_common/upload/upload';
import { ServiceExamine } from './popup/service-examine';
import { ServiceInfo } from './popup/service-info';
import { ServiceStop } from "../_common/service/stop";
import { ServiceClose } from "../_common/service/close";
import { ServiceComplain } from "../_common/service/complain";
import { ServiceDetail } from "../_common/service/detail";

export default {
	data() {
		return {
			indexMap: { '1': 0, '2': 1, '3': 2 },
			columns: this.getColumns()
		};
	},
	methods: {
		handleOpenDrawer(row) {
			if (this.$auth[486]) {
				ServiceDetail.popup({
					fromOther: true,
					customerServiceId: row.customer_service_id,
					contractCompanyId: row.contract_company_id,
					applyId: row.apply_id,
					pathName: 'sale-service-customer-do'
				}).then(res => {
					if (res.status == 1) {
						if (this.$auth[483]) {
							this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
						} else {
							this.$refs.tableTarget[0].$refs.tableTarget.clearCurrentRow();
						}
						this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_RESET', { type: this.type });
					}
				}).catch(error => {
					error && console.error(error);
					if (this.$auth[483]) {
						this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
					} else {
						this.$refs.tableTarget[0].$refs.tableTarget.clearCurrentRow();
					}
				});
			} else {
				this.$Message.warning('您没有权限查看详情');
			}
		},
		getColumns() {
			return [
				{
					title: '公司名称',
					key: 'contract_company_name',
					width: 250,
					fixed: "left",
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.contract_company_name}
									theme="dark"
									placement="bottom"
									labelClass="g-operation"
								/>
							</div>
						);
					}
				},
				{
					title: "客户姓名",
					key: "customer_name",
					minWidth: 100,
				},
				{
					title: '客户手机号',
					key: 'phone',
					minWidth: 120
				},
				{
					title: '申请类型',
					key: 'apply_type_name',
					minWidth: 120
				},
				{
					title: '服务人',
					key: 'staff_name',
					minWidth: 150,
					render: (h, { row }) => {
						const staff_name = row.staff_name;
						const depart_name = '（' + row.depart_name + '）';
						return (
							<div>
								<AutoTooltip 
									content={staff_name + depart_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '申请人',
					key: 'apply_staff_name',
					minWidth: 150,
					render: (h, { row }) => {
						const apply_staff_name = row.apply_staff_name;
						const apply_depart_name = '（' + row.apply_depart_name + '）';
						return (
							<div>
								<AutoTooltip 
									content={apply_staff_name + apply_depart_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '申请时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '申请理由',
					key: 'reason',
					minWidth: 150,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.reason}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '审核进度',
					key: 'audit_name',
					minWidth: 120
				},
				{
					title: '操作',
					key: 'opt',
					fixed: 'right',
					width: 135,
					render: (h, { row }) => {
						return (
							<div class="g-operation">
								{
									this.type === '1' && <span 
										onClick={(e) => {
											e.stopPropagation();
											this.handleExamine(row);
										}}
									>
								审核
									</span>
								}
								{
									this.type === '2' && <span 
										onClick={(e) => {
											e.stopPropagation();
											this.handleViewInfo(row);
										}}
									>
								查看
									</span>
								}
								{
									this.type === '3' && <div>
										{
											row.enable_edit 
												? <span>
													<span 
														onClick={(e) => {
															e.stopPropagation();
															this.handleEdit(row);
														}}
													>
													重新编辑
													</span> 
													<span class="g-pd-lr-10">|</span>
													<span 
														onClick={(e) => {
															e.stopPropagation();
															this.handleReset(row);
														}}
													>
													撤回
													</span>
												</span>
											 : <span 
													onClick={(e) => {
														e.stopPropagation();
														this.handleViewInfo(row);
													}}
												>
												查看
												</span>
										}
									</div>
								}
							</div>
						);
					}
				}
			];
		},
		/**
		 * 审核
		 */
		handleExamine(row) {
			ServiceExamine.popup({
				applyId: row.apply_id
			}).then(() => {
				this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_RESET', { type: this.type });
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 重新编辑
		 */
		handleEdit(row) {
			switch (row.type) {
				case 1:
					this.handleStopEdit(row);
					break;
				case 2:
					this.handleCloseEdit(row);
					break;
				case 3:
					this.handleComplainEdit(row);
					break;
				default:
					break;
			}
		},
		/**
		 * 查看
		 */
		handleViewInfo(row) {
			ServiceInfo.popup({
				applyId: row.apply_id
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 预览凭证
		 */
		handleViewCert(row) {
			Confirm.popup({
				title: '查看凭证',
				renderContent: (h) => {
					return (
						<div>
							<Upload
								max={6}
								dataSource={row.fileImage.map(it => ({
									type: it.img_url.substr(it.img_url.lastIndexOf('.')), 
									url: it.img_url 
								}))}
							>
								<span slot="trigger"/>
							</Upload>
						</div>
					);
				}
			}).catch(error => {
				error && console.error(error);
			});
		},
		/**
		 * 撤回
		 */
		handleReset(row) {
			Confirm.popup({
				title: '撤回申请',
				msg: '确认撤回该条申请？'
			}).then(() => {
				this.request({
					url: '_SALE_SERVICE_APPLY_CANCEL_POST',
					type: 'POST',
					param: {
						apply_id: row.apply_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_RESET', { type: 3 });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		/**
		 * 暂停服务编辑
		 */
		handleStopEdit(row) {
			this.$request({
				url: '_SALE_SERVICE_APPLY_GET',
				type: "GET",
				loading: false,
				param: {
					apply_id: row.apply_id,
					contract_company_id: row.contract_company_id
				},
				autoTip: false
			}).then(res => {
				ServiceStop.popup({
					applyId: row.apply_id,
					reason: res.data.reason,
					auditSchedule: res.data.audit_schedule,
					contractCompanyId: row.contract_company_id,
					fileImage: res.data.fileImage.map((it, uid) => ({ 
						uid,
						title: it.img_url.substr(it.img_url.lastIndexOf('/') + 1),
						type: it.img_url.substr(it.img_url.lastIndexOf('.')), 
						url: it.img_url 
					})),
				}).then(() => {
					this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_RESET', { type: 3 });
				}).catch(error => {
					error && console.error(error);
				});
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 关闭服务编辑
		 */
		handleCloseEdit(row) {
			this.$request({
				url: '_SALE_SERVICE_ITEM_APPLY_GET',
				type: "GET",
				loading: false,
				param: {
					apply_id: row.apply_id,
					contract_company_id: row.contract_company_id
				},
				autoTip: false
			}).then(res => {
				ServiceClose.popup({
					applyId: row.apply_id,
					reason: res.data.reason,
					sets: res.data.set,
					auditSchedule: res.data.audit_schedule,
					contractCompanyId: row.contract_company_id,
					fileImage: res.data.fileImage.map((it, uid) => ({ 
						uid,
						title: it.img_url.substr(it.img_url.lastIndexOf('/') + 1),
						type: it.img_url.substr(it.img_url.lastIndexOf('.')), 
						url: it.img_url 
					})),
					setIds: res.data.set.filter(item => item.is_checked == 1).map(it => it.set_id),
				}).then(() => {
					this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_RESET', { type: 3 });
				}).catch(error => {
					error && console.error(error);
				});
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 申诉编辑
		 */
		handleComplainEdit(row) {
			this.$request({
				url: '_SALE_SERVICE_APPEAL_DETAIL_GET',
				type: "GET",
				loading: false,
				param: {
					apply_id: row.apply_id,
					service_id: row.service_id
				},
				autoTip: false
			}).then(res => {
				ServiceComplain.popup({
					applyId: row.apply_id,
					serviceId: row.service_id,
					appealStep: res.data.appeal_step,
					serviceAmount: res.data.service_amount,
					auditSchedule: res.data.audit_schedule,
					contractCompanyId: row.contract_company_id,
					reason: res.data.reason,
					fileImage: res.data.fileImage.map((it, uid) => ({ 
						uid,
						title: it.img_url.substr(it.img_url.lastIndexOf('/') + 1),
						type: it.img_url.substr(it.img_url.lastIndexOf('.')), 
						url: it.img_url 
					})),
				}).then(() => {
					this.$store.commit('SALE_SERVICE_CUSTOMER_APPLICATION_LIST_RESET', { type: 3 });
				}).catch(error => {
					error && console.error(error);
				});
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	}
};

