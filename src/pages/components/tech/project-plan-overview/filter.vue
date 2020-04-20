<template>
	<div class="v-tech-project-plan-overview-filter g-flex g-jc-sb js-filter">
		<div>
			<i-input
				v-model.trim="keywords.search" 
				clearable
				placeholder="请输入项目名称" 
				style="width:300px;height:32px;" 
				class="g-m-r-5"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
				class="g-m-r-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
		<div>
			<i-button v-if="$auth[1412]" class="_btn" @click="handleAdd">新建项目</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { ProjectPlanOverviewEdit } from './popup/project-edit';

export default {
	name: 'oa-project-plan-overview-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keywords: {
				search: '', // 项目名称
				...query
			}
		};
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
			this.$router.replace(getHashUrl(
				'/tech/project/plan/overview', 
				this.keywords
			));
			this.$store.commit('TECH_PROJECT_PLAN_OVERVIEW_LIST_INIT');
		}, 300),
		/**
		 * 新建项目
		 */
		handleAdd() {
			ProjectPlanOverviewEdit.popup({
				title: '新建项目'
			}).then(() => {
				this.$store.commit('TECH_PROJECT_PLAN_OVERVIEW_LIST_INIT');
			}).catch(error => {
				error && console.error(error);
			});
		}
	}
};

</script>

<style lang="scss">
.v-tech-project-plan-overview-filter {
	._btn {
		border-color: #e84854;
		color: #e84854;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
}
</style>
