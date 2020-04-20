import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Dropdown, DropdownMenu, DropdownItem } from "iview";
import { AdjustModal } from './popup/adjust-modal';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					minWidth: 120,
					key: 'staff_name',
				},
				{
					title: '手机号',
					minWidth: 120,
					key: 'mobile',
				},
				{
					title: '战区',
					minWidth: 120,
					key: 'parent_depart_name',
				},
				{
					title: '部门',
					minWidth: 120,
					key: 'depart_name',
				},
				{
					title: '职位',
					minWidth: 120,
					key: 'position_name',
				}, {
					title: '累计微币获取量',
					minWidth: 140,
					key: 'gain_total_coins',
					sortable: 'custom',
				},
				{
					title: '累计微币惩罚量',
					minWidth: 140,
					key: 'deduct_total_coins',
					sortable: 'custom',
				},
				{
					title: '累计微币消费量',
					minWidth: 140,
					key: 'consumed_total_coins',
					sortable: 'custom',
				},
				{
					title: '微币余额',
					minWidth: 120,
					key: 'coins',
					sortable: 'custom',
				},
				{
					title: "操作",
					minWidth: 90,
					fixed: 'right',
					render: (h, params) => {
						return (
							<Dropdown trigger="hover" placement="left" width="112" transfer>
								<div style="width: 100%;height: 100%;">
									<i class="iconfont icon-point" style="font-size: 18px;" />
								</div>
								<DropdownMenu slot="list" class="_handle" style="text-align: left;">
									<div onClick={() => this.handleOperate(params.row, 1)}>
										<DropdownItem class="g-pointer">查看记录</DropdownItem>
									</div>
									{<div onClick={() => this.handleOperate(params.row, 2)}>
										<DropdownItem class="g-pointer">调整余额</DropdownItem>
									</div>
									}
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleOperate(row, name) {
			if (name == 1) {
				this.$router.push({
					path: `/sale/property/coin/detail`,
					query: {
						staff_id: row.staff_id,
						account_id: row.account_id
					}
				});
			} else {
				AdjustModal.popup({
					datas: row
				}).then(res => {
					this.$store.commit('SALE_PROPERTY_COIN_LIST_INIT');
				});
			}
		},
		handleResetFirst() {
			this.$store.commit('SALE_PROPERTY_COIN_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_PROPERTY_COIN_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};