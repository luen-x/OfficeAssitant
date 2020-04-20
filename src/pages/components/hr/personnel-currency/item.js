import AutoTooltip from '@common/auto-tooltip/auto-tooltip';

export default {
	data() {
		return {
			columns1: [
				{
					title: '分类',
					key: 'status',
					width: 500,
					render: (h, { row }) => {
						return (
							<div >
								<div class="g-inline-block g-m-r-20">
									<AutoTooltip
										content={row.content}
										theme="dark"
										placement="bottom"
										width="300px"
										labelClass="g-c-black3"
									/>
								</div>
								{ row.scene_name ? <div
									class="g-inline-block"
									style="color: #fff; background-color: #E84C57;padding: 3px 4px 3px 4px;border-radius: 3px;">
									{row.scene_name}
								</div> : '' }

							</div>
						);
					}
				},
				{
					title: '创建时间',
					key: 'create_time',
				},
				{
					title: '收支',
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
		columns() {
			if (this.type != 0) {
				this.columns1[1].title = this.type == 2 ? '失效时间' : '结算时间';
				this.columns1[1].key = 'update_time';
			} else {
				this.columns1[1].title = '创建时间';
				this.columns1[1].key = 'create_time';
			}
			return this.columns1;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_PERSONNEL_CURRENCY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_PERSONNEL_CURRENCY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

