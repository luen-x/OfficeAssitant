import { Confirm } from "@components/_common/confirm/confirm";
import { SpecificReason } from './modal/specific-reason';

export default {
	data() {
		
		return {
			columns: [
				{
					title: '退款原因',
					key: 'reason_name',
					minWidth: 220
				},
				{
					title: '原因大类',
					key: 'category_name',
					minWidth: 120
				},
				{
					title: '添加时间',
					key: 'create_time',
					minWidth: 160
				},
				{
					title: '添加人',
					key: 'staff_name',
					minWidth: 120
				},
				{
					title: '修改时间',
					key: 'update_time',
					minWidth: 160
				},
				{
					title: '修改人',
					key: 'update_staff_name',
					minWidth: 120
				},
				(this.$auth[1811] || this.$auth[1812]) && {
					title: '操作',
					key: '',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div class="g-flex g-operation">
								{!!this.$auth[1811] && <div onClick={() => this.handleEdit(row)}>
									编辑
								</div>}
								{!!this.$auth[1811] && !!this.$auth[1812] && <div class="g-m-lr-10">|</div>}
								{!!this.$auth[1812] && <div onClick={() => this.handleDelete(row)}>
									删除
								</div>}
							</div>
						);
					}
				}
			].filter(Boolean)
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_CONFIG_REASON_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_CONFIG_REASON_LIST_RESET', { type: this.type });
		},
		handleEdit(row) {
			SpecificReason.popup({
				category: this.$parent.$children[0].category,
				reason_name: row.reason_name,
				category_id: row.category_id,
				reason_id: row.reason_id,
				url: 'STATISTIC_CONFIG_REASON_LIST_INIT'
			}).then(res => {
				this.handleResetFirst();
			});

		},
		handleDelete(row) {
			Confirm.popup({
				title: '',
				msg: '删除后，退款申请时将选不到该原因，是否确认删除？',
				showIcon: true
			}).then(res => {
				this.$request({
					url: '_STATISTIC_CONFIG_REASON_REFUND_DELETE_POST',
					type: "POST",
					param: {
						reason_ids: [row.reason_id],
						is_delete: 1
					},
					loading: false
				}).then((re) => {
					this.$Message.success(re.msg);
					this.handleResetFirst();
				}).catch((error) => {
					this.$Message.error(error.msg);
				});
			});

		}
	}
};