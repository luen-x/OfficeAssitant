import { Divider } from 'iview';
import { ConfirmModal } from '@components/hr/_common/popup/confirm';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { AddModal } from './popup/add';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					minWidth: 120,
					fixed: 'left',
					key: 'staff_name',
					render: (h, { row }) => {
						return (
							<span class="g-operation" onClick={(e) => this.handleLinkTo(row)}>{ row.staff_name }</span>
						);
					}
				},
				{
					title: '手机号码',
					minWidth: 120,
					fixed: 'left',
					key: 'mobile'
				},
				{
					title: '工号',
					minWidth: 120,
					key: 'staff_number'
				},
				{
					title: '入职时间',
					minWidth: 120,
					key: 'create_time'
				},
				{
					title: '工龄',
					minWidth: 120,
					key: 'work_age'
				},
				{
					title: '所属部门',
					minWidth: 150,
					key: 'depart_name',
					tooltip: true
				},
				{
					title: '员工职位',
					minWidth: 120,
					key: 'position_name'
				},
				{
					title: '出勤天数',
					minWidth: 120,
					key: 'presence_day'
				},
				{
					title: '缺勤天数',
					minWidth: 120,
					key: 'absence_day'
				},
				{
					title: '全勤奖金',
					minWidth: 120,
					key: 'full_bonus'
				},
				{
					title: '操作',
					minWidth: 150,
					fixed: 'right',
					render: (h, { row }) => {
						return (
							<div>
								{ this.$auth[906] && <span class="g-operation" onClick={() => this.handleEdit(row)}>编辑</span> }
								{ this.$auth[906] && this.$auth[907] && <Divider type="vertical"/> }
								{ this.$auth[907] && <span class="g-operation" onClick={() => this.handleDel(row.attendance_id)}>删除</span> }
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_EMPLOYEE_CHECK_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_EMPLOYEE_CHECK_LIST_RESET', { type: this.type });
		},
		handleLinkTo(row) {
			this.$router.push(getHashUrl('/hr/employee/summary/details', {
				staff_id: row.staff_id,
				staff_name: row.staff_name,
				type: '1'
			}));
		},
		handleDel(attendance_id) {
			ConfirmModal.popup({
				content: '是否删除该员工的考勤记录，删除了可就无法撤销咯。'
			}).then(res => {
				this.$request({
					url: '_HR_EMPLOYEE_CHECK_DEL_POST',
					type: 'POST',
					param: {
						attendance_id
					},
					loading: false
				}).then(info => {
					this.$store.commit('HR_EMPLOYEE_CHECK_LIST_RESET');
					this.$Message.success(info.msg);
				}).catch(err => {
					this.$Message.success(err.msg);
				});
			}).catch(err => {

			});
		},
		handleEdit(row) {
			AddModal.popup({
				info: row,
				isEdit: true
			}).then(res => {
				this.$store.commit('HR_EMPLOYEE_CHECK_LIST_RESET');
			}).catch(err => {

			});
		}
	}
};

