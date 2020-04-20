<template>
	<div class="v-hr-academy-train-detail-exam-audit-filter">
		<oa-start />
		<oa-title class="g-m-b-20">
			审核列表
		</oa-title>
		<div class="g-m-l-10">
			<i-input
				v-model="search.search" 
				placeholder="请输入姓名、手机号码进行搜索" 
				style="width: 220px" 
				class="g-m-r-5"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-input
				v-model="search.witness_name" 
				placeholder="请输入证明人姓名" 
				style="width: 220px"
				class="g-m-r-5"
				clearable
				@on-enter="handleSearch" 
				@on-change="handleInputChange"
			/>
			<i-cascader
				:data="departAll"
				v-model="search.depart_ids"
				:change-on-select="true"
				placeholder="请选择部门"
				trigger="click"
				clearable
				transfer
				style="width: 220px;display:inline-block"
				class="g-m-r-5"
				@on-change="handleSearch"/>
			<i-button
				type="primary"
				@click="handleSearch"
			>
				搜索
			</i-button>
		</div>
	</div>
</template>
<script>
import lodash from 'lodash';
import { Input, Button, Switch, Radio, RadioGroup, Form, FormItem, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from "@stores/services/hr";
import Title from '@components/hr/academy-train-detail/_common/title';
import Start from './start';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'oa-title': Title,
		'i-switch': Switch,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-form': Form,
		'i-form-item': FormItem,
		'oa-start': Start,
		"i-cascader": Cascader,
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		return {
			search: {
				depart_id: query.depart_ids ? query.depart_ids.split(',').map((v) => Number(v)) : [],
				search: query.search || '',
				witness_name: query.witness_name || '',
				...query,
				depart_ids
			},
			show: false,
		};
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		},
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/academy/train/detail/paper/0/audit', 
				{ 
					...this.$route.query,
					...this.search,
					fixPosition: true,
				}
			));
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PAPER_0_AUDIT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
