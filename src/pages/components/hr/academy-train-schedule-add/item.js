import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { AuditModal, batchModal } from './popup/modal-audit.vue';


export default {
	data() {
		return {
			columns: {
				'1': [],
				'2': [],
				'3': [],
			},
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-academy-train-schedule-add-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-academy-train-schedule-add-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle && this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},
		handleAudit(recordId) { 
			// 传入 auditId 为一个字符串（id）时代表单个审核或查看， 传入数组代表批量审核
			AuditModal.popup({
				recordId
			}).then(() => {
				this.handleResetFirst();
			}).catch((err) => {
				err && console.error(err);
			});
		},
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		getColumns(data = { title_show: [], title_hide: [] }, type) {
			const columns = [
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					minWidth: 120,
				},
				{
					title: '报名课程',
					minWidth: 140,
					key: 'course_name',
					render: (h, params) => {
						let course_name = params.row.course_name;
	
						return (
							<AutoToolTip 
								content={course_name}
								width="120px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '手机号码',
					minWidth: 150,
					key: 'mobile',
				},
				{
					title: '部门',
					minWidth: 150,
					key: 'depart_name',
				},
				{
					title: '报名时间',
					minWidth: 150,
					key: 'create_time',
				},
				{
					title: '审核人',
					minWidth: 100,
					key: 'audit_staff_name',
				},
				{
					title: '审核时间',
					minWidth: 150,
					key: 'audit_time',
				},
				{
					title: '学习类型',
					minWidth: 100,
					key: 'study_type_name',
				},
				{
					title: '报名来源',
					minWidth: 150,
					key: 'apply_type_name',
				},
				{
					title: '推荐人',
					minWidth: 150,
					key: 'referee_name',
				}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);

			type !== '3' ? columnsShow.unshift({
				type: 'selection',
				fixed: 'left',
				minWidth: 50,
				align: 'center'
			}) : '';

			columnsShow.push({
				title: '操作',
				key: 'opt',
				fixed: 'right',
				align: 'center',
				width: 100,
				render: (h, params) => {
					if (type === '1' && this.$auth[958]) {
						return h('span', {
							style: {
								color: '#2e9dfa',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									AuditModal.popup({
										courseIds: params.row.record_id,
									}).then(res => {
										this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT');
									});
								}
							}
						}, '审核');
					} else {
						return this.$auth[962] && h('span', {
							style: {
								color: '#2e9dfa',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									AuditModal.popup({
										courseIds: params.row.record_id,
										title: 1
									}).then(res => {
										this.$store.commit('HR_ACADEMY_TRAIN_SCHEDULE_ADD_LIST_INIT');
									});
								}
							}
						}, '查看申请');
					}
				}
			});
			
			return columnsShow;
		}
	}
};

