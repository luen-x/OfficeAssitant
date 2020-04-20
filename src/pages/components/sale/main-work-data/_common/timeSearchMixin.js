import moment from 'moment';

export default {
	data() {
		return {
			datePickerOption: {
				shortcuts: [
					 {
						text: '上周',
						value() {
							const startDate = moment().week(moment().week() - 1).startOf('week').toDate();
							const endDate = moment().week(moment().week() - 1).endOf('week').toDate();
							return [startDate, endDate];
						}
					},
					{
						text: '本周',
						value() {
							const startDate = moment().startOf('week').toDate();
							const endDate = moment().endOf('week').toDate();
							return [startDate, endDate];
						}
					},
					{
						text: '上月',
						value() {
							const startDate = moment().month(moment().month() - 1).startOf('month').toDate();
							const endDate = moment().month(moment().month() - 1).endOf('month').toDate();
							return [startDate, endDate];
						}
					},
					{
						text: '本月',
						value() {
							const startDate = moment().month(moment().month()).startOf('month').toDate();
							const endDate = moment().month(moment().month()).endOf('month').toDate();
							return [startDate, endDate];
						}
					}
				]
			}
		};

	},
	mounted() {
		this.lastDateRange = [...this.query.dateRange];
	},
	methods: {
		handleTimeChange(dates) {
			if (dates[0] && dates[1]) {
				if (moment(dates[1]).toDate().getTime() - moment(dates[0]).toDate().getTime() > 180 * 24 * 60 * 60 * 1000) {
					this.$Message.warning('多可选择时间跨度为180天的数据进行统计，请重新进行选择');
					this.query.dateRange = [...this.lastDateRange];
					return;
				}
				this.lastDateRange = [...dates];
				this.handleSearch();
			} 
		},
		
	},
};