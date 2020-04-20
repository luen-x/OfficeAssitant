import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { RelationProduct } from './modal/relation-product';
import { Edit } from './modal/edit';

export default {
	data() {
		return {
			columns: [
				{
					title: '打分项',
					key: 'score_name',
					minWidth: 220,
					fixed: "left",
					render: (h, params) => {
						return (
							<AutoToolTip 
								content={params.row.score_name}
								width="180px"
								theme="dark"
								placement="bottom" 
								labelClass=" "
							/>
						);
					}
				},
				{
					title: '适用产品',
					key: 'product_items',
					minWidth: 160,
					render: (h, params) => {
						let product = params.row.product_items.join("、");

						if (product) {
							return (
								<AutoToolTip 
									content={product}
									width="120px"
									theme="dark"
									placement="bottom" 
									labelClass=" "
								/>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: '评分关联产品负责人',
					key: 'is_relate_charge',
					minWidth: 160,
					render: (h, params) => {
						return (
							<div>{params.row.is_relate_charge ? '是' : '否'}</div>
						);
					}
				},
				{
					title: '导出负责人',
					key: 'is_export_charge',
					minWidth: 100,
					render: (h, params) => {
						return (
							<div>{params.row.is_export_charge ? '是' : '否'}</div>
						);
					}
				},
				{
					title: '备注',
					key: 'remark',
					minWidth: 160,
					render: (h, params) => {
						if (params.row.remark) {
							return (
								<div class="g-pointer" onClick={() => this.handleEdit(params.row)}>
									<AutoToolTip 
										content={params.row.remark}
										width="120px"
										theme="dark"
										placement="bottom" 
										labelClass=" "
									/>
								</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: '上次更新时间',
					key: 'update_time',
					minWidth: 160,
					render: (h, params) => {
						if (params.row.update_time) {
							return (
								<div>{params.row.update_time}</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: '更新人',
					key: 'staff_name',
					minWidth: 120,
					render: (h, params) => {
						if (params.row.staff_name) {
							return (
								<div>{params.row.staff_name}</div>
							);
						} else {
							return (
								<div>--</div>
							);
						}
					}
				},
				{
					title: '操作',
					key: 'status',
					minWidth: 160,
					render: (h, params) => {
						return (
							<div class="g-flex g-pointer" style="color: #2397f9;">
								<div onClick={() => { this.handleRelationProduct(params.row.service_score_id); }}>关联产品</div>
								<div class="g-m-lr-5">|</div>
								<div onClick={() => { this.handleEdit(params.row); }}>编辑</div>
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SC_MANAGE_INSPECTION_GRADE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SC_MANAGE_INSPECTION_GRADE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleRelationProduct(service_score_id) {
			RelationProduct.popup({
				service_score_id: Number(service_score_id)
			}).then(res => {
				res && this.handleResetCur();
			});
		},
		handleEdit(value) {
			Edit.popup({
				service_score_id: Number(value.service_score_id),
				is_relate_charge: String(value.is_relate_charge),
				is_export_charge: String(value.is_export_charge),
				remark: value.remark
			}).then(res => {
				res && this.handleResetCur();
			});
		}
	}
};