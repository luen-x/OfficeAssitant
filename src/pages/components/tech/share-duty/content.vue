<template>
	<div class="v-tech-share-duty">
		<div class="g-pd-b-20">
			<i-select
				v-model="keywords.project_id"
				class="_project"
				transfer
				style="width: 220px;"
				@on-change="handleProjectChange"
			>
				<i-option 
					v-for="(item, index) in projectList" 
					:key="index"
					:value="item.project_id"
				>{{ item.project_name }}</i-option>
			</i-select>
		</div>
		<div class="g-tc">
			<oa-main-calendar 
				:datas="calendarData" 
				@reload="loadData"
			/>
		</div>
	</div>
</template>

<script>
import { Select, Option } from 'iview';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import MainCalendar from './_common/main-calendar';

export default {
	name: 'oa-tpl',
	components: {
		'i-select': Select,
		'i-option': Option,
		'oa-main-calendar': MainCalendar
	},
	data() {
		const { query = {} } = this.$route;
		return {
			calendarData: {},
			projectList: [],
			keywords: {
				project_id: +query.project_id || ''
			}
		};
	},
	async mounted() {
		await this.loadProjectList();
		await this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData(month) {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: '_TECH_PROJECT_SCHEDULE_LIST_GET',
				type: 'GET',
				loading: false,
				param: {
					...query,
					...this.keywords,
					month: month || moment(Date.now()).format('YYYY-MM')
				},
				autoTip: false
			}).then((res) => {
				this.calendarData = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 加载项目
		 */
		loadProjectList() {
			let { query = {} } = getParseUrl();
			return this.$request({
				url: 'TECH_PROJECT_PLAN_OVERVIEW_LIST_GET',
				type: 'GET',
				loading: false,
				param: { 
					is_page: 0
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data.list) && res.data.list.length) {
					this.keywords.project_id = query.project_id ? +query.project_id : res.data.list[0].project_id;
					this.projectList = res.data.list;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 选择项目
		 */
		handleProjectChange(project_id) {
			this.keywords.project_id = project_id;
			this.$router.replace(getHashUrl('/tech/share/duty', { 
				...this.keywords 
			}));
			this.loadData();
		}
	},
};
</script>

<style lang="scss">
.v-tech-share-duty {
	display: flex;
    padding: 20px;
    color: #333333;
    box-sizing: content-box;
    overflow: hidden;
	flex-direction: column;
	._project {
		.ivu-select-selection,.ivu-select-visible {
			border-color: #dcdee2;
			box-shadow: 0 0 0 2px transparent;
		}
	}
}
</style>
