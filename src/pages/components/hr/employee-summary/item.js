import {
	Dropdown,
	DropdownMenu,
	DropdownItem
} from 'iview';
import {
	Copy
} from "wya-vc";
import {
	getHashUrl
} from '@utils/utils';
import { M_HR_URL } from '@constants/constants';
import {
	AuditModal
} from './popup/audit.vue';

export default {
	data() {
		const {
			query = {}
		} = this.$route;
		return {
			columns: {
				'1': [],
				'2': [],
			}
		};
	},
	created() {
		for (const key in this.columns) {
			this.loadTitleArray(key);
		}
	},
	mounted() {
		this.$vc.on('hr-employee-summary-title-change', (res) => {
			this.loadTitleArray(this.type);
		});
	},
	beforeDestroy() {
		this.$vc.off('hr-employee-summary-title-change');
	},
	methods: {
		loadTitleArray(type) {
			this.loadTableTitle(type).then((res) => {
				this.columns[type] = this.getColumns(res.data, type);
			});
		},

		getColumns(data = { title_show: [], title_hide: [] }, type) {
			let columns = [{
				title: '姓名',
				key: 'staff_name',
				minWidth: 160,
				fixed: 'left',
				render: (h, params) => {
					return (
						this.type === '1'
							? h('span',
								params.row.staff_name)
							: (h('div', {
								class: "g-operation",
								style: 'width:100%;height:100%',
								on: {
									click: () => {
										this.handleLinkTo(params.row.staff_id, params.row.staff_name);
									}
								}
							}, params.row.staff_name))
					);
				}
			},
			{
				title: '手机号码',
				key: 'mobile',
				minWidth: 120,
				fixed: 'left'

			},
			{
				title: '工号',
				minWidth: 140,
				key: 'staff_number',
				tooltip: true
			},
			{
				title: '性别',
				minWidth: 60,
				key: 'sex'
			},
			{
				title: '部门',
				minWidth: 200,
				key: 'depart_name',
				tooltip: true
			},
			{
				title: '职位',
				minWidth: 200,
				key: 'position_name',
				tooltip: true
			},
			{
				title: '入职日期',
				minWidth: 120,
				key: 'create_time'
			},
			{
				title: '转正日期',
				minWidth: 120,
				key: 'regular_time'
			},
			{
				title: '工龄',
				minWidth: 120,
				key: 'work_age'
			},
			{
				title: '招聘途径',
				minWidth: 120,
				key: 'add_type',
				tooltip: true
			},
			{
				title: '入职资料',
				minWidth: 100,
				key: 'ei_status',
				sortable: 'custom',
			},
			{
				title: '简历状态',
				minWidth: 100,
				key: 'resume_status',
				sortable: 'custom',
			},
			{
				title: '坐席号',
				minWidth: 100,
				key: 'seat_number',
			},
			{
				title: '外线号码',
				minWidth: 120,
				key: 'pstn_number',
			},
			{
				title: '座机号码',
				minWidth: 120,
				key: 'tel',
			},
			{
				title: '预计入职日期',
				minWidth: 120,
				key: 'predict_entry_time'
			},
			{
				title: '凭证信息',
				minWidth: 120,
				key: 'prove_status',
				sortable: 'custom',
			}
			];

			const columnsShow = data.title_show.map(cloShow => {
				const result = columns.find(col => {
					return cloShow.key == col.key;
				});
				if (!result) console.error("table-title Error：unkown key:" + cloShow.key);
				return result;
			}).filter(Boolean);
			if (type == 1) {
				columnsShow.push({
					title: '操作',
					key: 'status',
					fixed: 'right',
					align: "center",
					width: 100,
					render: (h, params) => {
						return (
							h(Dropdown, {
								props: {
									transfer: true, placement: 'left-start'
								},
								on: {
									'on-click': (name) => this.handleClick(name, params)
								}
							}, [
								h('i', {
									class: 'iconfont icon-point',
									style: 'font-size: 20px'

								}),
								h(DropdownMenu, {
									slot: 'list'
								}, [
									params.row.add_type !== "人事添加"
										? null
										: this.$auth['198'] && h(DropdownItem, {
											props: {
												name: '0',
											}
										}, '编辑信息'),
									this.$auth['199'] && h(DropdownItem, {
										props: {
											name: '1'
										},
									}, '完善简历'),
									this.$auth['200'] && h(DropdownItem, {
										props: {
											name: '2'
										}
									}, '完善资料'),
									params.row.url !== '' && this.$auth['202'] && h(DropdownItem, {
										props: {
											name: '3',
										}
									}, [
										h(Copy, {
											props: {
												value: `${params.row.url}`
											},
											on: {
												'after': () => {
													this.$Message.success('链接复制成功，请发送给对应员工');
												}
											}
										},
										"完善资料链接")
									]),
									// ************************
									params.row.resume_url !== '' && this.$auth['199'] && h(DropdownItem, {
										props: {
											name: '3',
										}
									}, [
										h(Copy, {
											props: {
												value: `${params.row.resume_url}`
											},
											on: {
												'after': () => {
													this.$Message.success('链接复制成功，请发送给应聘者');
												}
											}
										},
										"完善简历链接")
									]),
									// ********************
									this.$auth['201'] && h(DropdownItem, {
										props: {
											name: '4'
										}
									}, '办理入职')
								])
							])
						);
					}
				});
			}
			return columnsShow;
		},
		handleResetCur() {
			this.$store.commit('HR_SUMMARY_LIST_RESET', {
				type: this.type
			});
		},
		handleLinkTo(id, name) {
			const {
				query = {}
			} = this.$route;
			this.$router.push(getHashUrl(
				'/hr/employee/summary/details', {
					staff_id: id,
					staff_name: name,
					...query,
					type: 1
				}
			));
		},
		handleClick(name, params) {
			switch (name) {
				case '0':
					AuditModal.popup({
						title: "编辑资料",
						applicant_id: params.row.applicant_id,
						info: {}
					}).then(res => {
						this.$store.commit("HR_SUMMARY_LIST_INIT");
					});
					break;
				case '1':
					this.$router.push(
						'/hr/employee/summary/resume?applicant_id=' + params.row.applicant_id + '&print=1',
					);
					break;
				case '2':
					this.$router.push(
						'/hr/employee/summary/profile?applicant_id=' + params.row.applicant_id,
					);
					break;
				case '4':
					this.$router.push(
						'/hr/employee/summary/entry?applicant_id=' + params.row.staff_id,
					);
					break;
				default:
					break;
			}
		}

	}
};
