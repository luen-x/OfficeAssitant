<template>
	<div>
		<div>
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
					:value="item.project_id + ''"
				>{{ item.project_name }}</i-option>
			</i-select>
			<i-input
				v-model.trim="keywords.search" 
				clearable
				placeholder="请输入需求点/所属板块/所属经理搜索" 
				style="width:220px;height:32px;" 
				class="g-m-l-5"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button 
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				查询
			</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { parse } from 'path';

export default {
	name: 'oa-share-progress-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
	},
	data() {
		const { query = {} } = this.$route;

		return {
			show: false,
			projectList: [],
			keywords: {
				search: '', // 功能点、所属板块、提出人
				...query,
				project_id: query.project_id === undefined ? '' : query.project_id + '',
			}
		};
	},
	mounted() {
		this.loadProjectList();
	},
	methods: {
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			let { query = {} } = getParseUrl();

			this.$router.replace(getHashUrl(
				'/tech/share/progress',
				{
					...query,
					...this.keywords
				}
			));
			this.$store.commit('TECH_SHARE_PROGRESS_LIST_INIT');
		}, 300),
		/**
		 * 加载项目
		 */
		loadProjectList() {
			this.$request({
				url: 'TECH_PROJECT_PLAN_OVERVIEW_LIST_GET',
				type: 'GET',
				loading: false,
				param: { 
					is_page: 0
				},
				autoTip: false
			}).then(res => {
				if (Array.isArray(res.data.list) && res.data.list.length) {
					this.projectList = res.data.list;
				}
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleProjectChange(project_id) {
			let { query = {} } = getParseUrl();

			this.$router.replace(getHashUrl(
				'/tech/share/progress',
				{
					...query,
					...this.keywords,
					project_id
				}
			));
			this.$vc.emit('TECH_SHARE_PROGRESS_PROJECT_CHANGE', { project_id });
		}
	}
};

</script>

<style lang="scss">

</style>
