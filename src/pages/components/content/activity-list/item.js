import { Tooltip } from 'iview';
import AutoTooltip from "@common/auto-tooltip/auto-tooltip";
import { DetailDrawer } from './popup/detail';

export default {
	data() {
		return {
			columns: [
				{
					title: '活动名称',
					key: 'activity_name',
					width: 230,
					fixed: 'left',
					render: (h, params) => {
						return h('div', {
							class: ['g-c-blue-mid', 'g-operation'],
							style: {
								marginRight: '5px',
								cursor: 'pointer',
							},
						}, [
							params.row.activity_name.length > 15
								?	h(Tooltip, {
									props: {
										content: params.row.activity_name,
										transfer: true,
										maxWidth: 250
									}
								}, params.row.activity_name.slice(0, 14) + '...')
								:	params.row.activity_name
						]);
					}
				},
				{
					title: '活动类型',
					key: 'category_name',
					minWidth: 120,
					render(h, { row }) {
						return (
							<AutoTooltip
								content={ row.category_name }
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '活动开始时间',
					key: 'start_time',
					minWidth: 150,
				},
				{
					title: '活动结束时间',
					key: 'end_time',
					minWidth: 150,
				},
				{
					title: '报名开始时间',
					key: 'apply_start_time',
					minWidth: 150
				},
				{
					title: '报名结束时间',
					key: 'apply_end_time',
					minWidth: 150,
				},
				{
					title: '活动状态',
					key: 'status_name',
					minWidth: 120,
				},
				{
					title: '参加企业',
					key: 'join_num',
					minWidth: 140,
				},
				{
					title: '未合作企业',
					key: 'no_cooperation_num',
					minWidth: 140,
				},
				{
					title: '参加过策略班',
					key: 'strategy_num',
					minWidth: 140,
				},
				{
					title: '复训过企业',
					key: 'retrain_num',
					minWidth: 140,
				},
				{
					title: '复训1次企业',
					key: 'retrain_one_num',
					minWidth: 140,
				},
				{
					title: '复训2次企业',
					key: 'retrain_two_num',
					minWidth: 140,
				},
				{
					title: '复训3次企业',
					key: 'retrain_three_num',
					minWidth: 120,
				},
				{
					title: '复训4次企业',
					key: 'retrain_four_num',
					minWidth: 140,
				},
				{
					title: '复训5次企业',
					key: 'retrain_five_num',
					minWidth: 140,
				},
				{
					title: '复训5次以上企业',
					key: 'retrain_six_num',
					minWidth: 160,
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('CONTENT_ACTIVITY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('CONTENT_ACTIVITY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};