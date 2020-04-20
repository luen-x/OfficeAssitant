import { Divider } from 'iview';
import { PositionModal } from './popup/edit-position';
import { DelTipModal } from './popup/delete-tip';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 60,
				},
				{
					title: '职位名称',
					key: 'position_name',
					tooltip: true
				},
				{
					title: '职位描述',
					key: 'description',
					tooltip: true
				},
				{
					title: '是否用于招聘',
					key: 'is_applicant_use_name',
				},
				{
					title: '职位用途',
					key: 'position_use_name',
				},
				{
					title: '职位人数',
					key: 'num',
				},
				{
					title: '操作',
					render: (h, params) => {
						return (
							<div class="g-flex-ac">
								{this.$auth[276] && <span
									class="g-operation"
									onClick={() => this.handleEdit({
										...params.row
									})}
								>
									编辑
								</span>}
								{this.$auth[276] && this.$auth[277] && <span style={{ padding: '0 3px' }}><Divider type="vertical" /></span>}
								{this.$auth[277] && <span class="g-operation" onClick={() => this.handleDel(params.row)}>
									删除
								</span>}
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_POSITION_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_POSITION_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleEdit(info) {
			PositionModal.popup({
				title: '修改职位',
				type: 'edit',
				info
			}).then((res) => {

			}).catch((res) => {

			});
		},
		handleDel(item) {
			let canDel = parseInt(item.num, 10) == 0;
			let content = !canDel ? '存在职位人数不为0，不可批量删除' : '是否确定删除该职位';
			DelTipModal.popup({
				title: '删除提示',
				content,
				positionIds: [item.position_id],
				canDel
			}).then((res) => {

			}).catch((res) => {

			});
		}
	}
};

