<template>
	<div class="v-worksheet-control-project-filter g-flex g-jc-sb js-filter">
		<div>
			<i-input
				v-model.trim="keywords.system_name"
				clearable
				placeholder="请输入项目名称" 
				style="width:220px;height:32px;" 
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
			<i-button v-if="$auth[1509]" class="_btn" @click="handleAdd">新建项目</i-button>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button
	},
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			keywords: {
				system_name: '', // 项目名称
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
				'/worksheet/control/project', 
				this.keywords
			));
			this.$store.commit('WORKSHEET_CONTROL_PROJECT_LIST_INIT');
		}, 300),
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
		/**
		 * 新建项目
		 */
		handleAdd() {
			this.$router.push({
				path: '/worksheet/control/project/add',
				query: {
					action: 'add'
				}
			});
		}
	}
};

</script>

<style lang="scss">
.v-worksheet-control-project-filter {
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
