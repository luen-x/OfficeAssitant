<template>
	<div>
		<div>
			<i-input
				v-model="keyword" 
				size="large" 
				placeholder="请输入关键字搜索" 
				style="width: 320px" 
			/>
			<i-button 
				type="primary"
				class="g-m-l-5"
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
			<div class="g-m-t-10 g-bg-gray-mid g-pd-20">
				<i-input
					v-model="name"
					:maxlength="50"
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
				'/sc/customer/cooperate/exporttask', 
				{ 
					...this.$route.query, 
					keyword: this.keyword,
					name: this.name
				}
			));
			this.$store.commit('SC_CUSTOMER_COOPERATE_EXPORTTASK_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};
</script>

<style lang="scss" scoped>
</style>