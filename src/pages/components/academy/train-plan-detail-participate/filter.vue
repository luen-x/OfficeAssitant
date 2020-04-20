<template>
	<div class="v-academy-train-pla-detail-participate-filter js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="search.staff_info"
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
				<i-dropdown v-if="$auth[1595]" @on-click="handleAdd">
					<vc-debounce-click
						class="g-red-btn-line g-m-r-10"
						@click="()=>{}"
					>
						添加
					</vc-debounce-click>
					<i-dropdown-menu slot="list">
						<i-dropdown-item name="1">按组织架构选</i-dropdown-item>
						<i-dropdown-item name="2">按条件设置</i-dropdown-item>
					</i-dropdown-menu>
				</i-dropdown>
				<i-dropdown v-if="$auth[1596]">
					<div @mouseenter="flag = false" @mouseleave="flag = true">
						<i-button class="_btn">
							更多功能
							<i v-if="flag" class="iconfont icon-down g-fs-12"/>
							<i v-else class="iconfont icon-up g-fs-12"/>
						</i-button>
					</div>
					<i-dropdown-menu slot="list">
						<i-dropdown-item>
							<div @click="handleExport">导出</div>
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
					@on-change="handleSearch"
				/>
				<i-select
					v-model="search.is_sign"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					transfer
					placeholder="是否签到"
					@on-change="handleSearch"
				><i-option :value="1">是</i-option>
					<i-option :value="0">否</i-option>
				</i-select>
				<i-select
					v-model="search.is_upload"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					transfer
					placeholder="是否上传作业"
					@on-change="handleSearch"
				><i-option :value="1">是</i-option>
					<i-option :value="0">否</i-option>
				</i-select>
				<i-select
					v-model="search.user_source"
					class="g-m-r-5"
					style="width: 220px;"
					clearable
					transfer
					placeholder="请选择来源"
					@on-change="handleSearch"
				><i-option :value="1">按组织选</i-option>
					<i-option :value="2">按条件选</i-option>
					<i-option :value="3">组织/条件</i-option>
					<i-option :value="4">线上报名</i-option>
					<i-option :value="5">手机签到</i-option>
				</i-select>

			</div>
		</vc-expand>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Input, Button, Cascader, DatePicker, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import API from "@stores/apis/root";
import { services } from "@stores/services/hr";
import { getParseUrl, getHashUrl, getItem } from '@utils/utils';
import { ChooseStaff } from '@components/hr/_common/academy-course/drawers/choose-staff'; 
import { ConditionModal } from '@components/academy/_common/course-add/condition-modal';

export default {
	name: 'v-academy-train-pla-detail-participate-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		"i-cascader": Cascader,
		"i-date-picker": DatePicker,
		'vc-expand': Expand,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'i-select': Select,
		'i-option': Option,
	},
	mixins: [services.departAll()],
	data() {
		const { query = {} } = this.$route;
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(it => +it) : [];
		return {
			show: false,
			flag: true,
			search: {
				staff_info: query.staff_info || '',
				is_sign: Number(query.is_sign) || null,
				is_upload: Number(query.is_upload) || null,
				user_source: Number(query.user_source) || null,
				depart_id: query.depart_id ? Number(query.depart_id) : null,
				...query,
				depart_ids
			}
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
				'/academy/train/plan/detail/participate', 
				{ 
					...this.$route.query,
					...this.search
				}
			));
			this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAdd(e) {
			if (e == '1') {
				ChooseStaff.popup({ members: [] }).then((res) => {
					this.handleSave(res, 1);
					this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT');
				}).catch(() => {
				});
			} else {
				ConditionModal.popup({ 
					edit: 0
				}).then((res) => {
					Array.isArray(res.staff) ? '' : this.$Message.warning('暂无符合条件的人员');
					this.handleSave(res, 2);
					this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT');
				}).catch(() => {
				
				});
			}
		},
		handleSave(val, type) {
			this.$request({
				url: '_ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_ADD_POST',
				type: "POST",
				param: {
					course_id: this.$route.query.course_id,
					staff_ids: type == 1 ? val.map(v => v.staff_id) : val.staff.map(v => v.staff_id),
					user_source: type
				},
				loading: false
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit('ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_LIST_INIT');
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		handleExport() {
			window.open(getHashUrl(API._ACADEMY_TRAIN_PLAN_DETAIL_PARTICIPATE_EXPORT_GET, {
				...this.$route.query,
				'-token': getItem(`staff_${this.$global.version}`).token
			}));
		}
	}
};

</script>

<style lang="scss">
.v-academy-train-pla-detail-participate-filter {
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
