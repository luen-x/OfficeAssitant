<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		:title="title[type-1]"
		class-name="v-sale-main-achieve-target-detail"
		width="900"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-b-20">
			<i-select
				v-if="type==2"
				v-model="query.config_id"
				style="width: 220px; display: inline-block;margin-right: 7px;"
				@on-change="loadTargets()">
				<i-option v-for="(item) in cofigList" :value="item.config_id" :key="item.config_id" >
					{{ item.start_time+'~'+item.end_time }}</i-option>
			</i-select>
			<i-date-picker
				v-else
				v-model="dateValue"
				:type="dateType[query.type-1]"
				:placeholder="datePlaceholder[query.type-1]"
				transfer
				style="width: 220px;margin-right: 7px;"
				@on-change="handleChangeMonth"
			/>

			<i-cascader
				v-model="query.depart_ids"
				:data="departAll"
				style="width: 220px; display: inline-block;margin-right: 7px;"
				clearable
				transfer
				class="g-m-r-5"
				change-on-select
				trigger="click"
				placeholder="请选择组织"
				@on-change="handleSearchDepart"
			/>
			<i-input
				v-if="query.tab_type==3"
				v-model="query.search"
				placeholder="请输入员工姓名"
				style="width:220px;margin-right:5px;margin-left:2px"
				clearable
				@on-enter="loadTargets"
				@on-change="handleInputChange"
			/>
			<vc-debounce-click :tag="Button" type="primary" @click="loadTargets()">搜索</vc-debounce-click>
		</div>
		<div v-if="tabList.length==1" >
			<div class="g-flex _table-heard ">
				<div>员工姓名</div>
				<div>业绩</div>
				<div>保底目标（万）</div>
				<div>平衡目标（万）</div>
				<div>冲刺目标（万）</div>
			</div>
			<div class="_body">
				<div
					v-for="(item,i) in staffTarget || []"
					:key="i"
					class="g-flex _table-body  g-c-black1"
				>
					<div>{{ item.staff_name+'('+item.depart_name+')' }}</div>
					<div>{{ item.real_money }}</div>
					<div>{{ item.min_target }} ({{ item.min_proportion }})</div>
					<div>{{ item.target }} ({{ item.proportion }})</div>
					<div>{{ item.max_target }} ({{ item.max_proportion }})</div>
				</div>
			</div>
		</div>
		<div v-else class="g-tabs">
			<i-tab :value="tabList.includes(1)? '1':'2'" class="g-tc" @on-click="handleChangeTab">
				<i-tab-pane v-if="tabList.includes(1)" label="战区目标" name="1">
					<div class="g-flex _table-heard">
						<div>部门</div>
						<div>业绩</div>
						<div>保底目标（万）</div>
						<div>平衡目标（万）</div>
						<div>冲刺目标（万）</div>
					</div>
					<div class="_body">
						<div
							v-for="(item,i) in zoneTarget || []"
							:key="i"
							class="g-flex _table-body rink-body-table g-c-black1"
						>
							<div>{{ item.depart_name }}</div>
							<div>{{ item.real_money }}</div>
							<div>{{ item.min_target }} ({{ item.min_proportion }})</div>
							<div>{{ item.target }} ({{ item.proportion }})</div>
							<div>{{ item.max_target }} ({{ item.max_proportion }})</div>
						</div>
					</div>
				</i-tab-pane>
				<i-tab-pane v-if="tabList.includes(2)" label="部门目标" name="2">
					<div class="g-flex _table-heard">
						<div>部门</div>
						<div>业绩</div>
						<div>保底目标（万）</div>
						<div>平衡目标（万）</div>
						<div>冲刺目标（万）</div>
					</div>
					<div class="_body">
						<div
							v-for="(item,i) in departTarget || []"
							:key="i"
							class="g-flex _table-body rink-body-table g-c-black1"
						>
							<div>{{ item.depart_name }}</div>
							<div>{{ item.real_money }}</div>
							<div>{{ item.min_target }} ({{ item.min_proportion }})</div>
							<div>{{ item.target }} ({{ item.proportion }})</div>
							<div>{{ item.max_target }} ({{ item.max_proportion }})</div>
						</div>
					</div>
				</i-tab-pane>
				<i-tab-pane v-if="tabList.includes(3)" label="员工目标" name="3">
					<div class="g-flex _table-heard">
						<div>员工姓名</div>
						<div>业绩</div>
						<div>保底目标（万）</div>
						<div>平衡目标（万）</div>
						<div>冲刺目标（万）</div>
					</div>
					<div class="_body">
						<div
							v-for="(item,i) in staffTarget|| []"
							:key="i"
							class="g-flex _table-body  g-c-black1"
						>
							<div >{{ item.staff_name+'('+item.depart_name+')' }}</div>
							<div>{{ item.real_money }}</div>
							<div >{{ item.min_target }} ({{ item.min_proportion }})</div>
							<div >{{ item.target }} ({{ item.proportion }})</div>
							<div >{{ item.max_target }} ({{ item.max_proportion }})</div>
						</div>
					</div>
				</i-tab-pane>
			</i-tab>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Button, DatePicker, Tabs, TabPane, Cascader, Select, Option } from 'iview';
