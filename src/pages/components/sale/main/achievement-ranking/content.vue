<template>
	<div class="v-sale-main-achivement-ranking">
		<oa-block :padding-left="250" title="业绩排行" style="padding-bottom: 20px;">
			<template slot="extra">
				<div style="width:250px;" class="g-operation g-tr">
					<span v-if="level == 3" class="g-m-r-10" style="font-size:14px" @click="handleSetQuarter">设置季度
						<span class="g-m-l-10">|</span>
					</span>
					<span v-if="tabType==2" class="g-col">
						<i-dropdown
							v-if="cofigList.length"
							transfer
							placement="bottom-start"
							@on-click="handleSelectQuarter">
							<a href="javascript:void(0)" class="g-m-r-20 g-fs-14">
								{{ quarter.start_time?quarter.start_time+'~'+quarter.end_time:'请选择季度' }}
								<i style="vertical-align: middle;" class="iconfont icon-down"/>
							</a>
							<i-dropdown-menu slot="list">
								<i-dropdown-item v-for="item in cofigList" :name="item.config_id" :key="item.config_id" >
									{{ item.start_time+'~'+item.end_time }}</i-dropdown-item>
							</i-dropdown-menu>
						</i-dropdown>
					</span>
					<i-date-picker
						v-else
						:open="open"
						:value="dateValue"
						:type="dateType"
						transfer
						@on-change="handleChange"
						@on-clear="handleClear"
						@on-ok="handleOk"
						@on-open-change="handleOpenChange">
						<span class="g-fs-14 g-m-r-20" @click.prevent.stop="handleOpen">
							{{ dateValue === '' ? 'Select date' : dateValue }}
						</span>
					</i-date-picker>
				</div>
			</template>
			<div class="g-tabs">
				<i-tab v-model="tabType" class="g-tc" @on-click="handleChangeTabs">
					<i-tab-pane label="月度排名" name="1" class="g-pd-lr-20">
						<oa-ranking
							v-if="level>1||level==0"
							:depart="level>1?'战区':'员工'"
							:type="level>1?'depart_name':'staff_name'"
							:table-header="level>1?zoneTableHeader:personalTableHeader"
							:list="level>1?zoneList:staffList"
							:level="level"
							@on-more="handleGetMore(level>1?3:1,level>1?zoneTableHeader:personalTableHeader)"/>
						<div v-if="level>0" class="g-flex">
							<oa-ranking
								:list="departList"
								:table-header="departTableHeader"
								depart="部门"
								class="g-col g-m-r-30"
								@on-more="handleGetMore(2,departTableHeader)"
							/>
							<oa-ranking
								:list="staffList"
								:table-header="personalTableHeader"
								type="staff_name"
								depart="员工"
								class="g-col"
								@on-more="handleGetMore(1,personalTableHeader)"
							/>
						</div>
					</i-tab-pane>
					<i-tab-pane label="季度排名" class="g-pd-lr-20" name="2">
						<template v-if="!quarter.start_time">
							<div style="height:100%;flex-direction: column;" class="g-flex-cc g-flex-ac">
								<img :src="OSS_SEARCH_EMPTY" style="max-height:100px">
								<div class="g-tc">{{ cofigList.length?'当前月份没有设置季度哦~':"超管暂时还未设置季度信息哦~" }}</div>
							</div>
						</template>
						<template v-else>
							<oa-ranking
								v-if="level>1||level==0"
								:level="level"
								:type="level>1?'depart_name':'staff_name'"
								:depart="level>1?'战区':'员工'"
								:table-header="level>1?zoneTableHeader:personalTableHeader"
								:list="level>1?zoneList:staffList"
								@on-more="handleGetMore(level>1?3:1,level>1?zoneTableHeader:personalTableHeader)"/>
							<div v-if="level>0" class="g-flex">
								<oa-ranking
									:list="departList"
									:table-header="departTableHeader"
									depart="部门"
									class="g-col g-m-r-30"
									@on-more="handleGetMore(2,departTableHeader)"
								/>
								<oa-ranking
									:list="staffList"
									:table-header="personalTableHeader"
									type="staff_name"
									depart="员工"
									class="g-col"
									@on-more="handleGetMore(1,personalTableHeader)"/>
							</div>
						</template>
					</i-tab-pane>
					<i-tab-pane label="年度排名" name="3" class="g-pd-lr-20">
						<oa-ranking
							v-if="level>1||level==0"
							:level="level"
							:type="level>1?'depart_name':'staff_name'"
							:depart="level>1?'战区':'员工'"
							:table-header="level>1?zoneTableHeader:personalTableHeader"
							:list="level>1?zoneList:staffList"
							@on-more="handleGetMore(level>1?3:1,level>1?zoneTableHeader:personalTableHeader)"/>
						<div v-if="level>0" class="g-flex">
							<oa-ranking
								:list="departList"
								:table-header="departTableHeader"
								depart="部门"
								class="g-col g-m-r-30"
								@on-more="handleGetMore(2,departTableHeader)"/>
							<oa-ranking
								:list="staffList"
								:table-header="personalTableHeader"
								type="staff_name"
								depart="员工"
								class="g-col"
								@on-more="handleGetMore(1,personalTableHeader)"/>
						</div>
					</i-tab-pane>
				</i-tab>
			</div>
			<oa-set-achieve
				:config_id="quarterConfigId"
				:year="dateValue"
				:level="level"
				:config_list="cofigList"
				:show-quarter="!!quarter.start_time"
				:month="dateValue"
				:time-type="tabType"
				class="g-m-t-30"/>
		</oa-block>

	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Button, DatePicker, Tabs, TabPane, Dropdown, DropdownMenu, DropdownItem } from 'iview';
