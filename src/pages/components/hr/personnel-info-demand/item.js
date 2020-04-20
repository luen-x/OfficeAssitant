import { EmployeeDemandEdit } from './popup/demand-edit';

export default {
	data() {
		const baseColumns = [
			{
				title: '职位名称',
				key: 'position_name',
				minWidth: 120
			},
			{
				title: '部门',
				key: 'depart_name',
				minWidth: 150,
			},
			{
				title: '急需人数',
				key: 'need_number',
				minWidth: 90
			},
			{
				title: '已分配人数',
				key: 'assigned_number',
				minWidth: 90
			},
			{
				title: '人员标准',
				key: 'staff_standard',
				minWidth: 120
			}
		];
		return {
			baseColumns,
			showColumns: [...baseColumns]
		};
	},
	methods: {
		handleEdit(row) {
			EmployeeDemandEdit.popup({
				needId: row.need_id
			}).then(() => {
				this.$store.commit('HR_PERSONNEL_INFO_DEMAND_LIST_INIT');
			}).catch((error) => {
				error && console.error(error);
			});
		}
	}
};