import moment from 'moment';
import { services } from "@stores/services/sale";
import API from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-button": Button,
		"i-date-picker": DatePicker,
		'i-tab': Tabs,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		'i-tab-pane': TabPane,
	},
	mixins: [services.departAll()],
	props: {
		data: Object,
		type: {
			type: [String, Number],
			default: 1 // 目标类型 1月度 2季度 3年度
		},
		date: {
			type: [String, Number],
			default: '' // 目标类型 1月度 2季度 3年度
		},
		config_id: {
			type: [String, Number],
			default: '' // 季度时间
		}
	},
	data() {
		return {
			dateType: ['month', '', 'year'],
			datePlaceholder: ['请选择月份', '', '请选择年份'],
			title: ['月度业绩目标', '季度业绩目标', '年度业绩目标'],
			dateValue: this.date,
			visible: false,
			open: false,
			list: '',
			tabList: [],
			cofigList: [],
			query: {
				depart_ids: [],
				config_id: this.config_id,
				depart_id: '',
				tab_type: 3,
				type: this.type,
			},
			value3: new Date(),
			departTarget: [],
			// [curDateStr]: undefined
			staffTarget: [],
			// [curDateStr]: undefined
			zoneTarget: [],
			// [curDateStr]: undefined
		};
	},
	computed: {
		level() {
			if (this.$global.staff.is_charge == 1) {
				return 3; // 超管
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 1) {
				return 1; // 经理
			} else if (this.$global.staff.depart_is_charge == 1 && this.$global.staff.depart_lowest == 0) {
				return 2; // 总监
			} else if (this.$global.staff.depart_is_charge == 0) {
				return false; // 员工
			}
		},
	},
	beforeCreate() {
		this.Button = Button;
	},
	async created() {
		const { data } = await this.loadTargetTab();
		this.tabList = [];
		data.forEach(ele => {
			this.tabList.push(ele.val);
		});
		if (this.tabList.length > 1) {
			this.query.tab_type = this.tabList.length == 2 ? '2' : '1';
		}
		await this.loadTargets();
		if (this.type == 2) this.loadTargetConfig();
	},
	mounted() {
		this.visible = true;
		this.$nextTick(() => {
			this.dateValue = this.date;
		});
	},
	methods: {
		// 日历选择
		handleInputChange(e) {
			if (!e.target.value) {
				this.loadTargets();
			}
		},
		handleChangeTab(e) {
			this.query.tab_type = e;
			this.loadTargets();
		},
		handleChangeMonth(date) {
			this.query.month = date;
			this.query.year = date;
			this.loadTargets();
		},
		handleSearchDepart(val) {
			this.query.depart_id = val[val.length - 1];
			this.loadTargets();
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
				this.query.config_id = this.config_id || (this.quarter ? this.quarter.config_id : '');
			}).catch((err) => {
				console.error(err);
			});
		},
		handleOpen() {
			this.open = !this.open;
		},
		handleChange(i) {
			this.loadTargets();
		},
		handleOpenChange(v) {
			this.open = v;
		},
		handleSave() {
			this.visible = false;
		},
		handleNull() {
			this.visible = false;
		},
		// 日历选择
		handleOpenDate() {
			this.open = !this.open;
		},
		handleCloseDate() {
			this.open = false;
		},
		handleDateOk(i) {
			// const dateStr = moment(this.date0).format('YYYY-MM');
			// if (this.staffTarget[dateStr] === undefined) {
			// }
			this.open = false;
		},
		loadTargetTab() {
		 return	this.$request({
				url: API._SALE_MAIN_DATA_TARGET_PLAN_TAB_GET,
				type: "GET",
				loading: false,
			});
		},
		loadTargets() {
			this.$request({
				url: API._SALE_MAIN_DATA_ACHIEVEMENT_ORDER_GET,
				type: "GET",
				loading: false,
				param: {
					...this.query,
					month: this.dateValue ? moment(this.dateValue).format('YYYY-MM') : '',
					year: this.dateValue ? moment(this.dateValue).format('YYYY') : '',
				}
			}).then((res) => {
				this.staffTarget = res.data || [];
				this.departTarget = res.data || [];
				this.zoneTarget = res.data || [];
			}).catch((err) => {
				console.error(err);
			});
		},
		handleOk() {
			/**
			 * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
			 */
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleDetail() {
			this.$router.push({ name: "full-casedetail" });
		}
	}
};
export const targetDetail = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-sale-main-achieve-target-detail {
		._text-center{
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
        ._table-heard {
			padding-left: 60px;
            height: 40px;
            line-height: 40px;
            background: #f0f4fc;
            & > div {
                text-align: left;
				width: 156px !important;
            }
        }
        ._table-body {
			padding-left: 60px;
            height: 38px;
            line-height: 38px;
            & > div {
                text-align: left;
				width: 156px !important;
            }
        }
		 ._table-body:nth-child(2n) {
            background: #fafafa;
        }
        ._body {
            max-height:300px;
            overflow-y: auto;
        }
        .ivu-tabs-nav-scroll {
            text-align: center !important;
        }
        .ivu-tabs-nav {
            float: none !important;
        }
        .ivu-tabs-ink-bar {
            background: none !important;
        }
        .ivu-tabs-tab-active {
            border-bottom: 3px solid #d9444f !important;
        }
    }
</style>
