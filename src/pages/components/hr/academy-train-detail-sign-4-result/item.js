import { Checkbox } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 130,
					render: (h, params) => {
						return h('div', {}, [
							h('span', {
							}, params.row.staff_name),
							h('span', {
							}, '（' + params.row.mobile + '）'),
							params.row.in_list ? '' : h('div', {
								class: "g-bg-red-mid",
								style: {
									display: 'inline-block',
									borderRadius: ' 3px',
									padding: '2px 10px',
									lineHeight: '20px',
									transform: 'scale(0.8)'
								}
							}, '名单外人员')
						]);
					}
				},
				{
					title: '请假',
					key: 'off_work',
					render: (h, params) => {
						let buttonOffWork = false;
						let statusArr = [params.row.sign_in, 
							params.row.sign_back, params.row.absence, 
							params.row.arrive_late, params.row.leave_early];
						statusArr.includes(1) ? buttonOffWork = true : '';
						return h('div', {}, [
							h(Checkbox, {
								props: {
									value: params.row.off_work,
									disabled: buttonOffWork,
									trueValue: 1,
									falseValue: 0,
								},
								on: {
									'input': (event) => {
										this.tableList[params.index].off_work = event;
										this.handleChangeItem(1, this.tableList[params.index]);
									},
								}
							}, '请假')
						]);
					}
				},
				{
					title: '签到',
					key: 'sign_in',
					minWidth: 50,
					render: (h, params) => {
						let buttonOffWork = false;
						let statusArr = [
							params.row.off_work,
							params.row.absence, 
							params.row.arrive_late];
						statusArr.includes(1) ? buttonOffWork = true : '';
						return h('div', {}, [
							h(Checkbox, {
								props: {
									value: params.row.sign_in,
									disabled: buttonOffWork,
									trueValue: 1,
									falseValue: 0
								},
								on: {
									'input': (event) => {
										this.tableList[params.index].sign_in = event;
										this.handleChangeItem(3, this.tableList[params.index]);
									},
								}
							}, '签到'),
							params.row.sign_in_time ? h('span', { class: 'g-c-black5' }, params.row.sign_in_time) : ''
						]);
					}
				},
				{
					title: '签退',
					key: 'sign_back',
					minWidth: 50,
					render: (h, params) => {
						let buttonOffWork = false;
						let statusArr = [
							params.row.off_work,
							params.row.absence, 
							params.row.leave_early];
						statusArr.includes(1) ? buttonOffWork = true : '';
						return h('div', {}, [
							h(Checkbox, {
								props: {
									value: params.row.sign_back,
									disabled: buttonOffWork,
									trueValue: 1,
									falseValue: 0
								},
								on: {
									'input': (event) => {
										this.tableList[params.index].sign_back = event;
										this.handleChangeItem(5, this.tableList[params.index]);
									},
								}
							}, '签退'),
							params.row.sign_back_time ? h('span', { class: 'g-c-black5' }, params.row.sign_back_time) : ''
						]);
					}
				},
				{
					title: '缺勤',
					key: 'absence',
					render: (h, params) => {
						let buttonOffWork = false;
						let statusArr = [params.row.sign_in, 
							params.row.sign_back, params.row.off_work, 
							params.row.arrive_late, params.row.leave_early];
						statusArr.includes(1) ? buttonOffWork = true : '';
						return h('div', {}, [
							h(Checkbox, {
								props: {
									value: params.row.absence,
									disabled: buttonOffWork,
									trueValue: 1,
									falseValue: 0
								},
								on: {
									'input': (event) => {
										this.tableList[params.index].absence = event;
										this.handleChangeItem(2, this.tableList[params.index]);
									},
								}
							}, '缺勤')
						]);
					}
				},
				{
					title: '迟到',
					key: 'arrive_late',
					minWidth: 50,
					render: (h, params) => {
						let buttonOffWork = false;
						let statusArr = [
							params.row.sign_in,
							params.row.off_work,
							params.row.absence];
						statusArr.includes(1) ? buttonOffWork = true : '';
						return h('div', {}, [
							h(Checkbox, {
								props: {
									value: params.row.arrive_late,
									disabled: buttonOffWork,
									trueValue: 1,
									falseValue: 0
								},
								on: {
									'input': (event) => {
										this.tableList[params.index].arrive_late = event;
										this.handleChangeItem(4, this.tableList[params.index]);
									},
								}
							}, '迟到'),
							params.row.arrive_late_time ? h('span', { class: 'g-c-black5' }, params.row.arrive_late_time) : ''
						]);
					}
				},
				{
					title: '早退',
					key: 'leave_early',
					render: (h, params) => {
						let buttonOffWork = false;
						let statusArr = [
							params.row.off_work,
							params.row.absence, 
							params.row.sign_back];
						statusArr.includes(1) ? buttonOffWork = true : '';
						return h('div', {}, [
							h(Checkbox, {
								props: {
									value: params.row.leave_early,
									disabled: buttonOffWork,
									trueValue: 1,
									falseValue: 0
								},
								on: {
									'input': (event) => {
										this.tableList[params.index].leave_early = event;
										this.handleChangeItem(6, this.tableList[params.index]);
									},
								}
							}, '早退')
						]);
					}
				}
			],
			tableList: [],
			methodList: [
				{
					id: 1,
					label: '线下面授'
				}, {
					id: 2,
					label: '岛屿PK'
				}, {
					id: 3,
					label: '座谈会'
				}, {
					id: 4,
					label: '茶话会'
				}, {
					id: 5,
					label: '线下视频'
				}, {
					id: 6,
					label: '线上视频'
				}, {
					id: 7,
					label: '其他'
				}
			]
		};
	},
	methods: {
		loadSignData() {
			let obj = {
				project_id: this.$route.query.project_id,
				sign_id: this.$route.query.sign_id
			};
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_SIGN_RESULT_GET, 
				type: "GET",
				param: obj,
				loading: false
			}).then((res) => {
				this.sign_list = res.data;
				this.sign = res.data[0].sign_id;
				// this.sign_id = +res.data[0].sign_id;
				this.$router.replace(getHashUrl('/hr/academy/train/detail/sign/4/result', { 
					project_id: this.$route.query.project_id,
					sign_id: this.$route.query.sign_id || res.data[0].sign_id,
					...this.$route.query
				}));
				this.sign_id = this.$route.query.sign_id || res.data[0].sign_id + '';
				this.loadData();
			}).catch((error) => {
				
			});
		},
		loadData() {
			let { query = {} } = getParseUrl();
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_SIGN_RESULT_RECORD_GET, 
				type: "GET",
				param: {
					...query,
				},
			}).then((res) => {
				this.tableList = res.data.list;
				this.totalCount = res.data.totalCount;
				this.page = res.data.currentPage;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleChangeItem(active_type, row) {
			let active_name = ['off_work', 'absence', 'sign_in', 'arrive_late', 'sign_back', 'leave_early'];
			let obj = {
				sign_id: this.$route.query.sign_id,
				mobile: row.mobile,
				type: active_type,
				status: row[active_name[active_type - 1]]
			};
			this.$request({
				url: API_ROOT._HR_ACADEMY_TRAIN_DETAIL_SIGN_RESULT_RECORD_CHANGE_POST, 
				type: "POST",
				param: obj,
				loading: false
			}).then((res) => {
				this.loadSignData();
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	}
};

