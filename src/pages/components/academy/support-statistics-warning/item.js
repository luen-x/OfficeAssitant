import { createWarn } from './popup/createWarn';

export default {
	data() {
		return {
			columns: [
				{
					title: '规则名称',
					key: 'rule_name'
				},
				{
					title: '检测周期',
					key: 'detection_cycle'
				},
				{
					title: '总下载量阈值',
					key: 'total_limit'
				},
				{
					title: '工具包阈值',
					key: 'kit_limit'
				},
				{
					title: '自习室阈值',
					key: 'library_limit'
				},
				{
					title: '通知方式',
					key: 'notice_method_name'
				},
				{
					title: '操作',
					key: 'status',
					render: (h, { row }) => {
						return (
							<div class="g-operation g-flex">
								{this.$auth[1642] ? < span onClick={() => { this.handleEditWarn(row); }}>编辑</span> : ""}
								<span class="g-m-l-5 g-m-r-5">|</span>
								 {this.$auth[1643] ? <span onClick={() => { this.handleDelRule(row); }}>删除</span> : ""}

							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ACADEMY_SUPPORT_STATISTICS_WARNING_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_SUPPORT_STATISTICS_WARNING_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleEditWarn(row) {
			createWarn.popup({
				title: '编辑',
				rule_id: row.rule_id
			}).then((res) => {
				this.handleResetCur();
			}).catch();
		},
		handleDelRule(row) {
			this.$request({
				url: "_CONTENT_MATERIAL_DOWNLOAD_WARNING_RULE_DELETE_GET",
				type: 'GET',
				param: {
					rule_ids: [row.rule_id]
				},
				loading: false
			}).then((res) => {
				this.$Message.success(res.msg);
				this.handleResetCur();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		},
	}
};
