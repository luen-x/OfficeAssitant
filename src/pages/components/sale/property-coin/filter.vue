<template>
	<div class="v-sale-property-coin-filter js-filter g-m-b-20">
		<div>
			<i-input
				v-model="search.search"
				:maxlength="50"
				placeholder="请输入手机号/姓名" 
				style="width: 300px" 
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
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
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-cascader
					:data="departAll"
					v-model="search.depart_ids"
					:change-on-select="true"
					placeholder="请选择部门"
					trigger="click"
					clearable
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleSearch"/>
				<i-input-number
					v-model="search.gain_total_coins_start"
					:max="9999999"
					:min="0"
					:precision="0"
					:active-change="false"
					placeholder="累计微币获取量（最小值）"
					class="g-inline-block "
					style="width: 220px;margin-right:5px"
					@on-change="handleInputNumberChange"
					@keyup.native.enter="handleSearch"
				/>
				<i-input-number
					v-model="search.gain_total_coins_end"
					:max="9999999"
					:min="0"
					:precision="0"
					:active-change="false"
					placeholder="累计微币获取量（最大值）"
					class="g-inline-block"
					style="width: 220px;margin-right:5px"
					@on-change="handleInputNumberChange"
					@keyup.native.enter="handleSearch"
				/>
				<i-input-number
					v-model="search.consumed_total_coins_start"
					:max="9999999"
					:min="0"
					:precision="0"
					:active-change="false"
					placeholder="累计微币消费量（最小值）"
					class="g-inline-block"
					style="width: 220px;margin-right:5px"
					@on-change="handleInputNumberChange"
					@keyup.native.enter="handleSearch"
				/>
				<i-input-number
					v-model="search.consumed_total_coins_end"
					:max="9999999"
					:min="0"
					:precision="0"
					:active-change="false"
					placeholder="累计微币消费量（最大值）"
					class="g-inline-block"
					style="width: 220px;margin-right:5px"
					@on-change="handleInputNumberChange"
					@keyup.native.enter="handleSearch"
				/>
				<i-input-number
					v-model="search.deduct_total_coins_start"
					:max="9999999"
					:min="0"
					:precision="0"
					:active-change="false"
					placeholder="累计微币惩罚量（最小值）"
					class="g-inline-block"
					style="width: 220px;margin-right:5px"
					@on-change="handleInputNumberChange"
					@keyup.native.enter="handleSearch"
				/>
				<i-input-number
					v-model="search.deduct_total_coins_end"
					:max="9999999"
					:min="0"
					:precision="0"
					:active-change="false"
					placeholder="累计微币惩罚量（最大值）"
					class="g-inline-block"
					style="width: 220px;margin-right:5px"
					@on-change="handleInputNumberChange"
					@keyup.native.enter="handleSearch"
				/>
			</div>
		</vc-expand>
		<div class="_button">
			<div
				class="g-red-btn-line"
				@click="handleDetail"
			>
				微币奖惩政策
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Tabs, TabPane, Input, Button, Select, Option, Cascader, DatePicker, InputNumber } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from "@stores/services/hr";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-datepicker': DatePicker,
		'i-cascader': Cascader,
		'i-input-number': InputNumber
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		return {
			show: false,
			search: {
				sort_field: undefined,
				sort_type: undefined,
				search: query.search || '',
				depart_id: query.depart_id ? Number(query.depart_id) : null,
				gain_total_coins_start: Number(query.gain_total_coins_start) || null,
				gain_total_coins_end: Number(query.gain_total_coins_end) || null,
				consumed_total_coins_start: Number(query.consumed_total_coins_start) || null,
				consumed_total_coins_end: Number(query.consumed_total_coins_end) || null,
				deduct_total_coins_start: Number(query.deduct_total_coins_start) || null,
				deduct_total_coins_end: Number(query.deduct_total_coins_end) || null,
				...query,
				depart_ids
			},
			propertyList: []
		};
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		},
	},
	mounted() {
		this.$vc.on('SALE_PROPERTY_COIN_SORT_CHANGE', this.handleSort);

	},
	beforeDestroy() {
		this.$vc.off('SALE_PROPERTY_COIN_SORT_CHANGE');
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleInputNumberChange(e) {
			if (!e) {
				this.handleSearch();
			}
		},
		handleSort(sort) {
			this.search.sort_field = sort.sort_field;
			this.search.sort_type = sort.sort_type;
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/sale/property/coin', 
				{ 
					...this.$route.query,
					...this.search
				}
			));
			this.$store.commit('SALE_PROPERTY_COIN_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleDetail() {
			this.$router.push({
				path: `/sale/property/coin/policy`,
			});
		}
	}
};

</script>

<style lang="scss">
.v-sale-property-coin-filter {
	position: relative;
	._button {
		position: absolute;
		top: 0;
		right: 0;
	}
}
</style>
