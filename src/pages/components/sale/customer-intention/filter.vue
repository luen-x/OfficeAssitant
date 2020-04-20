<template>
	<oa-sale-expand :bar="false" class="js-filter" style="margin-top:0px" expand>
		<i-input
			slot="prefix"
			v-model="query.keyword"
			:maxlength="50"
			placeholder="请输入公司名称、姓名或电话搜索 "
			style="width: 300px"
			clearable
			@on-enter="handleSearch"
			@on-change="handleClear"
		/>
		<i-button
			slot="prefix"
			type="primary"
			class="g-red-btn g-m-l-10"
			@click="handleSearch"
		>搜索</i-button>
		<span slot="toggle" class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer">更多搜索条件</span>
		<span slot="extra" class="g-fr" >
			<!-- <span class="g-fs-12 g-m-r-20 g-relative" style="top:7px">
				如何进行录入到账？
				<a class="g-c-blue-mid g-pointer" @click="handleWatchVideo">视频教程</a>
			</span> -->
			<i-button v-if="$auth[1753]" type="primary" class="g-m-r-5" @click="handleToAdd">添加资料</i-button>
			<!-- <vc-debounce-click
				v-if="$auth[374]"
				class="g-m-r-5 g-red-btn-line"
				@click="handleToAdd"
			>
				添加资料
			</vc-debounce-click> -->
			<vc-debounce-click
				v-if="$auth[1674]"
				class="g-m-r-5 g-red-btn-line"
				@click="handleToConcern"
			>
				关注资料
			</vc-debounce-click>
			<i-dropdown style="position: relative;vertical-align: bottom;" @on-click="invoke ">
				<span class="g-red-btn-line">
					更多
					<i class="iconfont icon-down g-pointer"/>
				</span>
				<i-dropdown-menu slot="list" class="g-tc">
					<i-dropdown-item v-if="$auth[374]" name="handleAddCustomer">
						添加客户
					</i-dropdown-item>
					<i-dropdown-item v-if="$auth[829]" name="handleToPrivate">
						私海
					</i-dropdown-item>
					<i-dropdown-item name="handleChangeTableTitle" >
						选择表头
					</i-dropdown-item>
				</i-dropdown-menu>
			</i-dropdown>
		</span>

		<div
			class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
			style="padding-top:3px;padding-bottom:7px;"
		>
			<i-input
				v-if="charge && level!=3"
				v-model="query.staff_string"
				placeholder="请输入负责人或手机号搜索"
				clearable
				class="g-m-r-5"
				style="width: 220px"
				@on-enter="handleSearch"
				@on-change="handleClear"
			/>
			<i-select
				v-if="charge && level==3"
				v-model="query.staff_int"
				clearable
				placeholder="请选择员工"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option 
					v-for="(staff) in departStaffList"
					:value="staff.staff_id" 
					:key="staff.staff_id"
				>
					{{ staff.staff_name }}
				</i-option>
			</i-select>
			
			<i-input-number
				v-model="query.min_turn_num"
				:min="0"
				:max="query.max_turn_num || 100"
				:precision="0" 
				placeholder="最小转手次数"
				clearable
				style="width: 100px"
				@keyup.native.enter="handleSearch"
			/>
			<span style="margin-left:3px;margin-right:3px">~</span>
			<i-input-number
				v-model="query.max_turn_num"
				:min="query.min_turn_num || 0"
				:max="100"
				:precision="0" 
				placeholder="最大转手次数"
				clearable
				style="width: 100px;margin-right:5px"
				@keyup.native.enter="handleSearch"
			/>
			<i-select
				v-model="query.create_staff_id"
				:remote-method="loadCreateStaff"
				:loading="searchLoading"
				filterable
				clearable
				placeholder="请选择创建人"
				class="g-m-r-5"
				style="width: 220px"
				remote
				label-in-value
				@on-change="handleCreateStaffChange"
			>
				<i-option 
					v-for="(staff) in createStaffList"
					:value="staff.staff_id" 
					:key="staff.staff_id"
				>
					{{ staff.staff_name }}
				</i-option>
			</i-select>
			<i-cascader
				v-model="query.create_depart_ids"
				:data="departAll"
				clearable
				change-on-select
				placeholder="请选择创建人部门"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-cascader
				v-model="query.depart_ids"
				:data="departAll"
				clearable
				change-on-select
				placeholder="请选择负责人部门"
				style="width: 220px"
				class="g-m-r-5"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.start_time"
				type="date"
				placeholder="保护时间（开始）"
				clearable
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.end_time"
				type="date"
				placeholder="保护时间（结束）"
				clearable
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.get_time_start"
				type="date"
				placeholder="领取时间（开始）"
				clearable
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.get_time_end"
				type="date"
				placeholder="领取时间（结束）"
				clearable
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-date-picker
				v-model="query.visit_time"
				type="date"
				placeholder="上次跟进时间"
				clearable
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-select
				v-model="query.intention"
				clearable
				placeholder="请选择客户意向"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option value="1">无意向</i-option>
				<i-option value="2">待联系</i-option>
				<i-option value="3">跟进中</i-option>
			</i-select>
			<i-select
				v-if="$auth[375]"
				v-model="query.is_own"
				placeholder="客户类型"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option value="1">我的客户</i-option>
				<i-option value="2">全部客户</i-option>
			</i-select>
			<i-select
				v-model="query.level"
				clearable
				placeholder="请选择客户等级"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option value="2">重要客户</i-option>
				<i-option value="1">普通客户</i-option>
				<i-option value="0">临时客户</i-option>
			</i-select>
			<i-cascader
				:data="region3"
				v-model="query.location"
				clearable
				change-on-select
				placeholder="请选择地区"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			/>
			<i-select
				v-model="query.industry_id"
				clearable
				placeholder="请选择行业"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option
					v-for="item in industryList"
					:value="item.industry_id"
					:key="item.industry_id"
				>
					{{ item.industry_name }}
				</i-option>
			</i-select>
			<i-select
				v-model="query.connect_status"
				clearable
				placeholder="请选择接通状态"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option 
					v-for="status in callStatusList" 
					:key="status.value" 
					:value="status.value"
				>
					{{ status.label }}
				</i-option>
			</i-select>
			<i-select
				v-model="query.creator_type"
				clearable
				placeholder="请选择资料创建人"
				class="g-m-r-5"
				style="width: 220px"
				@on-change="handleSearch"
			>
				<i-option value="1">自己</i-option>
				<i-option value="2">其他人</i-option>
			</i-select>
		</div>
	</oa-sale-expand>
