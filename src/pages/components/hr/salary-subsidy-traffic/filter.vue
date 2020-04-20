<template>
	<div class="js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="obj.search"
					:maxlength="15"
					style="width: 300px;"
					clearable
					placeholder="请输入员工姓名/手机号"
					@on-enter="handleSearch"
					@on-change="handleInputChange"/>

				<i-button
					type="primary"
					class="g-m-l-10"
					@click="handleSearch">
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

			<div>
				<vc-debounce-click
					class="g-red-btn-line"
					@click="handleOutput">
					导出
				</vc-debounce-click>
				<vc-debounce-click
					v-if="$auth[250]"
					class="g-m-l-5 g-red-btn-line"
					@click="handleAdd">
					新增
				</vc-debounce-click>
			</div>

		</div>
		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">

				<i-date-picker
					v-model="obj.month"
					type="month"
					clearable
					transfer
					placeholder="请选择查询月份"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event)" />

				<i-cascader
					:data="departAll"
					v-model="obj.depart_id"
					:change-on-select="true"
					placeholder="请选择部门"
					clearable
					transfer
					trigger="click"
					style="width: 220px;display:inline-block"
					class="g-m-r-5"
					@on-change="handleChange"/>

				<i-select
					v-model="obj.position_id"
					placeholder="请选择职位"
					clearable
					transfer
					style="width: 220px;"
					@on-change="handleSearch">
					<i-option
						v-for="item in positionList"
						:key="item.position_id"
						:value="item.position_id">
						{{ item.position_name }}
					</i-option>
				</i-select>

			</div>
		</vc-expand>
	</div>
</template>

<script>
import moment from 'moment';
import lodash from 'lodash';
import { Expand } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { services, staffByMutiTerm } from '@stores/services/hr';
import { Button, Cascader, DatePicker, Input, Select, Option } from 'iview';
import { PModal } from './popup/modal.vue';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-select": Select,
		"i-option": Option,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		'vc-expand': Expand
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		return {
			obj: {
				...query,
				month: query.month ? query.month : moment().format('YYYY-MM'),
				position_id: Number(query.position_id),
				depart_id: query.depart_id ? query.depart_id.split(',').map((item) => Number(item)) : []
			},
			positionList: [],
			show: false
		};
	},
	created() {
		this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_SET_MONTH', this.obj.month);

		if (this.obj.depart_id.length) {
			this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			}).then((res) => {
				this.positionList = res.data.filter(item => item.depart_id === this.obj.depart_id[0])[0].positions;
			}).catch((error) => {});
		}
	},
	methods: {
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleDateChange(val) {
			this.obj.month = val;
			this.handleSearch();
			this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_SET_MONTH', this.obj.month);
		},
		// 选中部门发生变化时
		handleChange(value, selected) {
			this.handleSearch();

			if (value.length === 0) {
				this.obj.position_id = '';
				this.positionList = [];
			} else {
				this.$request({
					url: API_ROOT._HR_DEPART_POSITION_GET,
					type: 'GET',
					loading: false
				}).then((res) => {
					value.length
						? this.positionList = res.data.filter(item => item.depart_id === value[0])[0].positions
						: '';
				}).catch((error) => {});
			}
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/hr/salary/subsidy/traffic',
				{
					...this.obj,
					month: this.obj.month ? moment(this.obj.month).format('YYYY-MM') : '',
					depart_id: this.obj.depart_id.length ? this.obj.depart_id[this.obj.depart_id.length - 1] : '',
				}
			));
			this.$store.commit('HR_SALARY_SUBSIDY_TRAFFIC_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 导出数据
		handleOutput() {
			let { query = {} } = getParseUrl();
			const url = getHashUrl(API_ROOT['HR_SALARY_SUBSIDY_TRAFFIC_LIST_GET'], {
				...query,
				month: this.obj.month ? moment(this.obj.month).format('YYYY-MM') : '',
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		},
		// 新增员工补贴
		handleAdd() {
			PModal.popup({
				data: {
					action: 'add'
				}
			}).then(res => {
			}).catch(() => {});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
