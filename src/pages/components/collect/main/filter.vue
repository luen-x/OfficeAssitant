<template>
	
	<div class="g-gray-bg-mid">
		<i-input
			v-model="keyword" 
			placeholder="请输入标题、内容进行搜索" 
			style="width: 300px"
			clearable
			@on-enter="handleSearch"
			@on-change="handleClear"
		/>
		<i-button 
			type="primary"
			class="g-m-l-10"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<span v-if="$auth[1] && $auth[360]" class="g-fr g-m-r-30">
			<span>快捷入口：</span>
			<i-button 
				class="g-m-l-10"
				@click="handleLinkCase"
			>
				客户案例
			</i-button>
			<i-button 
				class="g-m-l-10"
				@click="handleLinkCircle"
			>
				发圈素材
			</i-button>
		</span>
		<i 
			class="iconfont icon-close g-pointer g-absolute" 
			style="top: 0px;right: 0px;" 
			@click="goBack"
		/>
		
	</div>
	
</template>

<script>
import { Input, Button } from 'iview';
import { getParseUrl, getHashUrl, goBack, getItem } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/collect/main', 
				{ 
					...this.$route.query, 
					keyword: this.keyword,
				}
			));
			this.$store.commit('COLLECT_MAIN_LIST_INIT');
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleLinkCase() {
			this.$router.push('/sale/main/case');

		},
		handleLinkCircle() {
			this.$router.push('/sale/main/circle');

		},
		goBack() {
			const closePath = getItem('closePath_' + _global.version);
			goBack(closePath);
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
