<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="keyword" 
				placeholder="请输入关键字搜索" 
				style="width: 320px" 
			/>
			<i-button 
				type="primary"
				class="g-m-l-10"
				@click="handleSearch"
			>
				搜索
			</i-button>
			<i-button type="error" ghost class="g-fr">添加后端路由</i-button>
			<i-button type="error" ghost class="g-fr g-m-r-10" >添加前端路由</i-button>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-bg-gray-mid g-pd-20">
				<i-input
					v-model="name" 
					size="large" 
					placeholder="请输入公司名称" 
					style="width: 220px" 
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/settings/router/set', 
				{ 
					...this.$route.query, 
					keyword: this.keyword,
					name: this.name
				}
			));
			this.$vc.emit('SETTING_ROUTER_LIST_INIT');
			// this.$store.commit('SETTINGS_ROUTER_SET_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss">

</style>
