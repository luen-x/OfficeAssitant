<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		class-name="v-sale-main-rankings-zone-target"
		width="900"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-flex g-jc-sb">
			<div class="g-fl">
				<span class="g-c-blue-light">当前月份:</span>
				<span class="g-c-blue-light">
					<i-date-picker
						:open="open"
						v-model="value3"
						type="month"
						transfer
						@on-change="handleChange"
						@on-open-change="handleOpenChange"
						@on-clear="handleCloseDate"
						@on-ok="handleDateOk"
					>
						<span class="g-operation" @click="handleOpen">
							{{ dateName }}
						</span>
					</i-date-picker>
				</span>
			</div>
			<div v-if="level==1" class="g-tc _text-center">我的下级员工目标完成情况</div>
			<div v-if="level==2" class="g-tc _text-center">我的下级部门和员工目标完成情况</div>
			<div v-if="level==3" class="g-tc _text-center">所有部门和员工目标完成情况</div>
			<div style="visibility: hidden;">
				<span>当前月份:</span>
				<span>2018-10</span>
				<span class="g-c-blue-light">重新选择</span>
			</div>
		</div>
		<div v-if="level ===1" >
			<div :style="staffTarget.length > 8 ? 'padding-right: 20px' : ''" class="g-flex _table-heard ">
				<div class="g-col">员工姓名</div>
				<div class="g-col">部门</div>
				<div class="g-col">业绩</div>
				<div class="g-col">保底目标</div>
				<div class="g-col">平衡目标</div>
				<div class="g-col">冲刺目标</div>
			</div>
			<div class="_body">
				<div
					v-for="(item,i) in staffTarget || []"
					:key="i"
					class="g-flex _table-body  g-c-black1"
				>
					<div class="g-col">{{ item.staff_name }}</div>
					<div class="g-col">{{ item.depart_name }}</div>
					<div class="g-col">{{ item.current_money }}</div>
					<div class="g-col">{{ item.min_target }}({{ item.min_target_performance }})</div>
					<div class="g-col">{{ item.target }}({{ item.target_performance }})</div>
					<div class="g-col">{{ item.max_target }}({{ item.max_target_performance }})</div>
				</div>
			</div>
		</div>
		<div v-else class="g-tabs">
			<i-tab :value="level==3? 'zone':'depart'" class="g-tc">
				<i-tab-pane v-if="level ==3" label="战区目标" name="zone">
					<div :style="zoneTarget.length > 8 ? 'padding-right: 20px' : ''" class="g-flex _table-heard">
						<div class="g-col">部门</div>
						<div class="g-col">业绩</div>
						<div class="g-col">保底目标</div>
						<div class="g-col">平衡目标</div>
						<div class="g-col">冲刺目标</div>
					</div>
					<div class="_body">
						<div
							v-for="(item,i) in zoneTarget || []"
							:key="i"
							class="g-flex _table-body rink-body-table g-c-black1"
						>
							<div class="g-col">{{ item.depart_name }}</div>
							<div class="g-col">{{ item.current_money }}</div>
							<div
								class="g-col"
							>{{ item.min_target }}({{ item.min_target_performance }})</div>
							<div class="g-col">{{ item.target }}({{ item.target_performance }})</div>
							<div
								class="g-col"
							>{{ item.max_target }}({{ item.max_target_performance }})</div>
						</div>
					</div>
				</i-tab-pane>
				<i-tab-pane v-if="level==3 || level==2" label="部门目标" name="depart">
					<div :style="departTarget.length > 8 ? 'padding-right: 20px' : ''" class="g-flex _table-heard">
						<div class="g-col">部门</div>
						<div class="g-col">业绩</div>
						<div class="g-col">保底目标</div>
						<div class="g-col">平衡目标</div>
						<div class="g-col">冲刺目标</div>
					</div>
					<div class="_body">
						<div
							v-for="(item,i) in departTarget || []"
							:key="i"
							class="g-flex _table-body rink-body-table g-c-black1"
						>
							<div class="g-col">{{ item.depart_name }}</div>
							<div class="g-col">{{ item.current_money }}</div>
							<div
								class="g-col"
							>{{ item.min_target }}({{ item.min_target_performance }})</div>
							<div class="g-col">{{ item.target }}({{ item.target_performance }})</div>
							<div
								class="g-col"
							>{{ item.max_target }}({{ item.max_target_performance }})</div>
						</div>
					</div>
				</i-tab-pane>
				<i-tab-pane label="员工目标" name="2">
					<div :style="staffTarget.length > 8 ? 'padding-right: 20px' : ''" class="g-flex _table-heard">
						<div class="g-col">员工姓名</div>
						<div class="g-col">部门</div>
						<div class="g-col">业绩</div>
						<div class="g-col">保底目标</div>
						<div class="g-col">平衡目标</div>
						<div class="g-col">冲刺目标</div>
					</div>
					<div class="_body">
						<div
							v-for="(item,i) in staffTarget|| []"
							:key="i"
							class="g-flex _table-body  g-c-black1"
						>
							<div class="g-col">{{ item.staff_name }}</div>
							<div class="g-col">{{ item.depart_name }}</div>
							<div class="g-col">{{ item.current_money }}</div>
							<div
								class="g-col"
							>{{ item.min_target }}({{ item.min_target_performance }})</div>
							<div class="g-col">{{ item.target }}({{ item.target_performance }})</div>
							<div
								class="g-col"
							>{{ item.max_target }}({{ item.max_target_performance }})</div>
						</div>
					</div>
				</i-tab-pane>
			</i-tab>
		</div>
		<div slot="footer"/>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem, Input, Button, DatePicker, Tabs, TabPane } from 'iview';
import moment from 'moment';
import API from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';

export default {
	name: "ed-target",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-date-picker": DatePicker,
		'i-tab': Tabs,
		'i-tab-pane': TabPane,
	},
	data() {
		return {
			visible: false,
			open: false,
			list: '',
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
		dateName() {
			return moment(this.value3).format('YYYY-MM');
		}
	},
	created() {
		this.loadTargets();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		// 日历选择
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
		loadTargets() {
			this.$request({
				url: API._SALE_MAIN_DATA_ACHIEVEMENT_ORDER_GET,
				type: "GET",
				loading: false,
				param: {
					month: this.dateName
				}
			}).then((res) => {
				this.staffTarget = res.data.staff_proportion_order || [];
				this.departTarget = res.data.depart_proportion_order || [];
				this.zoneTarget = res.data.zone_proportion_order || [];
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
export const ZoneTarget = CreatePortal({}, module.exports.default);
</script>

<style  lang="scss">
    .v-sale-main-rankings-zone-target {
		._text-center{
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
        ._table-heard {
			padding-left: 20px;
            height: 40px;
            line-height: 40px;
            background: #f0f4fc;
            & > div {
                text-align: left;
            }
        }
        ._table-body {
			padding-left: 20px;
            height: 38px;
            line-height: 38px;
            & > div {
                text-align: left;
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
