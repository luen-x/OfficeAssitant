<template>
	<div>
		<div>
			<i-input
				v-model="search.keyword"
				clearable
				placeholder="产品名称搜索" 
				style="width: 300px" 
				class="g-m-r-10"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			
			<i-select
				v-model="search.category_id"
				transfer
				clearable
				style="width:300px;"
				class="g-m-r-10"
				placeholder="请选择产品类型"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in list"
					:value="String(item.category_id)"
					:key="item.category_id"
				>
					{{ item.category_name }}
				</i-option>
			</i-select>

			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query } = this.$route;
		
		return {
			search: {
				keyword: String(query.keyword || ''),
				category_id: String(query.category_id || '')
			},
			list: []
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	created() {
		this.loadClass();
	},
	methods: {
		loadClass() {
			this.$request({
				url: "_CONTENT_PRODUCT_CATEGORY_GET",
				type: "GET",
				loading: false
			}).then(res => {
				this.list = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleSearch(event) {
			this.$router.replace(
				getHashUrl('/statistic/business/sale/cost', {
					...this.$route.query,
					...this.search
				})
			);

			this.$store.commit('STATISTIC_BUSINESS_SALE_COST_LIST_INIT');
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>