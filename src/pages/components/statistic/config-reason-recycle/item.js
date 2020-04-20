import { Confirm } from "@components/_common/confirm/confirm";
import { SpecificReason } from "../config-reason/modal/specific-reason";

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
					title: '回收时间',
					key: 'update_time',
					minWidth: 160
				},
				{
					title: '回收人',
					key: 'update_staff_name',
					minWidth: 120
				},
				(this.$auth[1809] || this.$auth[1810]) && {
					title: '操作',
					key: '',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div class="g-flex g-operation">
								{!!this.$auth[1809] && <div onClick={() => this.handleEdit(row)}>
									编辑
								</div>}
								{!!this.$auth[1809] && !!this.$auth[1810] && <div class="g-m-lr-10">|</div>}
								{!!this.$auth[1810] && <div onClick={() => this.handleRecover(row)}>
									恢复
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
			this.$store.commit('STATISTIC_CONFIG_REASON_RECYCLE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_CONFIG_REASON_RECYCLE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleEdit(row) {
			SpecificReason.popup({
				category: this.$parent.$children[1].category,
				reason_name: row.reason_name,
				category_id: row.category_id,
				reason_id: row.reason_id,
				url: 'STATISTIC_CONFIG_REASON_RECYCLE_LIST_INIT'
			}).then(res => {
				this.handleResetFirst();
			});

		},
		handleRecover(row) {
			Confirm.popup({
				title: '',
				msg: '恢复后，该原因将正常进入原因配置列表中，在退款时可被重新选择',
				showIcon: true
			}).then(res => {
				this.$request({
					url: '_STATISTIC_CONFIG_REASON_REFUND_DELETE_POST',
					type: "POST",
					param: {
						reason_ids: [row.reason_id],
						is_delete: 0
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