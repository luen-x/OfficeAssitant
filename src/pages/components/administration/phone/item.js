import { Divider } from "iview";
import { AuditModal } from './popup/audit';
import { TipModal } from './popup/tip.vue';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 200,
					fixed: "left",
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 120,
				},
				{
					title: '工号',
					key: 'staff_number',
					minWidth: 120,
				},
				{
					title: '性别',
					key: 'sex',
					minWidth: 100,
				},
				{
					title: '部门',
					key: 'list_depart_name',
					minWidth: 200,
				},
				{
					title: '职位',
					key: 'position_name',
					minWidth: 200,
				},
				{
					title: '坐席号',
					key: 'seat_number',
					minWidth: 120,
				},
				{
					title: '外线号码',
					key: 'pstn_number',
					minWidth: 120,
				},
				{
					title: '座机号',
					key: 'tel',
					minWidth: 120,
				},
				{
					title: "操作",
					key: "action",
					fixed: "right",
					width: 160,
					align: 'center',
					render: (h, params) => {
						return h('span', {}, [
							this.$auth[1028] && h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: () => {
										this.handleEdit(params.row);
									}
								}
							}, '编辑信息'),
						
							this.$auth[1028] && this.$auth[1029] && h(Divider, {
								props: {
									type: 'vertical'
								}
							}, ''),
							this.$auth[1029] && h('span', {
								class: "g-c-blue-mid g-pointer",
								on: {
									click: () => {
										this.handleTip(params.row.staff_id);
									}
								}
							}, '回收话机')
						]);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('ADMINISTRATION_PHONE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ADMINISTRATION_PHONE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleEdit(RowData) {
			AuditModal.popup({
				addType: false,
				EditData: RowData
			}).then(res => {}).catch(err => {});
		},
		handleTip(staff_id) {
			TipModal.popup({ staff_id }).then(res => {}).catch(err => {});
		},
	}
};

