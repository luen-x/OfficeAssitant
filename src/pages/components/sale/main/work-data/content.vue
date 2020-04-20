<template>
	<div class="v-sale-main-work-data-content g-pd-b-10" >
		<div
			style="padding-left:24px;height: 46px;line-height: 46px;background: #f8f8f8;"
			class="g-c-black1 g-flex-cc">
			<span class="g-tc g-col g-fs-14">工作数据</span>
			<span class="g-operation" style="padding-right: 20px; font-size:14px" @click="handleOpenDetail">更多</span>
		</div>
		<div class="g-pd-lr-20 g-pd-b-10 ">
			<oa-table-list v-if="configType==1" :height="260" class="g-m-t-30 g-fs-14">
				<template slot="header">
					<span class="g-col g-m-l-10">
						<i-dropdown v-if="configList.length>1" @on-click="handleTabChange">
							<a href="javascript:void(0)">
								{{ title }}
								<i style="vertical-align: middle;" class="iconfont icon-down"/>
							</a>
							<i-dropdown-menu slot="list">
								<i-dropdown-item v-for="(item,i) in configList" :key="i" :name="item.val">{{ item.tab }}</i-dropdown-item>
							</i-dropdown-menu>
						</i-dropdown>
						<span v-else>
							姓名
						</span>
					</span><span class="g-col">添加客户</span><span class="g-col">领取客户</span>
				</template>
				<div style="height:200px;overflow-y: auto;overflow:overlay">
					<div
						v-for="(item) in list"
						:key="item.depart_id"
						class="g-flex  g-jc-sb g-m-l-10 g-m-t-20 g-c-black2">
						<span class="g-col g-tl">{{ title=='员工'?item.staff_name:item.depart_name }}</span>
						<span class="g-col g-tl">
							{{ item.add_num }}
						</span>
						<span class="g-col g-tl">{{ item.get_num }}</span>
					</div>
					<div v-if="list.length==0" style="height:200px;margin-right:40px" class="g-flex-cc g-flex-ac">
						<img :src="OSS_SEARCH_EMPTY" style="max-height:100px">
					</div>
				</div>
			</oa-table-list>
			<oa-staff-echarts v-else/>
			<div>
				<div class="g-m-tb-10"><span class="_title-bar g-bg-red-mid g-m-r-5"/>OA通话数据</div>
				<div class="g-flex g-jc-sb" style="margin:0 -5px">
					<div
						v-for="(item,index) in callData" 
						:key="index" 
						:style="{flex:item.flex}"
						style="border:1px solid rgba(232,232,232,1);margin:0 5px"
					>
						<div class="g-pd-10 g-tc" style="background:#FDFDFD;border-bottom:1px solid rgba(232,232,232,1);">
							<i :class="'icon iconfont g-fs-14 '+ item.iconClass"/>
							<span>{{ item.label }}</span>
						</div>
						<div class="g-tc g-pd-10 g-c-black1">
							{{ item.value }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import { OSS_SEARCH_EMPTY } from "@constants/constants";
import { getLevel } from '@components/sale/_common/util';
import tableList from '../_common/table-list';
import staffECharts from './staff';

export default {
	name: 'oa-main-customer-statistic',
	components: {
		"oa-table-list": tableList,
		"i-dropdown": Dropdown,
		"i-dropdown-menu": DropdownMenu,
		"i-dropdown-item": DropdownItem,
		'oa-staff-echarts': staffECharts
	},
	data() {
		return {
			OSS_SEARCH_EMPTY,
			mark: 1,
			configList: [
				{ "val": 3, "tab": "战区" },
				{ "val": 2, "tab": "部门" },
				{ "val": 1, "tab": "员工"	}],
			search_type: '', // 1 员工 / 2 部门 / 3 战区
			configType: 1,
			title: '战区',
			type: '', // 1领取 3 新增
			list: [],
			callData: [
				{ key: 'call_num', label: '拨号数量', value: '', iconClass: 'icon-end-call g-c-red-mid', flex: 5 },
				{ key: 'connect_num', label: '接通数量', value: '', iconClass: 'icon-calling g-c-blue-mid', flex: 5 },
				{ key: 'connect_rate', label: '接通率', value: '', iconClass: 'icon-calling1 g-c-green-mid', flex: 4.2 },
				{ key: 'total_call_time', label: '总通话时长', value: '', iconClass: 'icon-calling1 g-c-green-mid', flex: 6 },
				{ key: 'avg_call_time', label: '平均通话时长', value: '', iconClass: 'icon-calling1 g-c-green-mid', flex: 6.5 }
			],
		};
	},
	computed: {
		level() {
			return getLevel();
		}
	},
	 mounted() {
		this.loadTab();
		this.loadCallData();
	},
	methods: {
		handleTabChange(v) {
			const config = this.configList.find(ele => {
				return ele.val == v;
			});
			this.title = config.tab;
			this.mark = config.val;
			this.loadData();
		},
		handleOpenDetail() {
			this.$router.push('/sale/main/work/data');
		},
		loadData() {
			this.$request({
				url: '_SALE_MAIN_STATISTICS_CUSTOMER_PAGE_GET',
				type: "GET",
				loading: false,
				param: {
					search_type: this.mark
				}
			}).then((res) => {
				this.list = res.data.length > 5 && this.mark == 1 ? res.data.splice(0, 5) : res.data;
			}).catch((err) => {
				console.error(err);
			});
		},
		loadTab() {
			this.$request({
				url: '_SALE_MAIN_STATISTICS_CUSTOMER_FIRST_TAB_GET',
				type: "GET",
				loading: false,
			}).then((res) => {
				 this.configType = res.data.type;
				 this.configList = res.data.tab_list;
				 this.title = this.configList[0].tab;
				 this.mark = this.configList[0].val;
				 this.loadData();
			}).catch((err) => {
				console.error(err);
			});
		},
		loadCallData() {
			this.$request({
				url: "_SALE_MAIN_WORK_DATA_CALL_TODY_GET",
				type: "GET",
				param: {},
				loading: false,
			}).then(({ data }) => {
				this.callData.forEach(i => {
					i.value = data[i.key];
				});
				this.$forceUpdate();
			}).catch((res) => {
				this.$Message.error(res.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.v-sale-main-work-data-content{
	background-color: rgba(0, 0, 0, 0);
	box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
	 ._title-bar {
		display: inline-block;
		width: 2px;
		height: 14px;
		position: relative;
		top: 1px;
    }
}
</style>
