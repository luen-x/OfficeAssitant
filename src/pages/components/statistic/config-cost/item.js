import { Tooltip } from "iview";
import { EditModal } from "./modal/edit";
import { RelevanceModal } from "./modal/relevance";

export default {
	data() {
		const columns = [
			{
				title: '产品名称',
				key: 'product_alias',
				minWidth: 160
			},
			{
				title: '产品类型',
				key: 'category_name',
				minWidth: 160
			},
			{
				title: '成本归属',
				key: 'category_name',
				minWidth: 220,
				render: (h, { row }) => {
					return (
						<div>{row.depart.depart_name.join('/')}</div>
					);
				}
			},
			{
				title: '关联产品',
				key: 'relations',
				minWidth: 220,
				render: (h, { row }) => {
					let productName = [];
					let productNameString = '';

					row.relations.forEach(item => {
						productName.push(item.product_name);
					});

					productNameString = productName.join(";");
					
					if (productNameString.length > 16) {
						return (
							<Tooltip content={productNameString} max-width={250}>
								<div>{ productNameString.slice(0, 16) + '...' }</div>
							</Tooltip>
						);
					} else {
						return (
							<div>{ productNameString }</div>
						);
					}
				}
			}
			
		];
		if (this.$auth[1803] || this.$auth[1804]) {
			columns.push({
				title: '操作',
				key: '',
				minWidth: 160,
				render: (h, { row }) => {
					return (
						<div class="g-flex g-operation">
							{!!this.$auth[1803] && <div
								onClick={() => {
									EditModal.popup({
										productAlias: row.product_alias,
										departId: row.depart.depart_id,
										categoryId: row.category_id,
										productId: row.product_id
									}).then(res => {
										res && this.handleResetFirst();
									});
								}}
							>
								编辑
							</div>}
							{!!this.$auth[1803] && !!this.$auth[1804] && <div class="g-m-lr-10">|</div>}
							{!!this.$auth[1804] && <div
								onClick={() => {
									RelevanceModal.popup({
										productId: row.product_id
									}).then(res => {
										res && this.handleResetFirst();
									});
								}}
							>
								关联
							</div>}
						</div>
					);
				}
			});
		}
		return {
			columns
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('STATISTIC_CONFIG_COST_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('STATISTIC_CONFIG_COST_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		}
	}
};