import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { RelateApply } from './popup/relate-apply';
import { RelationApplyAudit } from './popup/apply-audit';
import { RelationDetail } from './popup/detail';

export default {
	data() {
		const baseColumns = [
			{
				title: '关联公司',
				key: 'link_company_name',
				width: 250,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.link_company_name}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '客户姓名',
				key: 'customer_name',
				minWidth: 100
			},
			{
				title: '客户手机号',
				key: 'phone',
				minWidth: 120
			},
			{
				title: '邀约人',
				key: 'invite_staff_name',
				minWidth: 100
			},
			{
				title: '部门',
				key: 'invite_depart_name',
				minWidth: 120
			},
			{
				title: '申请人',
				key: 'staff_name',
				minWidth: 100
			},
			{
				title: '申请时间',
				key: 'apply_time',
				minWidth: 160
			}
		];
		const companyColumns = {
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
							labelClass={row.status != 2 ? 'g-operation' : ''}
						/>
					</div>
				);
			}
		};
		const extraColumns = [
			{
				title: '审核人',
				key: 'audit_staff_name',
				minWidth: 100,
				render: (h, { row }) => {
					const audit_staff_name = row.audit_staff_name;
					return <span>{ audit_staff_name || '--' }</span>;
				}
			},
			{
				title: '审核时间',
				key: 'audit_time',
				minWidth: 160,
				render: (h, { row }) => {
					const audit_time = row.audit_time;
					return <span>{ audit_time || '--' }</span>;
				}
			}
		];
		const extraOptColumns = {
			'1': {
				title: '操作',
				key: 'opt',
				fixed: 'right',
				align: 'center',
				width: 100,
				render: (h, { row }) => {
					return (
						<Dropdown
							transfer 
							triger="hover" 
							placement="left-start"
							onOn-click={(method) => this[method](row)}
						>
							<i
								class="iconfont icon-point g-fs-20 g-pointer"
								onClick={(e) => { e.stopPropagation(); }}
							/>
							<DropdownMenu slot="list">
								{
									(this.$auth[459] || this.$auth[471]) && <DropdownItem name="handleEdit">重新编辑</DropdownItem>
								}
								{
									(this.$auth[460] || this.$auth[472]) && <DropdownItem name="handleResetApply">取消申请</DropdownItem>
								}
								{
									this.$auth[464] && <DropdownItem name="handleAudit">审核申请</DropdownItem>
								}
							</DropdownMenu>
						</Dropdown>
					);
				}
			},
			'2': {
				title: '操作',
				key: 'opt',
				fixed: 'right',
				width: 160,
				render: (h, { row }) => {
					return (
						<div class="g-operation">
							{
								this.$auth[465] && <span onClick={(e) => { 
									e.stopPropagation(); 
									this.handleResetAudit(row); 
								}}>撤销审核</span>
							}
							{
								this.$auth[465] && (this.$auth[467] || this.$auth[697]) && <span class="g-pd-lr-10">|</span>
							}
							{
								(this.$auth[467] || this.$auth[697]) && <span onClick={(e) => { 
									e.stopPropagation(); 
									this.handleDetail(row); 
								}}>查看详情</span>
							}
						</div>
					);
				}
			},
			'3': {
				title: '操作',
				key: 'opt',
				fixed: 'right',
				width: 100,
				render: (h, { row }) => {
					return (
						<Dropdown
							transfer 
							triger="hover" 
							placement="left-start"
							onOn-click={(method) => this[method](row)}
						>
							<i
								class="iconfont icon-point g-fs-20 g-pointer"
								onClick={(e) => { e.stopPropagation(); }}
							/>
							<DropdownMenu slot="list">
								{
									(this.$auth[467] || this.$auth[697]) && <DropdownItem name="handleDetail">查看详情</DropdownItem>
								}
								{
									(this.$auth[468] || this.$auth[698]) && (!row.is_again ? <DropdownItem name="handleReApply">重新申请</DropdownItem> 
										: <DropdownItem class="g-c-black7">重新申请</DropdownItem>)
								}
								{
									(this.$auth[469] || this.$auth[712]) && <DropdownItem name="handleDelete">删除</DropdownItem>
								}
							</DropdownMenu>
						</Dropdown>
					);
				}
			}
		};
		return {
			typeColumns1: [
				companyColumns,
				...baseColumns, 
				extraOptColumns['1']
			],
			typeColumns2: [
				companyColumns,
				...baseColumns, 
				...extraColumns,
				extraOptColumns['2']
			],
			typeColumns3: [
				companyColumns,
				...baseColumns, 
				...extraColumns,
				extraOptColumns['3']
			],
		};
	},
	methods: {
		handleOpenDrawer(row) {
			if (this.type !== '3') {
				this.$router.push({
					name: 'sale-customer-deal-relation-detail',
					query: {
						relate_id: row.relate_id,
						contract_company_id: row.contract_company_id
					}
				});
			}
		},
		getColumns(type) {
			return this[`typeColumns${type}`];
		},
		handleEdit(row) {
			this.$request({
				url: '_SALE_RELATE_CUSTOMER_CHECK_POST',
				type: 'GET',
				loading: false,
				param: {
					relate_id: row.relate_id
				},
				autoTip: false
			}).then(res => {
				if (res.status == 1) {
					RelateApply.popup({
						data: {
							title: '编辑关联公司申请',
							relate_id: row.relate_id,
							action: 'update',
							contract_company_name: row.contract_company_name,
							contract_company_id: row.contract_company_id
		
						}
					}).then(() => {
						this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_RESET', { type: this.type });
					}).catch(error => {
						error && console.error(error);
					});
				} else {
					this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_RESET', { type: this.type });
				}
			}).catch(error => {
				this.$Message.error(error.msg); 
			});
		},
		handleAudit(row) {
			RelationApplyAudit.popup({
				relateId: row.relate_id
			}).then(() => {
				this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_RESET', { type: this.type });
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleResetApply(row) {
			Confirm.popup({
				title: '取消关联公司申请',
				msg: '是否取消该关联公司申请？'
			}).then(() => {
				this.$request({
					url: '_SALE_RELATE_CUSTOMER_CANCEL_POST',
					type: "POST",
					loading: false,
					param: {
						relate_id: row.relate_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_RESET', { type: this.type });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleResetAudit(row) {
			Confirm.popup({
				title: '撤销关联公司审核',
				msg: '是否撤销关联公司审核？'
			}).then(() => {
				this.$request({
					url: '_SALE_RELATE_CUSTOMER_REVOKE_POST',
					type: "POST",
					loading: false,
					param: {
						relate_id: row.relate_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_RESET', { type: this.type });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleDetail(row) {
			RelationDetail.popup({
				relateId: row.relate_id
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleReApply(row) {
			RelateApply.popup({
				data: {
					title: '重新申请关联公司',
					action: 'readd',
					relate_id: row.relate_id,
					contract_company_name: row.contract_company_name,
					contract_company_id: row.contract_company_id

				}
			}).then(() => {
				this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_RESET', { type: this.type });
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleDelete(row) {
			Confirm.popup({
				title: '删除关联公司申请',
				msg: '是否确认删除？'
			}).then(() => {
				this.$request({
					url: '_SALE_RELATE_CUSTOMER_DELETE_POST',
					type: "POST",
					loading: false,
					param: {
						relate_id: row.relate_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_CUSTOMER_DEAL_RELATION_LIST_RESET', { type: this.type });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		}
	},
};

