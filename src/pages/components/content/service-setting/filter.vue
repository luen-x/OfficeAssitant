<template>
	<div class="g-flex g-fd-r g-jc-sb g-ai-c">
		<div>
			<i-input
				v-model="service_name"
				clearable
				placeholder="请输入服务项名称"
				style="width: 220px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-select
				v-model="product_id"
				clearable
				transfer
				filterable
				style="width:220px;"
				placeholder="请选择关联产品"
				transfer-class-name="v-content-service-setting"
				class="g-m-l-10"
				@on-change="handleSearch"
			>
				<!--防止空格产生BUG-->
				<i-option
					v-for="(item, index) in productList"
					:value="item.product_id"
					:key="index"
				>{{ item.product_name }}</i-option>
			</i-select>
			<i-select
				v-model="service_type"
				clearable
				transfer
				style="width:220px;"
				placeholder="服务项类型"
				class="g-m-l-10"
				@on-change="handleSearch"
			>
				<i-option
					v-for="(item, index) in service_types"
					:value="item.value"
					:key="index"
				>
					{{ item.label }}
				</i-option>
			</i-select>
			<i-button
				type="primary"
				class="g-m-l-5"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>

		<div v-if="$auth['732']">
			<vc-debounce-click
				class="g-red-btn-line"
				@click="handleAddService"
			>
				添加服务项
			</vc-debounce-click>
		</div>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { AddServiceModal } from './modal/add-service';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		'vc-expand': Expand
	},
	data() {
		const { query = {} } = this.$route;
		return {
			service_name: String(query.keyword || ""),
			product_id: String(query.product_id || ""),
			service_type: String(query.service_type || ""),
			show: false,
			service_types: [
				{
					value: "1",
					label: "基础服务"
				},
				{
					value: "2",
					label: "咨询服务"
				}
			],
			productList: []
		};
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.loadProductList();
	},
	methods: {
		loadProductList() {
			this.$request({
				url: '_SC_MANAGE_INSPECTION_QUALITY_PRODUCT_GET',
				type: "GET",
				param: {
					is_all: 0
				}
			}).then((res) => {
				this.productList = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},

		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/service/setting',
				{
					...this.$route.query,
					service_name: this.service_name,
					product_id: this.product_id,
					service_type: this.service_type
				}
			));
			this.$store.commit('CONTENT_SERVICE_SETTING_LIST_INIT');
		},

		handleToggle() {
			this.$refs.expand.toggle();
		},

		handleAddService() {
			AddServiceModal.popup().then(res => {
				res && this.$store.commit('CONTENT_SERVICE_SETTING_LIST_RESET', { type: "" });
			});
		},

		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	}
};
</script>

<style lang="scss">
.v-content-service-setting{
	max-width: 220px !important;
}
</style>