import moment from 'moment';
import API from '@stores/apis/root';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
import { CreatePortal } from 'wya-vc';
import block from '../_common/block';
import ranking from './_common/ranking';
import setAchieve from '../achieve';
import { setQuarter } from './popup/set-quarter';
import { rankingDetail } from './popup/ranking-detail';


export default {
	name: "oa-achivement-ranking",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'oa-block': block,
		'oa-ranking': ranking,
		'oa-set-achieve': setAchieve
	},

	data() {
		return {
			OSS_SEARCH_EMPTY,
			visible: false,
			zoneTableHeader: ['排名', '战区', '业绩'],
			departTableHeader: ['排名', '部门', '业绩'],
			personalTableHeader: ['排名', '姓名', '业绩'],
			open: false,
			tabType: '1',
			dateType: 'month',
			quarterConfigId: '',
			dateValue: moment().format('YYYY-MM'),
			cofigList: [],
			month: moment().format('YYYY-MM'),
			year: moment().format('YYYY'),
			quarter: {},
			slash_level: 0, // 兼部门职位
			formData: {
				month: '',
				end_month: '',
				start_month: '',
				year: '',
				is_cut: 1, // 是否截取3条（首页时传） 0：否 1：是
				type: 2, // 类型（1员工上级部门—部门排名，2员工上上级部门—战区排名）
			},
			departList: [],
			// [curDateStr]: undefined
			staffList: [],
			// [curDateStr]: undefined
			zoneList: [],
			// [curDateStr]: undefined

		};
	},
	computed: {
		level() {
			if (this.$global.staff.is_charge == 1) {
				return 3; // 超管
			} else if (this.slash_level == 1 || (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0)) {
				return 2; // 总监
			} else if (this.slash_level == 2 || (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 1)) {
				return 1; // 经理
			} else if (this.$global.staff.depart_is_charge == 0) {
				return 0; // 员工
			}
		},
	},
	created() {
		this.loadData(this.formData.type = 2);
		this.loadData(this.formData.type = 1);
		this.loadStaffData();
		this.loadTargetConfig();
		this.loadIdentity();
	},
	mounted() {
		this.type = this.level + '';
		this.visible = true;
	},
	methods: {
		handleChangeTabs(v) {
			this.formData.year = '';
			this.formData.month = '';
			this.formData.end_month = '';
			this.formData.start_month = '';
			this.dateType = v == 3 ? 'year' : 'month';
			if (v == 1) {
				this.dateValue = this.month;
				this.formData.month = this.month;
			} else if (v == 2) {
				this.formData.end_month = this.quarter.end_time;
				this.formData.start_month = this.quarter.start_time;
			} else if (v == 3) {
				this.dateValue = this.year || moment().format('YYYY');
				this.formData.year = this.dateValue;
			}
			this.loadData(this.formData.type = 2);
			this.loadData(this.formData.type = 1);
			this.loadStaffData();
		},

		handleChange(i) {
			this.dateValue = i;
			if (this.tabType == 1) {
				 this.formData.month = i;
				  this.month = i;
			} else {
				this.formData.year = i;
				this.year = i;
			}
			this.loadData(this.formData.type = 2);
			this.loadData(this.formData.type = 1);
			this.loadStaffData();
		},
		handleOpen() {
			this.open = !this.open;
		},
		handleClear() {
			this.open = false;
		},
		handleOk() {
			this.open = false;
		},
		handleOpenChange(v) {
			this.open = v;
		},

		handleSetQuarter() {
			setQuarter.popup().then(
				() => {
					this.loadTargetConfig();
				}
			).catch();
		},
		loadData(v) {
			this.$request({
				url: '_SALE_MAIN_DEPART_PERFORMANCE_LIST_GET',
				type: "GET",
				loading: false,
				param: { ...this.formData }
			}).then((res) => {
				if (!res.data.length) {
					 v == 2 ? this.zoneList = [] : this.departList = [];
				} else {
					let [data] = res.data || {};
					v == 2 ? this.zoneList = data.data : this.departList = data.data;
				}
			}).catch((err) => {
				console.error(err);
			});
		},
		loadIdentity(v) {
			this.$request({
				url: '_SALE_MAIN_STAFF_GET_STAFF_IDENTITY_GET',
				type: "GET",
				loading: false,
			}).then((res) => {
				this.slash_level = res.data.slash != null ? res.data.slash.staff_level : 0;
			}).catch((err) => {
				console.error(err);
			});
		},
		loadStaffData() {
			this.$request({
				url: '_SALE_MAIN_STAFF_PERFORMANCE_LIST_GET',
				type: "GET",
				loading: false,
				param: { ...this.formData }
			}).then((res) => {
				this.staffList = res.data.data;
			}).catch((err) => {
				console.error(err);
			});
		},
		loadTargetConfig() {
			this.$request({
				url: '_SALE_MAIN_TARGET_CONFIG_GET',
				type: "GET",
				loading: false,
			}).then((res) => {
				this.cofigList = res.data;
				this.quarter = res.data.find(it => {
					return it.default == 1;
				}) || {};
				this.quarterConfigId = this.quarter.config_id;
			}).catch((err) => {
				console.error(err);
			});
		},
		handleSelectQuarter(v) {
			this.quarterConfigId = v;
			this.quarter = this.cofigList.find(it => {
				return it.config_id == v;
			});
			this.formData.end_month = this.quarter.end_time;
			this.formData.start_month = this.quarter.start_time;
			this.loadData(this.formData.type = 2);
			this.loadData(this.formData.type = 1);
			this.loadStaffData();
		},
		handleGetMore(v, tableHeader) {
			const title = ['员工', '部门', '战区'];
			rankingDetail.popup({
				title: title[v - 1],
				status: v,
				level: this.level,
				tabType: this.tabType,
				cofigList: this.cofigList,
				tableHeader,
				quarter: this.quarterConfigId,
				dateValue: this.dateValue,
				type: v == 1 ? 'staff_name' : 'depart_name',
				params: { ...this.formData, type: v - 1 },
				url: v > 1 ? '_SALE_MAIN_DEPART_PERFORMANCE_LIST_GET' : '_SALE_MAIN_STAFF_PERFORMANCE_LIST_GET',
			}).then().catch();
		}
	}
};
</script>

<style  lang="scss">
    .v-sale-main-achivement-ranking {
		min-height: 300px;
        .ivu-tabs-nav-scroll {
            text-align: center !important;
        }
        .ivu-tabs-nav {
            float: none !important;
        }
	    .ivu-tabs-ink-bar {
	        background: none !important;
	    }
		.ivu-tabs-bar{
			margin-bottom:10px !important;
		}
		.ivu-tabs-tab {
			padding: 10px 0;
			background: none !important;
			margin: 0 20px !important;
			min-width: auto;
		}
	    .ivu-tabs-tab-active {
			border-bottom: 3px solid #d9444f !important;
		}
    }
</style>

