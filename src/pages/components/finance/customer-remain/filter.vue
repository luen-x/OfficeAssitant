<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search"
				placeholder="请输入关键字搜索"
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
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-input
					v-model="audit_staff_search"
					placeholder="请输入审核人姓名或手机号"
					style="width: 220px"
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-input
					v-model="staff_search"
					placeholder="请输入申请人姓名或手机号"
					style="width: 220px"
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-cascader
					v-model="depart_id"
					:data="departAll"
					style="width: 220px; display: inline-block"
					class="g-m-r-5"
					clearable
					transfer
					trigger="hover"
					placeholder="请选择组织"
					@on-change="handleChange"
				/>
				<i-date-picker
					v-model="month"
					style="width: 220px"
					type="daterange"
					split-panels
					class="g-m-r-5"
					transfer
					placeholder="请选择申请时间"
					@on-change="handleSearch"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Cascader, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/hr";
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';


export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-cascader': Cascader,
		'i-date-picker': DatePicker,

	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : [],
			search: String(query.search || ''),
			staff_search: String(query.staff_search || ''),
			audit_staff_search: String(query.audit_staff_search || ''),
			month: [query.create_time_start, query.create_time_end] || [],
			show: false
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/finance/customer/remain',
				{
					...this.$route.query,
					search: this.search,
					fixPosition: true,
					staff_search: this.staff_search,
					audit_staff_search: this.audit_staff_search,
					create_time_start: formatMoment(this.month[0]),
					create_time_end: formatMoment(this.month[1]),
					depart_id: this.depart_id.length ? this.depart_id : ''
				}
			));
			this.$store.commit('FINANCE_CUSTOMER_REMAIN_LIST_INIT');
		},
		handleChange(value, selectedData) {
			this.depart_id = value;
			this.handleSearch();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
