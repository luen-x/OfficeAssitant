
<template>
	<div style="margin-top:15px">
		<div @keyup.enter="handleSearch">
			<i-input
				v-model="keyword"
				placeholder="请输入关键字搜索"
				style="width: 220px"
			/>
			<i-select
				v-model="category_id"
				clearable
				class="g-m-l-5"
				style="width:220px"
				placeholder="请选择产品分类"
				@on-change="handleSearch({category_id: arguments[0]})"
			>
				<i-option
					v-for="(item,i) in list"
					:key="i"
					:value="item.category_id"
				> {{ item.category_name }} </i-option>
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
import { Input, Button, Select, Option, Poptip } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API from "@stores/apis/root";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			category_id: Number(query.category_id),
			show: false,
			list: ''
		};
	},
	created() {
		this.loadClass();
	},
	methods: {
		loadClass() {
			this.$request({
				url: API._CONTENT_PRODUCT_CATEGORY_GET,
				type: "GET",
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				console.error(error);
			});
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/product/list/recycle',
				{
					...this.$route.query,
					keyword: this.keyword,
					category_id: this.category_id,
					name: this.name
				}
			));
			this.$store.commit('CONTENT_PRODUCT_LIST_RECYCLE_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
