<template>
	<div :class="tabs.length ? '' : 'g-flex g-jc-c'">
		<div v-if="tabs.length" class="js-filter g-m-t-20">
			<div class="g-flex g-jc-fe">
				<vc-debounce-click
					v-if="$auth[1108]"
					class="g-red-btn-line g-m-r-10"
					@click="handleAdd">
					添加
				</vc-debounce-click>
				<vc-debounce-click
					v-if="$auth[1106]"
					class="g-red-btn-line"
					@click="handleOutput">
					导出
				</vc-debounce-click>
			</div>
		</div>
		<i-tabs
			v-if="tabs.length"
			:value="type"
			:animated="false"
			type="card"
			class="g-tabs-card"
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.value"
				:label="item.label"
				:name="item.value"
			>
				<vc-paging
					:columns="prevType === '1' ? columns1 : columns2[type]"
					:show="item.value == type"
					:type="item.value"
					:data-source="listInfo[item.value].data"
					:total="listInfo[item.value].total"
					:reset="listInfo[item.value].reset"
					:current.sync="current[item.value]"
					:history="true"
					:load-data="loadData"
					:table-opts="{height: tableHeight}"
					class="v-hr-archives-employee-business-watch-list"
					mode="table"
					@row-click="handleShowDetail"
					@page-size-change="handleChangePageSize"
				/>
			</i-tab-pane>
		</i-tabs>
		<div v-if="!tabs.length" class="g-flex-ac g-fd-c" style="marginTop: 200px">
			<img :src="nodataUrl" class="g-m-b-20">
			<div>暂无数据</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Button, Tabs, TabPane } from 'iview';
import { Paging } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { tableHeight } from '@extends/mixins/table';
import { getParseUrl, getHashUrl, formatMoment, getItem } from '@utils/utils';
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import { meetPModal } from './popup/meet';
import { managerPModal } from './popup/manager';
import { employeePModal } from './popup/employee';
// item
import item from './item';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		"i-button": Button,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
	},
	mixins: [
		item,
		tableHeight({
			tabs: true,
			footer: true,
			extraHeight: 70
		})
	],
	data() {
		const { query } = this.$route;

		return {
			type: '', // 同tabs下的value
			current: {},
			tabs: [],
			prevType: query.prevType,
			nodataUrl: OSS_INVOICE_EMPTY,
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrArchivesEmployeeBusinessWatch.listInfo;
		}
	},
	created() {
		let tabs = this.prevType === '1' ? [
			{ label: '过客户数', value: '6' },
			{ label: '过出来客户数', value: '7' },
			{ label: '谈判客户', value: '8' },
			{ label: '跟进客户', value: '9' }
		] : [
			{ label: '加微信客户', value: '1' },
			{ label: '维护客户', value: '2' },
			{ label: '维护出来客户', value: '3' },
			{ label: '约见客户', value: '4' },
			{ label: '绕前台', value: '5' }
		];

		this.$request({
			url: 'HR_ARCHIVES_EMPLOYEE_CONFIG_GET',
			type: 'GET',
			param: {
				staff_id: this.$route.query.staff_id
			},
		}).then((res) => {
			if (res.data.length) {
				res.data.forEach((it, index) => {
					if (this.prevType === '1') {
						this.tabs.push(tabs.filter(tab => +tab.value === it.key)[0]);
					} else {
						this.tabs.push(tabs.filter(tab => +tab.value === it.key)[0]);
					}
					this.type = this.$route.query.type || this.tabs[0].value;
				});
			}
		}).catch((error) => {
			this.$Message.error(error.msg);
		});
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
			}).then((res) => {
				if (!res.data.can_edit) {
					this.columns.pop();
				}
			}).catch((error) => {
			});
		},
		handleChange(type) {
			this.type = type;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: this.current[type]
			};
			this.$router.replace(getHashUrl('/hr/archives/employee/business/watch', { ...query }));
		},
		handleChangePageSize() {
			this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
		},
		handleAdd() {
			const { query = {} } = this.$route;
			if (query.prevType === '2') {
				if (this.type === '4') {
					meetPModal.popup({
						type: 'add',
						staff_id: this.$route.query.staff_id,
						choose_day: this.$route.query.choose_day,
					}).then(res => {
						this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
					}).catch(err => {});
				} else {
					employeePModal.popup({
						type: this.type,
						action: 'add',
						staff_id: this.$route.query.staff_id,
						choose_day: this.$route.query.choose_day,
					}).then(res => {
						this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
					}).catch(err => {});
				}
			} else if (query.prevType === '1') {
				managerPModal.popup({
					type: this.type,
					action: 'add',
					staff_id: this.$route.query.staff_id,
					choose_day: this.$route.query.choose_day,
				}).then(res => {
					this.$store.commit('HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_INIT');
				}).catch(err => {});
			}
		},
		// 导出当前状态下的所有员工
		handleOutput() {
			const { query = {} } = this.$route;
			const url = getHashUrl(API_ROOT['HR_ARCHIVES_EMPLOYEE_BUSINESS_WATCH_LIST_GET'], {
				...query,
				export: 1,
				type: this.type,
				'-token': getItem(`staff_${this.$global.version}`).token
			});
			window.open(url);
		}
	}
};

</script>

<style lang="scss">

</style>
