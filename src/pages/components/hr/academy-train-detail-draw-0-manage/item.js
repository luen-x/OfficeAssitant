import { Dropdown, DropdownMenu, DropdownItem, Tooltip } from 'iview';

export default {
	data() {
		return {
			columns: [
				{
					type: 'selection',
					width: 50,
				},
				{
					title: '抽奖名称',
					key: 'lottery_topic',
					minWidth: 160,
				},
				{
					title: '抽奖时段',
					key: 'type_name',
					minWidth: 100
				},
				{
					title: '抽奖时间',
					key: 'create_time',
					minWidth: 150
				},
				{
					title: '操作',
					align: 'center',
					width: 120,
					fixed: 'right',
					render: (h, params) => {
						return (
							<Dropdown 
								style={{ cursor: 'pointer', width: '100%', height: '100%', textAlign: 'center' }}
								transfer
								placement="left-start"
								onOn-click={ (name) => this.handleOperate(name, params) }>
								<i class="iconfont icon-point" style={{ fontSize: '20px' }}></i>
								<DropdownMenu slot="list">
									<DropdownItem name="edit">编辑</DropdownItem>
									<DropdownItem name="provide">抽奖</DropdownItem>
									<DropdownItem name="draw">投影</DropdownItem>
									<DropdownItem name="result">结果</DropdownItem>
								</DropdownMenu>
							</Dropdown>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_0_MANAGE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_DRAW_0_MANAGE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(name, { row }) {
			if (name !== 'draw') {
				const targetPath = '/hr/academy/train/detail/draw/1/' + name;
				this.$router.push({
					path: targetPath,
					query: {
						lottery_id: row.lottery_id,
						project_id: this.$route.query.project_id,
						lottery_name: name === 'result' ? row.lottery_topic : ''
					}
				});
			} else {
				this.$router.push({
					path: '/draw',
					query: {
						project_id: this.$route.query.project_id,
						lottery_id: row.lottery_id,
					}
				});
			}
		}
	}
};

