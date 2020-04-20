<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="search"
				placeholder="请输入员工姓名或手机号"
				style="width:300px;"
				clearable
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button class="g-m-l-5" type="primary" @click="handleSearch">搜索</i-button>
			<span class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer" @click="handleToggle">
				更多搜索条件
				<i
					:class="show?'icon-triangle-up':'icon-triangle-down'"
					class="iconfont g-fs-12 g-c-black-dark"/>
			</span>
		</div>
		<vc-expand ref="expand" v-model="show">
			<div
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top:3px;padding-bottom:7px;"
			>
				<i-date-picker
					:value="month"
					:options="{disabledDate:TimeDisable}"
					style="width: 220px"
					class="g-m-r-5"
					type="month"
					format="yyyy-MM"
					transfer
					placeholder="请选择时间"
					@on-change="handleSearch({month: arguments[0]})"
				/>
				<i-cascader
					v-if="departMy.length>0 && (level==2||level==3)"
					v-model="depart_id"
					:data="departMy"
					style="width: 220px; display: inline-block"
					clearable
					transfer
					change-on-select
					trigger="click"
					placeholder="请选择组织"
					@on-change="handleSearch({position_id: arguments[0]})"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, DatePicker, Cascader, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { services } from "@stores/services/sale";
import { getParseUrl, getHashUrl } from '@utils/utils';
import moment from 'moment';
import { debounce } from 'lodash';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-cascader': Cascader,
		'i-option': Option,
		'vc-expand': Expand,
	},
	mixins: [
		services.departMy()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			search: String(query.search || ''),
			name: String(query.name || ''),
			show: false,
			month: query.month,
			depart_id: query.depart_id ? query.depart_id.split(",").map(item => Number(item)) : []
		};
	},
	computed: {
		level() {
			const { query = {} } = this.$route;
			if (this.$global.staff.is_charge == 1) {
				return 3; // 超管
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 1) {
				return 1; // 经理
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0) {
				return 2; // 总监
			} else if (this.$global.staff.depart_is_charge == 0) {
				return false; // 员工
			}
		}
	},
	created() {
		if (!this.$route.query.month) {
			this.month = moment().format('YYYY-MM');
		}
		this.handleSearch();
	},
	mounted() {
		if (this.level < 3) {
			const { query = {} } = this.$route;
			this.depart_id = this.depart_id.length ? this.depart_id : [this.$global.staff.depart_id];
		}
	},
	methods: {
		TimeDisable(date) {
			return moment(date).isAfter(moment());
		},
		handleSearch: debounce(function (value) {
			let params = {
				...this.$route.query,
				search: this.search,
				name: this.name,
				depart_id: this.depart_id,
			};
			if (value) {
				params = {
					...params,
					...value
				};
				params.depart_id = params.depart_id == '' && this.level < 3 ? [this.$global.staff.depart_id] : params.depart_id;
			}
			this.$router.replace(getHashUrl(
				'/sale/achievement',
				params
			));
			this.$store.commit('SALE_ACHIEVEMENT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		}
	},
};

</script>

<style lang="scss" scoped>
</style>
