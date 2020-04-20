<template>
	<div>
		<div>
			<i-input
				v-model="search" 
				placeholder="请输入邮件主题或发件人" 
				style="width: 220px"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>

			<i-datepicker
				v-model="create_time" 
				clearable
				transfer
				type="daterange" 
				split-panels
				placeholder="请选择发送开始/结束时间" 
				style="width: 220px;"
				formate="yyyy-MM-dd"
				class="g-m-l-10"
				@on-change="handleSearch"
			/>
			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'oa-filter',

	components: {
		'i-input': Input,
		'i-button': Button,
		'i-datepicker': DatePicker
	},

	data() {
		const { query = {} } = this.$route;

		return {
			search: String(query.search || ''), // 邮件主题或发件人
			create_time: [query.create_time_start, query.create_time_end],
			create_time_start: String(query.create_time_start || ''), // 发送开始
			create_time_end: String(query.create_time_end || ''), // 结束时间
			show: false
		};
	},

	methods: {
		handleSearch(event) {
			this.create_time_start = this.create_time[0]
			    && moment(this.create_time[0]).format("YYYY-MM-DD");
			this.create_time_end = this.create_time[1]
				&& moment(this.create_time[1]).format("YYYY-MM-DD");
				
			this.$router.replace(getHashUrl(
				'/sc/customer/cooperate/outbox', 
				{ 
					...this.$route.query, 
					search: this.search,
					create_time_start: this.create_time_start,
					create_time_end: this.create_time_end
				}
			));
			
			this.$store.commit('SC_CUSTOMER_COOPERATE_OUTBOX_LIST_INIT');
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};
</script>

<style lang="scss" scoped>
</style>