<template>
	<div class="js-filter">
		<i-input
			v-model="keyword"
			placeholder="请输入产品名称"
			style="width: 220px"
			class="g-m-r-5"
			clearable
			@on-enter="handleSearch"
			@on-change="handleInputChange"
		/>
		<i-select
			v-model="category_id"
			clearable
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
			style="margin-left: 5px"
			@click="handleSearch"
		>
			搜索
		</i-button>
		<router-link
			v-if="$auth[21]"
			class="g-red-btn-line g-m-l-10 g-fr"
			to="/content/product/list/recycle"
		>
			回收站 {{ recycle_num }}
		</router-link>
		<div
			v-if="$auth[20]"
			class="g-red-btn-line g-m-l-10 g-fr"
			@click="handleClassGroup"
		>
			分类管理
		</div>
		<router-link
			v-if="$auth[21]"
			class="g-red-btn-line g-m-l-10 g-fr"
			to="/content/product/new"
		>
			新建产品
		</router-link>
	</div>
</template>

<script>
import API from "@stores/apis/root";
import { Input, Button, Select, Option, Poptip } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { debounce } from 'lodash';
import { ModalAdd } from './popup/add-class';
import { ClassGroup } from './popup/class-group';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-poptip': Poptip,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			category_id: Number(query.category_id),
			list: '',
		};
	},
	computed: {
		recycle_num() {
			return this.$store.state.contentProductList.recycle_num;
		}
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
		handleSearch: debounce(function (value) {
			let params = {
				...this.$route.query,
				...value,
				keyword: this.keyword,
				category_id: this.category_id,
			};
			this.$router.replace(getHashUrl(
				'/content/product/list',
				params
			));
			this.$store.commit('CONTENT_PRODUCT_LIST_INIT');
		}, 300),
		handleClassGroup() {
			ClassGroup.popup({
			});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
	}
};

</script>

<style lang="scss" scoped>
</style>
