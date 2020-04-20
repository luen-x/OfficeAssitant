<template>
	<div class="v-academy-main-enroll-filter js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c g-m-t-20">
			<div>
				<i-input
					v-model="search.search"
					:maxlength="50"
					placeholder="请输入姓名、手机号进行搜索" 
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
			<div class="g-flex">
				<vc-debounce-click
					v-if="$auth[1291]"
					class="g-red-btn-line g-m-r-10"
					@click="handleExport"
				>
					导出
				</vc-debounce-click>
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
				<i-input
					v-model="search.course_name" 
					placeholder="请输入课程名称" 
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
				<i-date-picker
					v-model="time"
					type="daterange"
					clearable
					transfer
					placeholder="请选择报名时间"
					style="width: 220px;"
					class="g-m-r-5" 
					@on-change="handleDateChange($event, 'time')"
				/>
			</div>
		</vc-expand>
	</div>
</template>
<script>
import { debounce } from 'lodash';
import { Input, Button, Cascader, DatePicker, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import moment from 'moment';
import API from "@stores/apis/root";
import { services } from "@stores/services/hr";
import { TableTitle } from "../../_common/table-title/table-title";

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		'vc-expand': Expand,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		return {
			flag: true,
			name: String(query.name || ''),
			show: false,
			search: {
				search: query.course_name || '',
				course_name: query.course_name || '',
				depart_id: query.depart_id ? Number(query.depart_id) : null,
				...query,
				depart_ids
			},
			time: [query.start_time, query.stop_time],
		};
	},
	watch: {
		'search.depart_ids': function (val) {
			this.search.depart_id = val[val.length - 1] || '';
		},
	},
	methods: {
		// 时间改变
		handleDateChange(val, name) {
			this.search[`start_${name}`] = val[0];
			this.search[`stop_${name}`] = val[1];
			this.handleSearch();
		},
		formatQuery() {
			const _query = {};
			Object.keys(this.search).forEach(key => {
				if (this.search[key] instanceof Date) {
					_query[key] = moment(this.search[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.search[key];
				}
			});
			return _query;
		},
		// 搜索值变化
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/academy/main/enroll', 
				{ 
					...this.$route.query,
					...this.search
				}
			));
			this.$store.commit('ACADEMY_MAIN_ENROLL_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		// 选择表头
		handleSelectTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.academyMainEnroll.title[this.$route.query.type || "1"];

			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: "_ACADEMY_COMMON_TABLE_TITLE_SAVE_POST",
				mutation: "ACADEMY_MAIN_ENROLL_TITLE_CHANGE",
				type: this.$route.query.type || "1",
				scenario: 1
			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$vc.emit("academy-main-enroll-title-change", { type: this.$route.query.type || "1" });
				this.$store.commit("ACADEMY_MAIN_ENROLL_LIST_INIT", {
					type: this.$route.query.type || "1"
				});
			}).catch(err => {
				err && console.error('error');
			});
		},
		handleExport() {
			window.open(getHashUrl(API.ACADEMY_MAIN_ENROLL_LIST_GET, {
				...this.$route.query,
				export: 1,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}
	}
};

</script>

<style lang="scss">
.v-academy-main-enroll-filter {
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
