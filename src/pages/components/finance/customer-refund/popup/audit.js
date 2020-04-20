import { ConfirmWithRemark } from "@components/sale/_common/customer/confirm-remark";
import { AuditProductRefund } from './audit-product-refund';
import { AuditLeftRefund } from './audit-left-refund';

export const auditReject = (refundId) => new Promise((resolve, reject) => {
	ConfirmWithRemark.popup({
		title: '驳回申请',
		label: '驳回说明:',
		placeholder: "请填写驳回说明",
		required: true,
		okCallback: (remark) => {
			return app.$request({
				url: "_FINANCE_CUSTOMER_REFUND_MONEY_AUDIT_POST",
				type: "POST",
				param: {
					refund_id: refundId,
					remarks: remark,
					type: 2 // 1 通过 2 驳回
				},
				loading: false,
			}).then(res => {
				app.$Message.success(res.msg);
				resolve(res);
				return res;
			}).catch((res) => {
				app.$Message.error(res.msg);
				return res;
			});
		}
	}).catch(err => {
		err && console.error(err);
		reject(err);
	});

});
export const auditPass = ({ refundId, contractId, refundType }) => {
	const modal = { 1: AuditProductRefund, 3: AuditLeftRefund }[refundType];
	return modal.popup({ refundId, contractId });
};
