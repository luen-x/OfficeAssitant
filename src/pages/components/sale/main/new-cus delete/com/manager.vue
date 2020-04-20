<template>
	<div class="v-main-new-cus-manager">
		<div v-if="level==1" class="_p-lr-20 g-m-t-20">
			<div
				:style="staffList.length > 5 ? 'padding-right: 20px' : ''"
				class="g-flex _table-heard"
			>
				<div class="g-col">姓名</div>
				<div class="g-col">添加客户</div>
				<div class="g-col">领取客户</div>
			</div>
			<div v-if="staffList.length>0" class="_body">
				<div
					v-for="(item,i) in staffList|| []"
					:key="i"
					class="g-flex _table-body g-c-black1"
				>
					<div class="g-col">{{ item.staff_name }}</div>
					<div class="g-col">{{ item.add_num }}</div>
					<div class="g-col">{{ item.get_num }}</div>
				</div>
			</div>
			<div
				v-else
				class="g-flex-cc g-flex-ac g-fd-c"
			>
				<img :src="OSS_SEARCH_EMPTY">
				<div class="g-tc">暂无数据，赶快添加一条吧~</div>
			</div>
		</div>
		<div v-if="level==3 || level==2" class="g-tabs">
			<i-tab v-model="type" :value="level==3? '3':'2'" class="g-tc" @on-click="handletabs">
				<i-tab-pane v-if="level ==3" label="战区" name="3" class="_p-lr-20">
					<div
						:style="zoneList.length > 5 ? 'padding-right: 20px' : ''"
						class="g-flex _table-heard"
					>
						<div class="g-col">战区</div>
						<div class="g-col">添加客户</div>
						<div class="g-col">领取客户</div>
					</div>
					<div v-if="zoneList.length>0" class="_body">
						<div
							v-for="(item,i) in zoneList || []"
							:key="i"
							class="g-flex _table-body g-c-black1"
						>
							<div class="g-col">{{ item.depart_name }}</div>
							<div class="g-col">{{ item.add_num }}</div>
							<div class="g-col">{{ item.get_num }}</div>
						</div>
					</div>
					<div
						v-else
						class="g-flex-cc g-flex-ac g-fd-c"
					>
						<img :src="OSS_SEARCH_EMPTY">
						<div class="g-tc">暂无数据，赶快添加一条吧~</div>
					</div>
				</i-tab-pane>
				<i-tab-pane v-if="level==3 || level==2" label="部门" class="_p-lr-20" name="2">
					<div
						:style="departList.length > 5 ? 'padding-right: 20px' : ''"
						class="g-flex _table-heard"
					>
						<div class="g-col">部门</div>
						<div class="g-col">添加客户</div>
						<div class="g-col">领取客户</div>
					</div>
					<div v-if="departList.length>0" class="_body">
						<div
							v-for="(item,i) in departList || []"
							:key="i"
							class="g-flex _table-body g-c-black1"
						>
							<div class="g-col">{{ item.depart_name }}</div>
							<div class="g-col">{{ item.add_num }}</div>
							<div class="g-col">{{ item.get_num }}</div>
						</div>
					</div>
					<div
						v-else
						class="g-flex-cc g-flex-ac g-fd-c"
					>
						<img :src="OSS_SEARCH_EMPTY">
						<div class="g-tc">暂无数据，赶快添加一条吧~</div>
					</div>

				</i-tab-pane>
				<i-tab-pane label="员工" name="1" class="_p-lr-20">
					<div
						:style="staffList.length > 8 ? 'padding-right: 20px' : ''"
						class="g-flex _table-heard"
					>
						<div class="g-col">姓名</div>
						<div class="g-col">添加客户</div>
						<div class="g-col">领取客户</div>
					</div>
					<div v-if="staffList.length>0" class="_body">
						<div
							v-for="(item,i) in staffList|| []"
							:key="i"
							class="g-flex _table-body g-c-black1"
						>
							<div class="g-col">{{ item.staff_name }}</div>
							<div class="g-col">{{ item.add_num }}</div>
							<div class="g-col">{{ item.get_num }}</div>
						</div>
					</div>
					<div
						v-else
						class="g-flex-cc g-flex-ac g-fd-c"
					>
						<img :src="OSS_SEARCH_EMPTY">
						<div class="g-tc">暂无数据，赶快添加一条吧~</div>
					</div>
				</i-tab-pane>
			</i-tab>
		</div>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Input, Button, DatePicker, Tabs, TabPane } from 'iview';
import moment from 'moment';
import API from '@stores/apis/root';
import { OSS_SEARCH_EMPTY } from '@constants/constants';
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
			OSS_SEARCH_EMPTY,
			visible: false,
			open: false,
			type: '',
			list: '',
			value3: new Date(),

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
	},
	mounted() {
		this.type = this.level + '';
		this.loadTargets();
		this.visible = true;
	},
	methods: {
		handletabs(v) {
			this.loadTargets(v);
		},
		handleChange(i) {
			this.loadTargets();
		},
		loadTargets(v) {
			this.$request({
				url: API._SALE_MAIN_NEW_CUSTOMER_GET,
				type: "GET",
				loading: false,
				param: {
					search_type: v || this.level,
				}
			}).then((res) => {
				if (this.type == 1) {
					this.staffList = res.data || [];
				} else if (this.type == 2) {
					this.departList = res.data || [];
				} else {
					this.zoneList = res.data || [];
				}
			}).catch((err) => {
				console.error(err);
			});
		},
		handleDetail() {
			this.$router.push({ name: "full-casedetail" });
		}
	}
};
</script>

<style  lang="scss">
    ._text-center {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .v-main-new-cus-manager {
        height: 300px;
        ._table-heard {
            padding-left: 100px;
            height: 40px;
            line-height: 40px;
            background: #f0f4fc;
            & > div {
                text-align: left;
            }
        }
        ._table-body {
            padding-left: 100px;
            height: 38px;
            line-height: 38px;
            border-bottom: 1px solid #edeef1;
            & > div {
                text-align: left;
            }
        }
        ._body {
            max-height: 195px;
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
        ._p-lr-20 {
            padding: 0 20px;
        }
    }
</style>
