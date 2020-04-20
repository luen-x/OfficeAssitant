import { EditTimeRange } from './popup/edit-time-range';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					width: 150,
					fixed: 'left',
					render: (h, { row }) => {
						return (
							<div class="g-operation" onClick={() => { this.handleCustomerDetail(row); }}>
								{row.staff_name}
							</div>
						);
					}
				},
				{
					title: '添加客户',
					key: 'add_num',
					minWidth: 90
				},
				{
					title: '领取客户',
					key: 'get_num',
					minWidth: 90
				},
				{
					title: '拨号数量',
					key: 'call_num',
					minWidth: 90
				},
				{
					title: '接通数量',
					key: 'connect_num',
					minWidth: 90
				},
				{
					title: '接通率',
					key: 'connect_rate',
					minWidth: 80
				},
				{
					title: '总通话时长',
					key: 'total_call_time',
					minWidth: 100
				},
				{
					title: '平均通话时长',
					key: 'avg_call_time',
					minWidth: 110
				},
				{
					title: '最长通话时长',
					key: 'max_call_time',
					minWidth: 110
				},
				{
					title: '接通120秒以上电话',
					key: 'connect_num_count',
					minWidth: 160,
					renderHeader: (h, { data }) => {
						return (
							<span>
								<span>接通{this.maxCallTime}秒以上电话</span>
								<i class="icon iconfont icon-bianji g-operation" onClick={() => this.handleEditHead()}/>
							</span>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SALE_MAIN_WORK_DATA_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SALE_MAIN_WORK_DATA_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleCustomerDetail(row) {
			this.$route.query;
			this.$router.push({
				path: '/sale/main/work/data/detail',
				query: {
					staff_id: row.staff_id,
					staff_name: row.staff_name,
					start_time: this.$route.query.start_time,
					end_time: this.$route.query.end_time,
					config_time: this.maxCallTime
				}
			});
			// customerDetail.popup({
			// 	staff_id: row.staff_id,
			// 	search_month: this.$route.query.month || ''
			// }).then({}).catch();
			// this.$vc.emit("SALE_CLOSE_CUSTOMER_DETAIL");
		},
		handleEditHead() {
			EditTimeRange.popup({
				time: this.maxCallTime
			}).then((res) => {
				this.maxCallTime = res.call_time;
				this.handleResetFirst();
			}).catch(e => e && console.error(e));


		}
	}
};

