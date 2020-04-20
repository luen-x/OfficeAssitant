<template>
	<div class="js-filter v-check-service-filter">
		<div>
			<i-input
				v-model="search.company_info"
				:maxlength="50"
				placeholder="请输入公司名称、客户姓名或手机号" 
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
			<div class="g-flex g-fr">
				<span
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
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-select
					v-if="$auth[1342]"
					v-model="search.customer_type" 
					transfer
					class="g-m-r-5"
					style="width: 220px" 
					@on-change="handleSearch"
				>
					<i-option :value="1">全部客户</i-option>
					<i-option :value="2">我的客户</i-option>
				</i-select>
				<i-input
					v-model="search.brand_name" 
					placeholder="请输入品牌名称" 
					style="width: 220px" 
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
				<i-select
					ref="staff"
					:value="search.invitor"
					:remote-method="loadStaff"
					:loading="staffLoading"
					class="g-m-r-5"
					style="width: 220px;"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择邀约人"
					@on-change="handleChange({invitor: arguments[0]})"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(item, index) in staffData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					v-model="search.product_name"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					filterable
					transfer
					placeholder="请选择历史下单产品"
					@on-change="handleSearch"
				><i-option
					v-for="(v, index) in productList"
					:key="index"
					:value="v"
				>{{ v }}</i-option>
				</i-select>
				<i-select
					v-model="search.lecture_set_name"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					filterable
					transfer
					placeholder="请选择套系名称"
					@on-change="handleSearch"
				><i-option
					v-for="(v, index) in lessonList"
					:key="index"
					:value="v"
				>{{ v }}</i-option>
				</i-select>
				<span class="g-m-r-5">
					<i-input-number
						v-model="search.max_score" 
						:max="10"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="请输入最高分" 
						style="width: 102px" 
						clearable
						@on-change="handleSearch"
					/>
					~
					<i-input-number
						v-model="search.min_score" 
						:max="10"
						:min="0"
						:precision="2"
						:active-change="false"
						placeholder="请输入最低分" 
						style="width: 102px" 
						clearable
						@on-change="handleSearch"
					/>
				</span>
				<i-select
					v-model="search.quality_type"
					style="width: 220px"
					clearable
					transfer
					placeholder="请选择质检方式"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(v, index) in methodList"
						:key="index"
						:value="v.id"
					>
						{{ v.name }}
					</i-option>
				</i-select>
				<i-datepicker
					v-model="quality"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择质检日期"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'quality')"
				/>
				<i-datepicker
					v-model="lesson_complete"
					type="daterange"
					clearable
					transfer
					split-panels
					placeholder="请选择课程结束时间"
					separator=" 至 "
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleDateChange($event, 'lesson_complete')"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Select, Option, Cascader, DatePicker, InputNumber, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { services, createSearch } from '@stores/services/hr';
import API_ROOT from '@stores/apis/root';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { ExportModal } from "./popup/export";
import { TableTitle } from "../../_common/table-title/table-title";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader,
		'i-datepicker': DatePicker,
		'i-input-number': InputNumber,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem
	},
	mixins: [
		createSearch({ key: 'staff' })
	],
	data() {
		const { query = {} } = this.$route;
		return {
			flag: true,
			search: {
				...query,
				company_info: query.company_info || '',
				customer_type: Number(query.customer_type) || 1,
				brand_name: query.brand_name || '',
				invitor: Number(query.invitor),
				staff_name: query.staff_name,
				max_score: Number(query.max_score) || null,
				min_score: Number(query.min_score) || null,
				quality_type: Number(query.quality_type) || null,
				product_name: query.product_name || '',
				lecture_set_name: query.lecture_set_name || '',
			},
			quality: [query.quality_start_time, query.quality_end_time],
			lesson_complete: [query.lesson_complete_start_time, query.lesson_complete_end_time],
			show: false,
			time: [],
			methodList: [
				{
					id: 1,
					name: '电话质检'
				}, {
					id: 2,
					name: '微信质检'
				}, {
					id: 3,
					name: 'QQ质检'
				}, {
					id: 4,
					name: '短信质检'
				}, {
					id: 99,
					name: '其他'
				}
			],
			productList: [], // 历史下单产品列表
			lessonList: [], // 历史套系列表
		};
	},
	created() {
		this.loadCourseList();
		this.loadLessonList();
	},
	methods: {
		handleExport() {
			const { query = {} } = this.$route;

			if (!query.type) {
				query.type = 1;
			} else {
				query.page = "";
				query.pageSize = "";
			}

			ExportModal.popup({
				query
			}).then(res => {
			});
		},
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.collageCheckService.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_COLLAGE_BUSINESS_TABLE_SAVE_POST",
				mutation: "COLLAGE_CHECK_SERVICE_TITLE_CHANGE",
				type: this.$route.query.type || '1',
				scenario: 6
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍

				this.$vc.emit("collage-check-service-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("COLLAGE_CHECK_SERVICE_LIST_INIT", {
					type: this.$route.query.type || '1'
				});
			}).catch(err => {
			});
		},
		// 历史下单产品列表
		async loadCourseList() {
			return this.$request({
				url: '_COLLAGE_CHECK_SERVICE_PRODUCT_LIST_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.productList = res.data;
			}).catch((error) => {
			});
		},
		// 历史下单产品列表
		async loadLessonList() {
			return this.$request({
				url: '_COLLAGE_CHECK_SERVICE_LESSON_LIST_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.lessonList = res.data;
			}).catch((error) => {
			});
		},
		handleQueryChange(query = '') {
			let targetQuery = this.search.staff_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.staff.clearSingleSelect();
			}
		},
		handleChange(obj) {
			let value = obj['invitor'];
			this.search.invitor = value ? value.value : '';
			this.search.staff_name = value ? value.label : '';
			this.handleSearch();
		},

		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		// 时间改变
		handleDateChange(val, name) {
			this.search[`${name}_start_time`] = val[0];
			this.search[`${name}_end_time`] = val[1];
			this.handleSearch();
		},
		handleSearch: lodash.debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/collage/check/service', 
				{ 
					...this.$route.query,
					...this.search,
					staff_name: this.search.staff_name ? this.search.staff_name.split('(')[0] : '',
					fixPosition: true,
				}
			));
			this.$store.commit('COLLAGE_CHECK_SERVICE_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		}
	}
};

</script>

<style lang="scss">
.v-check-service-filter {
	.ivu-input-number-handler-wrap {
        display: none !important;
	}
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
