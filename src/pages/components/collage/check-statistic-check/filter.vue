<template>
	<div>
		<div>
			<i-input
				v-model="search.staff_name" 
				clearable 
				placeholder="请输入讲师姓名" 
				style="width: 300px"
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
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="search.company_name"
					:maxlength="50"
					clearable
					placeholder="请输入公司名称" 
					style="width: 220px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>

				<i-cascader
					v-model="depart_id"
					:data="date"
					:change-on-select="true"
					trigger="click"
					clearable
					transfer
					placeholder="请选择组织"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDepartChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/sc';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-cascader': Cascader,
		'vc-expand': Expand
	},
	mixins: [services.departAll({ autoLoad: false })],
	data() {
		const { query = {} } = this.$route;
		return {
			search: {
				staff_name: String(query.staff_name || ""),
				company_name: String(query.company_name || "")
			},
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [], // 部门
			show: false
		};
	},
	computed: {
		date() {
			if (this.departAll == undefined) {
				return [];
			}

			return [...this.departAll];
		}
	},
	mounted() {
		this.loadDepartAll();
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/collage/check/statistic/check', 
				{ 
					...this.$route.query, 
					...this.search,
					fixPosition: true,
					depart_id: this.depart_id.length ? this.depart_id : null
				}
			));
			this.$store.commit('COLLAGE_CHECK_STATISTIC_CHECK_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDepartChange(selection) {
			this.depart_id = selection;

			this.handleSearch();
		}
	}
};
</script>

<style lang="scss" scoped>
</style>