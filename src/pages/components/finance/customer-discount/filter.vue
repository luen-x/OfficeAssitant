<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="formdata.search"
				:maxlength="50"
				placeholder="请输入公司名称、客户姓名或手机号" 
				clearable
				style="width: 300px" 
				@on-change="handleSearch" 
				@on-enter="handleSearch"
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
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px">
				<i-input
					v-model="formdata.staff_search" 
					placeholder="请输入邀约人姓名或手机号" 
					class="g-m-r-5" 
					clearable
					style="width: 220px" 
					@on-change="handleSearch" 
					@on-enter="handleSearch"
				/>
				<i-input
					v-model="formdata.contract_num" 
					placeholder="请输入合同编号" 
					class="g-m-r-5" 
					clearable
					style="width: 220px" 
					@on-change="handleSearch" 
					@on-enter="handleSearch"
				/>
				<i-cascader
					v-model="formdata.depart_id"
					:data="departArr" 
					placeholder="请选择部门"
					change-on-select
					transfer
					clearable
					style="width: 220px"
					class="g-m-r-5"  
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/finance';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-cascader': Cascader
	},
	mixins: [services.departArr()],
	data() {
		const { query = {} } = this.$route;
		return {
			formdata: {
				...query,
				depart_id: query.depart_id && query.depart_id.split(',').map(item => Number(item))
			},
			show: false
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/finance/customer/discount', 
				{ 
					...this.formdata,
					fixPosition: true,
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_DISCOUNT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
