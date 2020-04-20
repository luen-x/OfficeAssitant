<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search" 
				placeholder="请输入内容标题搜索" 
				style="width: 300px" 
				@on-change="handleSearch"
				@on-enter="handleSearch"
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<span 
				v-if="$auth[1545]"
				class="g-red-btn-line g-fr" 
				@click="handleManage">类目管理</span>
			<span 
				v-if="$auth[1544]"
				class="g-red-btn-line g-m-r-10 g-fr"
				@click="handlePublish">发布内容</span>
		</div>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
	},
	props: {
		classList: Array
	},
	data() {
		const { query = {} } = this.$route;
		return {
			search: '',
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/information/publish', 
				{ 
					...this.$route.query, 
					search: this.search
				}
			));
			this.$store.commit('CONTENT_INFORMATION_PUBLISH_LIST_INIT');
		},
		handleManage() {
			this.$router.push('/content/information/publish/manage');
		},
		handlePublish() {
			if (this.classList && this.classList.length) {
				const category_id = this.$route.query.category_id || this.classList[0].category_id;
				this.$router.push(`/content/information/publish/content?category_id=${category_id}`);
			} else {
				this.$Message.error('你还没有建立任何类目哦，请先去类目管理中添加类目吧~');
			}
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
