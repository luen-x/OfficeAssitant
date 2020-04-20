<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="query.search"
				:maxlength="50"
				clearable
				placeholder="请输入客户公司名称" 
				style="width: 300px;height:32px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-10 g-red-btn-small"
				style="width: 60px;height:32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
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
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="query.create_staff_search"
					clearable
					placeholder="请输入补款人" 
					style="width: 220px"
					class="g-m-r-10"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-date-picker
					v-model="query.create_time"
					clearable
					transfer
					type="daterange"
					split-panels
					placeholder="请选择补款时间"
					style="width: 220px;"
					class="g-m-r-10"
					formate="yyyy-MM-dd"
					@on-change="handleSearch"
				/>

				<i-select	
					v-model="query.product_id"
					clearable
					transfer
					filterable
					style="width:220px;"
					class="g-m-r-10"
					transfer-class-name="v-sc-main-right-side-filter"
					placeholder="请选择下单产品"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in productList"
						:value="item.product_id"
						:key="item.product_id"
					>
						{{ item.product_name }}
					</i-option>
				</i-select>

				<i-select
					v-model="query.is_ignore"
					clearable
					transfer
					style="width:220px;"
					class="g-m-r-10"
					placeholder="请选择是否忽略"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in is_ignores"
						:value="item.value"
						:key="item.value"
					>
						{{ item.label }}
					</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option
	},
	props: {
		value: Object
	},
	data() {
		return {
			query: { ...this.value },
			show: false,
			is_ignores: [
				{
					value: "2",
					label: "只显示未忽略的"
				},
				{
					value: "1",
					label: "只显示已忽略的"
				},
				{
					value: "0",
					label: "显示全部的"
				}
			],
			productList: []
		};
	},
	watch: {
		value(val) {
			this.query = { ...val };
		}
	},
	beforeCreate() {
		/**
		 * 这样不会被注册监听
		 */
		this.Button = Button;
	},
	mounted() {
		this.query = { ...this.value };
		this.loadProductList();
	},
	methods: {
		handleToggle() {
			this.$refs.expand.toggle();
		},
		loadProductList() {
			this.$request({
				url: '_SC_MANAGE_INSPECTION_QUALITY_PRODUCT_GET',
				type: 'GET',
				param: {
					is_all: 0
				},
				loading: false
			}).then(res => {
				res.data.forEach(item => {
					this.productList.push({
						product_id: item.product_id + "",
						product_name: item.product_name
					});
				});
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch() {
			this.$emit('search', this.query);
		}
	}
};
</script>

<style lang="scss">
.v-sc-main-right-side-filter{
	min-width: 220px !important;
	max-width: 220px !important;
}
</style>