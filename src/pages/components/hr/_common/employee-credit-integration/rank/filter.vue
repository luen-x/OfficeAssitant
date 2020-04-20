<template>
	<div class="g-m-t-20">
		<div>
			<i-datepicker
				v-model="formdata.start_month"
				type="month" 
				placeholder="请选择开始月份" 
				style="width: 220px" 
				transfer
				@on-change="handleSearch"
			/>
			<i-datepicker
				v-model="formdata.end_month" 
				type="month"
				placeholder="请选择结束月份" 
				style="width: 220px" 
				class="g-m-l-5"
				transfer
				@on-change="handleSearch"
			/>
			<i-select
				v-model="formdata.depart_id" 
				placeholder="请选择一级部门"
				clearable  
				style="width: 220px" 
				class="g-m-l-5"
				@on-change="handleChange"
			>
				<i-option 
					v-for="item of stairArr"
					:key="item.depart_id"
					:value="item.depart_id + ''">{{ item.depart_name }}</i-option>
			</i-select>
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
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';
import MailInput from '@components/_common/mail-input/mail-input';
import moment from 'moment';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-datepicker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'oa-mail-input': MailInput
	},
	props: {
		cate: String,
		path: String,
		commit: String,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			formdata: {
				...query
			},
			stairArr: []
		};
	},
	mounted() {
		this.loadStairDepart();
		this.loadTab(this.formdata.depart_id);
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				this.path,
				{ 
					...this.formdata,
					start_month: this.formdata.start_month && moment(this.formdata.start_month).format('YYYY-MM'),
					end_month: this.formdata.end_month && moment(this.formdata.end_month).format('YYYY-MM')
				}
			));
			this.$store.commit(this.commit);
		},
		async handleChange(first_depart) {
			await this.loadTab(first_depart);
			this.handleSearch();
		},
		loadStairDepart() {
			this.$request({
				url: 'HR_STAIR_DEPART_GET',
				type: 'GET',
				loading: false
			}).then(res => {
				this.stairArr = res.data;
			}).catch(err => {

			});
		},
		loadTab(first_depart) {
			return this.request({
				url: this.cate === '1' ? 'HR_EMPLOYEE_SCORE_INTEGRATION_RANK_TABS_GET' : 'HR_EMPLOYEE_SCORE_CREDIT_RANK_TABS_GET',
				type: 'GET',
				param: {
					first_depart,
					cate: this.cate
				},
				loading: false
			}).then(res => {
			}).catch(err => {

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
