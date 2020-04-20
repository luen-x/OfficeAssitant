<template>
	<div class="v-sale-integral-sub-filter js-filter">
		<div>
			<i-input
				v-model="keywords.search"
				clearable
				placeholder="请输入姓名/手机/工号" 
				style="width:300px;height:32px;" 
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
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-cascader
					v-if="is_admin && departMy.length > 0"
					v-model="keywords.depart_ids"
					:data="departMy"
					clearable
					change-on-select
					placeholder="请选择部门"
					class="g-m-r-5"
					style="width:220px"
					@on-change="handleSearch"
				/>
				<i-select
					v-model="keywords.position_id"
					placeholder="请选择职位"
					clearable
					transfer
					class="g-m-r-5"
					style="width: 220px"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in position_list"
						:key="item.position_id"
						:value="String(item.position_id)">
						{{ item.position_name }}
					</i-option>
				</i-select>
				<i-date-picker
					v-model="keywords.year"
					format="yyyy"
					type="year"
					clearable
					placeholder="请选择年份"
					class="g-m-r-5"
					@on-change="handleYearChange"
				/>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.usable_start"
						:min="0"
						placeholder="请填写查询起始可用晋升积分"
						style="width:220px;margin-right:5px;"
						@on-change="handleMinChange"
					/>
				</span>
				<span @keyup.enter="handleSearch">
					<i-input-number
						v-model="keywords.usable_end"
						:min="0"
						placeholder="请填写查询结束可用晋升积分"
						style="width:220px;margin-right:5px;"
						@on-change="handleMaxChange"
					/>
				</span>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker, Cascader, InputNumber } from 'iview';
import { debounce } from 'lodash';
import { Expand } from 'wya-vc';
import { services } from '@stores/services/sale';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-integral-sub-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-input-number': InputNumber,
		'i-cascader': Cascader,
		'vc-expand': Expand,
	},
	mixins: [services.departMy()],
	data() {
		const { query = {} } = this.$route;
		return {
			show: false,
			position_list: [],
			keywords: {
				search: '', // 姓名/手机/工号
				depart_id: '', // 部门
				position_id: '', // 职位
				year: '', // 年份
				...query,
				depart_ids: (query.depart_ids ? query.depart_ids.split(',').map(item => +item) : []),
				usable_start: parseInt(query.usable_start, 10) || null, // 起始合计积分
				usable_end: parseInt(query.usable_end, 10) || null // 结束合计积分
			},
		};
	},
	computed: {
		is_admin() {
			const staff_role = this.$global.staff;
			return staff_role['charge'];
		}
	},
	watch: {
		'keywords.depart_ids': function (val) {
			this.keywords.depart_id = val[val.length - 1];
		}
	},
	mounted() {
		this.handlePosition(this.$global.staff.first_depart);
	},
	methods: {
		/**
		 * 监听Input组件的change事件
		 */
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		/**
		 * 监听年份的on-change事件
		 */
		handleYearChange(val) {
			this.keywords.year = val;
			this.handleSearch();
		},
		/**
		 * 移除获取焦点事件 注册资金/转手次数最小值
		 */
		handleMinChange(val) {
			if (this.min == val) return;
			this.min = val;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		/**
		 * 移除获取焦点事件 注册资金/转手次数最大值
		 */
		handleMaxChange(val) {
			if (this.max == val) return;
			this.max = val;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		/**
		 * 搜索
		 */
		handleSearch: debounce(function () {
			this.$router.replace(getHashUrl(
				'/sale/fraction/integral/sub',
				{
					...this.keywords,
					depart_ids: this.keywords.depart_ids.length ? this.keywords.depart_ids : undefined
				}
			));
			this.$store.commit('SALE_FRACTION_INTEGRAL_SUB_LIST_INIT');
		}, 300),
		/**
		 * 获取一级部门
		 */
		handlePosition(depart_id) {
			this.$request({
				url: '_HR_EMPLOYEE_SUMMARY_DEPART_IDS_GET',
				type: 'GET',
				param: {
					depart_id
				},
				loading: false
			}).then((res) => {
				this.getPositionList(res.data[0]);
			}).catch((error) => {});
		},
		/**
		 * 获取一级部门下的职位列表
		 */
		getPositionList(depart_id) {
			this.$request({
				url: '_HR_DEPART_POSITION_GET',
				type: 'GET',
				loading: false
			}).then((res) => {
				this.position_list = res.data.filter(item => item.depart_id === depart_id)[0].positions;
			}).catch((error) => {});
		},
		/**
		 * 点击更多搜索条件
		 */
		handleToggle() {
			this.$refs.expand.toggle();
		},
	}
};

</script>

<style lang="scss">
.v-sale-integral-sub-filter {
	.ivu-input-wrapper {
		width: 220px;
	}
	.ivu-select {
		width: 220px;
	}
	.ivu-input-number-handler-wrap {
		display: none;
	}
}
</style>
