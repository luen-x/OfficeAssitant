import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";

export default {
	data() {
		return {
			columns: [
				{
					type: "selection",
					fixed: "left",
					minWidth: 50
				},
				{
					title: '姓名',
					minWidth: 150,
					key: 'staff_name',
				},
				{
					title: '入职日期',
					minWidth: 150,
					key: 'entry_date',
				},
				{
					title: '战区',
					minWidth: 150,
					key: 'zone_depart',
				},
				{
					title: '部门',
					minWidth: 150,
					key: 'depart_name',
				},
				{
					title: '手机号',
					minWidth: 150,
					key: 'mobile',
				},
				{
					title: '来源',
					minWidth: 150,
					key: 'user_source',
				},
				{
					title: '是否报名',
					minWidth: 150,
					key: 'is_apply',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.is_apply ? '是' : '否'} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '是否签到',
					minWidth: 150,
					key: 'is_sign',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.is_sign ? '是' : '否'} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				},
				{
					title: '是否上传作业',
					minWidth: 150,
					key: 'is_upload',
					render: (h, params) => {
						return (
							<AutoTooltip content={params.row.is_upload ? '是' : '否'} theme="dark" placement="bottom" labelClass=" "/>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

