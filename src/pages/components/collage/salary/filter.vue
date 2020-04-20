<template>
	<div class="v-collage-salary-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-datepicker
					v-if="!$route.query.type || $route.query.type == '1'"
					v-model="search.month"
					:options="pickerOptionsStart"
					type="month"
					clearable
					transfer
					placeholder="请选择月份"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event)"
				/>
				<i-input
					v-if="$route.query.type == '2'"
					v-model="search.search"
					placeholder="请输入员工姓名或手机号" 
					style="width: 300px; height: 32px" 
					clearable
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleSearch"
				/>
				<i-button 
					type="primary"
					style="width: 60px;"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span 
					v-if="$route.query.type == '2'"
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
			<div class="g-flex g-fr">
				<span
					v-if="$auth[1334]"
					class="g-red-btn-line g-m-r-10"
					@click="handleExport"
				>
					导出
				</span>
				<i-dropdown>
					<div @mouseenter="flag = false" @mouseleave="flag = true">
						<i-button class="_btn">
							更多功能
							<i v-if="flag" class="iconfont icon-down g-fs-12"/>
							<i v-else class="iconfont icon-up g-fs-12"/>
						</i-button>
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item>
							<span @click="handleSelectTitle">选择表头</span>
						</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
			</div>
		</div>

		<vc-expand 
			v-if="$route.query.type == '2'"
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-datepicker
					v-if="$route.query.type == '2'"
					v-model="search.month"
					:clearable="false"
					:options="pickerOptionsStart"
					type="month"
					transfer
					placeholder="请选择月份"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event)"
				/>
				<i-cascader
					:data="departAllOfCollage"
					v-model="search.depart_ids"
					:change-on-select="true"
					transfer
					clearable
					placeholder="请选择组织"
					trigger="click"
					style="width: 220px;display: inline-block"
					class="g-m-r-5"
					@on-change="handleSearch" />
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import moment from 'moment';
import { Input, Button, DatePicker, Dropdown, DropdownMenu, 
	DropdownItem, Cascader } from 'iview';
import { Expand } from 'wya-vc';
import { services } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { TableTitle } from "../../_common/table-title/table-title";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		"i-cascader": Cascader,
		'i-datepicker': DatePicker,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
	},
	mixins: [
		services.departAll()
	],
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		return {
			flag: true,
			pickerOptionsStart: {
				disabledDate: time => {
					// 可通过箭头函数的方式访问到this
					return time.getTime() > Date.now();
				}
			},
			search: {
				search: query.search || '',
				depart_id: query.depart_id ? Number(query.depart_id) : null,
				month: query.month ? query.month : this.$route.query.type == '2' ? moment().format('YYYY-MM') : '',
				...query,
				depart_ids
			},
			show: false
		};
	},
	computed: {
		departAllOfCollage() {
			if (this.departAll == undefined || !this.departAll.length || !this.departAll[0].label) return [];
			const departTree = this.departAll.filter(v => v.label.includes('商学院'))[0].children;
			// departTree.forEach(v => {
			// 	if (!v.children) {
			// 		v.disabled = true;
			// 	}
			// });
			return departTree;
		},
	},
	watch: {
		'$route.query.type': function (newval, oldval) {
			const { query = {} } = this.$route;
			if (newval == '2') {
				this.search.month = moment().format('YYYY-MM'); 
			} else {
				this.search.month = '';
			}
		},
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		}
	},
	methods: {
	
		handleDateChange(val) {
			this.search.month = val;
			this.handleSearch();
			// this.$store.commit('COLLAGE_SALARY_LIST_INIT', this.search.month);
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/collage/salary', 
				{ 
					...this.query,
					...this.search,
					month: this.search.month ? moment(this.search.month).format('YYYY-MM') : '',
					type: this.$route.query.type,
				}
			));
			this.$store.commit('COLLAGE_SALARY_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleExport() {
			const query = {
				...this.$route.query,
				type: this.$route.query.type || "1"
			};
			const url = getHashUrl(API_ROOT["COLLAGE_SALARY_LIST_GET"], {
				...query,
				is_export: 1,
				"-token": getItem(`staff_${this.$global.version}`).token
			});

			window.open(url);
		},
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.collageSalary.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_COLLAGE_BUSINESS_TABLE_SAVE_POST",
				mutation: "COLLAGE_SALARY_TITLE_CHANGE",
				type: this.$route.query.type || '1',
				scenario: 8
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit("collage-salary-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("COLLAGE_SALARY_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(err => {
			});
		},
	}
};

</script>

<style lang="scss">
.v-collage-salary-filter {
	._btn{
		border-color: #e84854;
		color: #e84854;
		height: 32px;
		&:hover {
			background-color: #e84854!important;
			color: #fff!important;
		}
	}
}

</style>