</template>

<script>
import { Input, InputNumber, Button, Icon, DatePicker, Cascader, Dropdown, DropdownMenu, DropdownItem, Select, Option } from 'iview';
// import { Select, Option } from '@common/iview-reset/select';
import { debounce } from 'lodash';
import moment from 'moment';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { VideoModal } from '@components/_common/video-modal/video-modal';
import TreeSelect from '@common/tree-select/tree-select';
import { services } from '@stores/services/sale';
import { TableTitle } from '@components/_common/table-title/table-title';
import SaleExpand from '../_common/expand';
import { getLevel } from '../_common/util';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-input-number': InputNumber,
		'i-button': Button,
		'i-icon': Icon,
		'i-select': Select,
		'i-option': Option,
		'i-date-picker': DatePicker,
		'i-dropdown': Dropdown,
		'i-dropdown-menu': DropdownMenu,
		'i-dropdown-item': DropdownItem,
		'oa-sale-expand': SaleExpand,
		'i-cascader': Cascader,
		'oa-tree-select': TreeSelect
	},
	mixins: [services.region3(), services.industryList(), services.departAll()],
	data() {
		
		const { query = {} } = this.$route;
		const location = query.location ? query.location.split(',').map(i => +i) : [];
		const staff_int = query.staff_int ? +query.staff_int : '';
		const create_staff_id = query.create_staff_id ? +query.create_staff_id : '';
		const createStaffList = query.create_staff_id ? [{ staff_name: query.create_staff_name, staff_id: +query.create_staff_id }] : [];
		const create_depart_ids = query.create_depart_ids ? query.create_depart_ids.split(',').map(Number) : [];
		const create_depart_id = create_depart_ids[create_depart_ids.length - 1];
		const depart_ids = query.depart_ids ? query.depart_ids.split(',').map(Number) : [];
		const depart_id = depart_ids[depart_ids.length - 1];
		return {
			query: {
				level: null,
				is_own: this.$auth[375] ? '2' : '1',
				staff_string: '',
				keyword: '',
				start_time: '',
				end_time: '',
				// surplus_days: '',
				visit_time: '',
				connect_status: '',
				intention: '',
				industry_id: '',
				get_time_start: '',
				get_time_end: '',
				creator_type: '',
				create_staff_name: '',
				...query,
				location,
				staff_int,
				create_staff_id,
				create_depart_ids,
				create_depart_id,
				depart_ids,
				depart_id,
				min_turn_num: query.min_turn_num ? +query.min_turn_num : null,
				max_turn_num: query.max_turn_num ? +query.max_turn_num : null
			},
			charge: _global.staff.charge,
			level: getLevel(),
			callStatusList: [
				{ label: '已接', value: '1' },
				{ label: '未接', value: '2' },
				{ label: '拒接', value: '3' },
				{ label: '微信', value: '5' },
				{ label: '空号', value: '4' },
				{ label: '未拨', value: '0' }
			],
			createStaffList,
			searchLoading: false,
			departStaffList: []
		};
	},
	watch: {
		'query.create_depart_ids': function (val) {
			this.query.create_depart_id = val[val.length - 1];
		},
		'query.depart_ids': function (val) {
			this.query.depart_id = val[val.length - 1];
		}
	},
	mounted() {
		if (this.charge && this.level == 3) {
			this.loadDepartStaff();
		}
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.selected = [];
			const { query = {} } = this.$route;
			this.$router.replace(getHashUrl(
				'/sale/customer/intention',
				{
					...this.$route.query,
					...this.formatQuery(this.query),
					customer_ids: '', // 清除带过来的参数
					customer_id: '',
				}
			));
			this.$store.commit('SALE_CUSTOMER_INTENTION_LIST_INIT');
		}, 200),
		invoke(method) {
			this[method]();
		},
		handleAddCustomer() {
			this.$router.push('/sale/customer/intention/detail');
		},
		handleToPrivate() {
			this.$router.push({ path: '/sale/customer/intention/private', query: { reload: 1 } });
		},
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		handleWatchVideo() {
			VideoModal.popup({
				title: '录入到账',
				urlType: 'SALE_ADD_PAYMENT'
			}).then((res) => {});
		},
		handleChangeTableTitle() {
			const { title_show: dataShow, title_hide: dataHide } = this.$store.state.saleCustomerIntention.title[this.$route.query.type || '1'];
			TableTitle.popup({
				dataShow,
				dataHide,
				saveUrl: '_SALE_CUSTOMER_LIST_SORT_CONFIG_SAVE_POST',
				mutation: 'SALE_CUSTOMER_INTENTION_TITLE_CHANGE',
				type: this.$route.query.type || '1',
				params: { table_type: 1 }

			}).then(() => {
				// 由于后端是根据选了哪些字段就查哪些数据，修改表头后需要重新查一遍
				this.$store.commit("SALE_CUSTOMER_INTENTION_LIST_RESET", {
					type: this.$route.query.type || '1'
				});
			}).catch(() => {});
		},
		loadCreateStaff(query) {
			this.searchLoading = true;
			this.$request({
				url: "_SALE_PAYMENT_STAFF_LIST_GET",
				type: "GET",
				param: {
					search: query,
					is_page: 0, // 不分页
					is_charge: 1, // 包含超管
					is_leave: 1 // 包含离职

				},
				loading: false,
			}).then(res => {
				this.searchLoading = false;
				this.createStaffList = res.data.list;
			}).catch((res) => {
				this.searchLoading = false;
				this.$Message.error(res.msg);
			});

		},
		handleCreateStaffChange(staff) {
			this.query.create_staff_name = staff ? staff.label : '';
			this.handleSearch();
		},
		handleToConcern() {
			this.$router.push({
				path: '/sale/customer/intention/concern'
			});

		},
		handleToAdd() {
			this.$router.push({
				path: '/sale/customer/intention/add'
			});


		},
		loadDepartStaff() {
			this.$request({
				url: "_ADMINISTRATION_ASSIGN_STAFF_GET",
				type: "GET",
				param: {
					depart_id: this.$global.staff.depart_id
				},
				loading: false,
			}).then(res => {
				this.departStaffList = res.data.map(it => ({ staff_id: it.staff_id, staff_name: it.staff_name }));
			
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
			
		}

	}
};
</script>
