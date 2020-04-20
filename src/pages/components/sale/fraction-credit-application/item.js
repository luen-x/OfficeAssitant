import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { Confirm } from '@components/_common/confirm/confirm';
import { FractionCreditApplicationView } from './popup/view';
import { FractionCreditApplicationEdit } from './popup/edit';

export default {
	data() {
		const baseColumns = [
			{
				title: '申请项目',
				key: 'audit_type',
				minWidth: 150,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.audit_type}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '学分类型',
				key: 'type_name',
				minWidth: 120
			},
			{
				title: '凭证信息',
				key: 'url',
				minWidth: 120,
				render: (h, { row }) => {
					return (
						<span 
							class="g-c-blue-mid g-pointer"
							onClick={() => { this.handleViewCert(row); }}
						>
							图片查看
						</span>
					);
				}
			},
			{
				title: '备注',
				key: 'remarks',
				minWidth: 150,
				render: (h, { row }) => {
					return (
						<div>
							<AutoTooltip 
								content={row.remarks}
								theme="dark"
								placement="bottom"
								labelClass="g-c-black3"
							/>
						</div>
					);
				}
			},
			{
				title: '申请日期',
				key: 'create_time',
				minWidth: 160
			},
			{
				title: '操作',
				key: 'opt',
				width: 135,
				render: (h, { row }) => {
					return (
						<div class="g-operation">
							<span 
								onClick={() => {
									this.handleEdit(row);
								}}
							>
								重新编辑
							</span>
							<span class="g-pd-lr-10">|</span>
							<span 
								onClick={() => {
									this.handleReset(row);
								}}
							>
								撤回
							</span>
						</div>
					);
				}
			}
		];
		return {
			baseColumns,
			showColumns: [...baseColumns]
		};
	},
	methods: {
		handleReset(row) {
			Confirm.popup({
				title: '提示',
				msg: '是否要撤回申请？撤回申请后该条内容将消失。'
			}).then(() => {
				this.$request({
					url: '_SALE_TRAIN_CREDIT_WITHDRAW_POST',
					type: "POST",
					loading: false,
					param: {
						apply_id: row.apply_id
					},
					autoTip: true
				}).then(() => {
					this.$store.commit('SALE_FRACTION_CREDIT_APPLICATION_LIST_RESET', { status: this.type });
				});
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleEdit(row) {
			FractionCreditApplicationEdit.popup({
				title: '重新编辑',
				applyId: row.apply_id,
				typeId: row.type_id,
				ruleId: row.rule_id,
				ruleInfoId: row.rule_info_id,
				remarks: row.remarks,
				url: row.url
			}).then(() => {
				this.$store.commit('SALE_FRACTION_CREDIT_APPLICATION_LIST_RESET', { status: this.type });
			}).catch((error) => {
				error && console.error(error);
			});
		},
		handleViewCert(row) {
			FractionCreditApplicationView.popup({
				title: '凭证查看',
				fileImage: row.url
			}).catch((error) => {
				error && console.error(error);
			});
		}
	},
};

