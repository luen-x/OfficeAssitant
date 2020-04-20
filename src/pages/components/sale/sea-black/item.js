import { Tooltip, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { getParseUrl } from '@utils/utils';
import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import Upload from '@common/upload/upload';
import { BlackCompanyDetail } from "./popup/company-detail";

let columsStore = {
	mobile: _global.staff.mobile
};
export default {
	data() {
		const isCharge = !!this.$global.staff.is_charge;
		const baseColumns = [

			{
				title: '公司名称',
				key: 'company_name',
				width: 250,
				fixed: "left",
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip
								content={row.company_name}
								theme="dark"
								placement="bottom"
								labelClass="g-operation"
							/>
						</div>
					);
				}
			},
			{
				title: '行业',
				key: "industry_name",
				width: 100,
			},

			{
				title: '地区',
				key: "address_str",
				width: 270,
				render: (h, { row }) => {
					// const province_name = row.province_name;
					// const city_name = row.city_name;
					// const area_name = row.area_name;
					return (
						<div>
							<AutoTooltip
								content={row.address_str}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '标记次数',
				key: 'mark_times',
				minWidth: 100,
				render: (h, { row }) => {
					const recycle_type = row.recycle_type;
					return (
						<Tooltip
							transfer
							placement="right-start"
							maxWidth={300}
						>
							{ row.mark_times }
							<div slot="content">
								{
									recycle_type.map((item) => {
										return (
											<div>
												<span>{ item.label }：</span>
												<span>{ item.count }</span>
											</div>
										);
									})
								}
							</div>
						</Tooltip>
					);
				}
			},
			{
				title: '标记原因',
				key: 'create_time',
				minWidth: 160,
				render: (h, { row }) => {
					return <div class="g-m-t-10" >
						<AutoTooltip
							content={row.recycle_type.map(i => (i.label)).join(',')}
							theme="dark"
							placement="bottom"
							labelClass="g-c-black3"
						/>
					</div>;
				}
			},
			{
				title: '凭证',
				key: 'images',
				minWidth: 280,
				render: (h, { row }) => {
					return <div class="g-m-t-10 g-blue-scroll" style="width:240px;overflow-x:auto" onClick={e => e.stopPropagation()}>
						<Upload disabled wrap={false} showTitle={false} dataSource={row.images.map(i => ({ url: i }))}/>
					</div>;
				}
			},
			{
				title: '首次标记时间',
				key: 'create_time',
				minWidth: 160
			},
			{
				title: '回收时间',
				key: 'recovery_time',
				minWidth: 160
			}
		];
		const selectColumns = {
			type: 'selection',
			width: 50,
			align: 'center',
			fixed: "left",
		};
		const extraOptColumns = {
			'2': [{
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
							onOn-click={(method) => { this[method](row); }}
						>
							<i
								class="iconfont icon-point g-fs-20 g-pointer"
								onClick={(e) => { e.stopPropagation(); }}
							/>
							<DropdownMenu slot="list">
								{
									<div>
										{this.$auth[687] && <DropdownItem name="handleReset">驳回标记</DropdownItem>}
										{this.$auth[688] && <DropdownItem name="handleConfirm">确认黑名单</DropdownItem>}
										{isCharge && <DropdownItem name="handleDelete">删除黑名单</DropdownItem>}
									</div>
								}
							</DropdownMenu>
						</Dropdown>
					);
				}
			}],
			'1': [
				{
					title: '操作',
					key: 'opt',
					fixed: 'right',
					align: 'center',
					minWidth: 160,
					render: (h, { row }) => {
						return (
							<div class="g-flex g-operation" >
								{this.$auth[689] && <span onClick={(e) => { e.stopPropagation(); this.handleRecovery(row); }}> 恢复至公海</span>}
								{(isCharge && this.$auth[689]) ? <span class="g-m-lr-5" >|</span> : ''}
								{isCharge && <span onClick={(e) => { e.stopPropagation(); this.handleDelete(row); }}> 删除黑名单</span>}
							</div>
						);
					}
				}]

		};

		const columns2 = [...baseColumns];
		if (isCharge || this.$auth[688]) {
			columns2.unshift(selectColumns);
		}
		if (this.$auth[687] || this.$auth[688] || isCharge) {
			columns2.push(...extraOptColumns['2']);
		}

		const columns1 = [...baseColumns,
			{
				title: '确认时间',
				key: 'confirm_time',
				minWidth: 160
			},
			{
				title: '确认人',
				key: 'confirm_staff_name',
				minWidth: 160
			}];
		if (isCharge) {
			columns1.unshift(selectColumns);
		}
		if (this.$auth[689] || isCharge) {
			columns1.push(...extraOptColumns['1']);

		}

		return {
			indexMap: { '2': 0, '1': 1, '0': 2 },
			columns: {
				2: columns2,
				1: columns1
			}
		};
	},
	methods: {
		handleOpenDrawer(row) {
			BlackCompanyDetail.popup({
				type: this.type,
				status: row.status,
				customerId: row.customer_id
			}).then(res => {
				if (res.status == 1) {
					this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
					this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
				}
			}).catch(error => {
				error && console.error(error);
				this.$refs.tableTarget[this.indexMap[this.type]].$refs.tableTarget.clearCurrentRow();
			});
		},
		handleReset(row) {
			let { query: { page } } = getParseUrl();
			Confirm.popup({
				title: '驳回标记',
				msg: this.$auth[688]
					? `驳回“${row.company_name}”的所有标记后所有员工可继续在公海领取该资料，确认取消？`
					: `确定驳回对“${row.company_name}”标记？`
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_BLACK_CANCEL_MARK_POST',
					type: "POST",
					loading: false,
					param: {
						customer_id: row.customer_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
					this.$nextTick(() => {
						if (!(this.curLength - 1)) {
							this.$refs.tableTarget[this.indexMap[this.type]].currentPage = +page - 1;
							this.$refs.tableTarget[this.indexMap[this.type]].handleChange(+page - 1);
						}
					});
				});
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleRecovery(row) {
			let { query: { page } } = getParseUrl();
			Confirm.popup({
				title: '恢复至公海',
				msg: `是否确认将“${row.company_name}”恢复至公海？`
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_BLACK_RECOVERY_POST',
					type: "POST",
					loading: false,
					param: {
						customer_id: [row.customer_id]
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
					this.$nextTick(() => {
						if (!(this.curLength - 1)) {
							this.$refs.tableTarget.currentPage = +page - 1;
							this.$refs.tableTarget.handleChange(+page - 1);
						}
					});
				});
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleDelete(row) {
			let { query: { page } } = getParseUrl();
			Confirm.popup({
				title: '删除黑名单',
				msg: '是否确认删除？'
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_BLACK_DELETE_POST',
					type: "POST",
					loading: false,
					param: {
						recycle_ids: row.recycle_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
					this.$nextTick(() => {
						if (!(this.curLength - 1)) {
							this.$refs.tableTarget[this.indexMap[this.type]].currentPage = +page - 1;
							this.$refs.tableTarget[this.indexMap[this.type]].handleChange(+page - 1);
						}
					});
				});
			}).catch(error => {
				error && console.error(error);
			});
		},
		handleConfirm(row) {
			let { query: { page } } = getParseUrl();
			Confirm.popup({
				title: '确认黑名单',
				msg: `将“${row.company_name}”加入黑名单后，该资料将不在公海展示，确认加入？`
			}).then(() => {
				this.$request({
					url: '_SALE_SEA_BLACK_CONFIRM_POST',
					type: "POST",
					loading: false,
					param: {
						customer_id: [row.customer_id]
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_SEA_BLACK_LIST_RESET', { type: this.type });
					this.$nextTick(() => {
						if (!(this.curLength - 1)) {
							this.$refs.tableTarget[this.indexMap[this.type]].currentPage = +page - 1;
							this.$refs.tableTarget[this.indexMap[this.type]].handleChange(+page - 1);
						}
					});
				});
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};