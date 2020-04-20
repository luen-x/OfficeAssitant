<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="company"
				:maxlength="50"
				clearable
				placeholder="请输入公司名称或姓名" 
				style="width: 320px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span 
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle" 
			>
				更多搜索条件
				<i 
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="staff" 
					clearable
					class="g-m-r-5"
					placeholder="请输入申请人姓名/电话" 
					style="width: 220px"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-date-picker
					v-model="start_end"
					clearable
					transfer
					type="daterange" 
					split-panels
					placeholder="请选择申请时间开始/结束"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			company: String(query.company || ''),
			staff: String(query.staff || ''),
			start_end: String(query.start_end || ''),
			start_time: "", // 申请开始时间
			end_time: "", // 申请结束时间
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.start_time = this.start_end[0]
			    && moment(this.start_end[0]).format("YYYY-MM-DD");
			this.end_time = this.start_end[1]
				&& moment(this.start_end[1]).format("YYYY-MM-DD");
				
			this.$router.replace(getHashUrl(
				'/hr/employee/score/service/complaints', 
				{ 
					...this.$route.query, 
					fixPosition: true,
					company: this.company,
					staff: this.staff,
					start_time: this.start_time,
					end_time: this.end_time
				}
			));
			
			this.$store.commit('HR_EMPLOYEE_SCORE_SERVICE_COMPLAINTS_LIST_INIT');
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
