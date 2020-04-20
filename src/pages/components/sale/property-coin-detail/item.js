import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		return {
			tag: ['结算类型', '旧资料更新', '标记资料', 'OA打电话', '跟进记录',
				'发起举报', '录入到账', '下单', '错误的公司关联', '手动变更', '道具'],
			columns: [
				{
					title: '分类',
					key: 'status',
					width: 500,
					render: (h, { row }) => {
						return (
							<div>
								<div class="g-inline-block g-m-r-20">
									<AutoTooltip
										content={row.content}
										theme="dark"
										placement="bottom"
										width="300px"
										labelClass="g-c-black3"
									/>
								</div>
								{row.scene_name ? <div
									class="g-inline-block"
									style="color: #fff; background-color: #E84C57;padding: 3px 4px 3px 4px;border-radius: 3px;">
									{row.scene_name}
								</div> : ''
								}
							</div>
						);
					}
				},
				{
					title: '创建时间',
					key: 'create_time'
				},
				{
					title: '收入',
					key: 'income',

				},
				{
					title: '状态',
					key: 'is_settle',
				}
			],
		};
	},
	computed: {
		getColumns() {
			let columns = [...this.columns];
			if (this.type != 0) {
				columns[1].title = this.type == 2 ? '失效时间' : '结算时间';
				columns[1].key = 'update_time';
			} else {
				columns[1].title = '创建时间';
				columns[1].key = 'create_time';
			}
			return columns;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_PROPERTY_COIN_DETAIL_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_PROPERTY_COIN_DETAIL_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

