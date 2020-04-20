import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { ModifyModal } from './popup/modify-modal.vue';

const REWARD = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					width: 150,
					// align: 'center',
					render(h, { row }) {
						return (
							<div class="g-c-blue-mid">{ row.staff_name }</div>
						);
					}
				},
				{
					title: '部门',
					key: 'depart_name',
					width: 120,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.depart_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '手机号码',
					key: 'mobile',
					width: 120,
				},
				{
					title: '状态',
					key: 'status_name',
					minWidth: 110,
				},
				{
					title: '奖项',
					minWidth: 80,
					render(h, { row }) {
						return (
							<div>
								奖项{ REWARD[Number(row.reward.sort) - 1] }
							</div>
						);
					}
				},
				{
					title: '奖品',
					minWidth: 160,
					render(h, { row }) {
						return (
							<div>{ row.reward.reward_name }</div>
						);
					}
				},
				{
					title: '中奖时间',
					key: 'create_time',
					sortable: 'custom',
					width: 150
				},
				{
					title: '操作',
					align: 'center',
					width: 80,
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div 
								class="g-tc g-c-blue-mid g-pointer"
								onClick={ () => this.handleOperate(row) }>修改</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_1_RESULT_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(row) {
			ModifyModal.popup({
				rowData: { ...row }
			}).then(res => {
				this.handleResetCur();
				this.loadHeaderData();
			});
		}
	}
};

