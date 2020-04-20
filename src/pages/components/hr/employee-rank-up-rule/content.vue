<template>
	<div class="v-hr-employee-rank-up-rule g-pd-20">
		<div>
			<div class="g-flex g-jc-sb g-ai-c">
				<div>
					<i-select
						v-model="cycle_year"
						placeholder="请选择查询年份"
						style="width: 220px;"
						class="g-m-r-5"
						clearable
						transfer
						@on-change="handleYearChange">
						<i-option
							v-for="item in yearList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>
					<i-select
						v-model="cycle_id"
						placeholder="请选择周期"
						style="width: 220px;"
						clearable
						transfer
						@on-change="handleSearch">
						<i-option
							v-for="item in cycleList"
							:key="item.value"
							:value="item.value">
							{{ item.label }}
						</i-option>
					</i-select>

					<i-button
						type="primary"
						class="g-m-l-10"
						@click="handleSearch">
						搜索
					</i-button>
				</div>
				<div
					v-if="$auth[846]"
					class="g-m-l-10 g-red-btn-line"
					@click="handleToStore">
					规则库
				</div>
			</div>

			<i-tabs
				ref="tab"
				:value="system_id"
				:animated="false"
				type="card"
				style="margin-top: 20px"
				class="g-tabs-card _tabs"
				@on-click="handleChange">
				<i-tab-pane
					v-for="(item) in tabs"
					:key="item.system_id"
					:label="(e) => label(e, item)"
					:name="item.system_id + ''"
				>

					<div v-if="system_id == item.system_id">
						<div v-if="!isHistory && !isOpened" class="_norank g-flex g-fd-c g-jc-c g-ai-c">
							<img :src="norankUrl">
							<span>该晋升暂未开启，请先前往开启。</span>
						</div>
						<div v-else>
							<div class="_title g-flex g-ai-c g-m-b-20">
								<div class="_left"/>
								<div class="_right">晋升规则</div>
							</div>
							<div class="_content">
								<i-row class="_header">
									<i-col span="4">原职位</i-col>
									<i-col span="16">晋升条件</i-col>
									<i-col span="4">新增规则</i-col>
								</i-row>
								<i-row class="_tbody">
									<i-col span="4" class="g-pd-t-20">
										<div>
											<span v-for="(item, index) in info.before_position_name" :key="index">{{ item }} <br ></span>
										</div>
									</i-col>
									<i-col span="16" class="g-pd-t-15">
										<oa-condition
											v-if="info.rule_detail_info"
											ref="condition"
											:list="info.rule_detail_info"
											:is-show="!isHistory"
											@delete="handleDeleteRule" />
									</i-col>
									<i-col span="4" class="g-pd-t-20">
										<div
											v-if="!isHistory && Object.keys(info).length"
											class="g-red-btn-line"
											@click="handleAdd">
											新增规则
										</div>
									</i-col>
								</i-row>
							</div>

							<div class="_title g-flex g-ai-c g-m-tb-20">
								<div class="_left"/>
								<div class="_right">
									上传附件
								</div>
							</div>
							<oa-upload
								v-if="!isHistory && Object.keys(info).length"
								v-model="file"
								:max="5"
								:upload="{accept: '.doc, .docx, .xls, .xlsx, .txt'}"
							/>
							<oa-upload
								v-else
								v-model="file"
								disabled
							/>
						</div>
					</div>
				</i-tab-pane>
			</i-tabs>
			<div v-if="Object.keys(info).length && isOpened" class="_footer g-flex g-jc-c g-ai-c">
				<i-button v-if="!isHistory" type="primary" @click="handleSave">保存</i-button>
				<div v-else class="g-gray-btn-line _disabled">保存</div>
			</div>
		</div>
	</div>
</template>

<script>
import lodash from 'lodash';
import Upload from '@components/_common/upload/upload';
import { Button, Select, Option, DatePicker, Tabs, TabPane, Table,
		 Row, Col, Tooltip } from "iview";
import { getParseUrl, getHashUrl } from '@utils/utils';
import { OSS_INVOICE_EMPTY } from '@constants/constants';
import Condition from './condition';
import { PModal } from './popup/modal';
import { DelTipModal } from '../_common/delete-tip';

export default {
	name: 'oa-content',
	components: {
		"i-button": Button,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-tabs": Tabs,
		"i-tab-pane": TabPane,
		"i-table": Table,
		"i-row": Row,
		"i-col": Col,
		"oa-upload": Upload,
		"oa-condition": Condition
	},
	data() {
		return {
			system_id: '1',
			info: {},
			cycle_year: '',
			cycle_id: '',
			yearList: [],
			cycleList: [],
			file: [],
			tabs: [],
			isOpened: false,
			isHistory: false,
			oldData: {},
			oldRuleList: [],
			norankUrl: OSS_INVOICE_EMPTY,
			label: (h, info) => {
				return (
					<div>
						{ (info.abbreviation || info.full_name) ? <Tooltip transfer maxWidth="200">
							<span>{`${info.abbreviation}`}</span>
							<div slot="content">{info.full_name ? info.full_name : info.abbreviation}</div>
						</Tooltip> : '' }
					</div>
				);
			}
		};
	},
	async created() {
		const { query } = this.$route;
		// 加载tab
		await this.loadPromoSys(query.depart_id).then(res => {
			this.tabs = res.data;
			this.system_id = query.system_id ? query.system_id : this.tabs[0].system_id + '';
		}).catch(() => {});

		// 查询年份下拉框
		this.loadUpYear();
		// 周期下拉数据
		this.loadUpCycle();

		// 判断周期是否开启
		this.loadCycleStatus().then(res => {
			this.isOpened = res.data.is_start === 1;
			// 加载当前周期id
			this.loadNowCycle().then(cycle => {
				this.cycle_id = cycle.data.cycle_id ? cycle.data.cycle_id : '';
				if (cycle.data.cycle_id) {
					this.cycle_year = +this.cycleList.filter(it => it.value === cycle.data.cycle_id)[0].label.split('.')[0];
				}
				// 加载详细规则信息
				this.loadData();
			}).catch(err => {
				this.cycle_year = '';
				this.cycle_id = '';
				this.$Message.warning(err.msg);
			});
		}).catch(() => {});
	},
	methods: {
		// 获取tab
		loadPromoSys(depart_id) {
			const { query } = this.$route;
			return this.$request({
				url: 'HR_UP_RELATION_GET',
				type: 'GET',
				param: {
					first_depart_id: depart_id
				},
				loading: false
			});
		},
		// 判断当前体系关系的周期是否开启
		loadCycleStatus() {
			return this.$request({
				url: '_HR_EMPLOYEE_UP_CYCLE_STATUS_GET',
				type: 'GET',
				param: {
					system_id: this.system_id
				},
				loading: false
			});
		},
		// 加载周期年份下拉数据
		loadUpYear() {
			this.$request({
				url: '_HR_EMPLOYEE_UP_YEAR_GET',
				type: "GET",
				param: {
					system_id: this.system_id,
				},
				loading: false
			}).then(res => {
				this.yearList = res.data;
			}).catch(error => {});
		},
		// 加载周期下拉数据
		loadUpCycle() {
			this.$request({
				url: '_HR_EMPLOYEE_UP_CYCLE_GET',
				type: "GET",
				param: {
					system_id: this.system_id,
					cycle_year: this.cycle_year
				},
				loading: false
			}).then(res => {
				this.cycleList = res.data;
			}).catch(error => {});
		},
		// 加载当前关系的周期
		loadNowCycle() {
			return this.$request({
				url: '_HR_EMPLOYEE_UP_NOW_CYCLE_GET',
				type: "GET",
				param: {
					system_id: this.system_id,
				},
				loading: false
			});
		},
		// 获取晋升关系详细规则
		loadData() {
			this.$request({
				url: '_HR_EMPLOYEE_UP_RULE_DETAIL_GET',
				type: "GET",
				param: {
					system_id: this.system_id,
					cycle_id: this.cycle_id,
				},
				loading: false
			}).then(res => {
				this.info = res.data;
				this.file = res.data.cycle_attach_doc;
				this.isHistory = !!res.data.is_history;
				this.oldData = lodash.cloneDeep(res.data);
				// 初始化规则数组
				if (this.info.rule_detail_info.length) {
					this.info.rule_detail_info.forEach((item, index) => {
						this.info.rule_detail_info[index].is_rigid = item.is_rigid === 1;
						if (item.pro_rule_id === 1) {
							this.info.rule_detail_info[index].need_position_id = item.need_position_id ? item.need_position_id : '';
						} else if (item.pro_rule_id === 3) {
							this.info.rule_detail_info[index].need_pro_integral = +item.need_pro_integral;
						} else if (item.pro_rule_id === 4) {
							this.info.rule_detail_info[index].need_pro_credit = +item.need_pro_credit;
						} else if (item.pro_rule_id === 5 || item.pro_rule_id === 6 || item.pro_rule_id === 7) {
							this.info.rule_detail_info[index].accumulate_month = item.is_cycle === 1 ? '考核期间' : item.accumulate_month;
							this.info.rule_detail_info[index].total_performance = +item.total_performance;
							this.info.rule_detail_info[index].average_performance = +item.average_performance;
							this.info.rule_detail_info[index].ranking_place = +item.ranking_place;
						}
					});
				}
				this.oldRuleList = lodash.cloneDeep(this.info.rule_detail_info);
			}).catch(error => {
				this.info = {};
				this.file = [];
				this.is_history = false;
			});
		},
		handleSearch: lodash.debounce(function (event) {
			this.loadData();
		}, 300),
		// 周期年份变化加载相应周期
		handleYearChange(value) {
			this.handleSearch();
			if (!value) {
				this.cycle_id = '';
				this.cycleList = [];
			} else {
				this.loadUpCycle();
			}
		},
		handleDateChange(value) {
			this.year = value;
			this.handleSearch();
		},
		async handleChange(system_id) {
			// 判断数据是否改变以作出提示
			if (this.handleIsChanged()) {
				this.system_id = system_id;
				this.loadUpYear();
				this.loadUpCycle();
				// 判断周期是否开启
				this.loadCycleStatus().then(res => {
					this.isOpened = res.data.is_start === 1;
					// 加载当前周期id
					this.loadNowCycle().then(cycle => {
						this.cycle_id = cycle.data.cycle_id ? cycle.data.cycle_id : '';
						if (cycle.data.cycle_id) {
							this.cycle_year = +this.cycleList.filter(it => it.value === cycle.data.cycle_id)[0].label.split('.')[0];
						}
						// 加载详细规则信息
						this.loadData();
					}).catch(err => {
						this.cycle_year = '';
						this.cycle_id = '';
						this.$Message.warning(err.msg);
					});
				}).catch(() => {});
			} else {
				this.$refs.tab.activeKey = this.system_id;

				DelTipModal.popup({
					title: '提示',
					content: '规则已改变，请点击保存！'
				}).then(res => {
				}).catch(err => {});

			}
		},
		// 保存
		handleSave() {
			let formdata = this.$refs.condition[0].formData;
			const idList = formdata.list.map(item => item.pro_rule_id);
			const hasList = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(item => idList.includes(item));

			// 存在规则
			if (formdata.list.length && hasList.length) {
				this.$refs.condition[0].$refs.form.validateAndScroll(valid => {
					if (valid) {
						this.$request({
							url: '_HR_EMPLOYEE_UP_RULE_SAVE_POST',
							type: "POST",
							param: {
								system_id: this.system_id,
								cycle_id: this.cycle_id,
								cycle_attach_doc: this.file,
								rules: this.getParams(formdata)
							},
							loading: false
						}).then(res => {
							this.$Message.success('保存成功');
							this.loadData();
						}).catch(error => {
							this.$Message.error(error.msg);
						});
					} else {
						this.$Message.error('请按照提示完善表单信息');
					}
				});
			} else {
				this.$request({
					url: '_HR_EMPLOYEE_UP_RULE_SAVE_POST',
					type: "POST",
					param: {
						system_id: this.system_id,
						cycle_id: this.cycle_id,
						cycle_attach_doc: this.file,
						rules: formdata.list.length ? this.getParams(formdata) : []
					},
					loading: false
				}).then(res => {
					this.$Message.success('保存成功');
					this.loadData();
				}).catch(error => {
					this.$Message.error(error.msg);
				});
			}
		},
		getParams(data) {
			let rules = data.list;
			// 是否是硬性标准
			data.list.forEach((item, index) => {
				rules[index] = { ...item };
				rules[index].is_rigid = item.is_rigid ? 1 : 0;

				if (item.accumulate_month === '考核期间') {
					rules[index].is_cycle = 1;
					rules[index].accumulate_month = 1;
				} else {
					rules[index].is_cycle = 0;
				}
			});

			return rules;
		},
		// 新增
		handleAdd() {
			let formdata = this.$refs.condition[0].formData;
			PModal.popup({
				data: {
					system_id: this.system_id,
					cycle_id: this.cycle_id
				},
				list: formdata.list.length ? formdata.list : this.info.rule_detail_info
			}).then(res => {
				// 根据选中的规则进行展示(是否)
				res.regular_rules.forEach(item => {
					if (!item._disabled) {
						// 选中增加
						if (item.is_choose) {
							let isHad = this.info.rule_detail_info.findIndex(item1 => item1.pro_rule_id === item.pro_rule_id);
							if (isHad === -1) {
								this.info.rule_detail_info.splice(this.info.rule_detail_info.length, 0, {
									pro_rule_id: item.pro_rule_id
								});
							} else {
								this.info.rule_detail_info.splice(isHad, 1, {
									...formdata.list[isHad]
								});
							}
						}
						// 没选择
						if (!item.is_choose) {
							let isHad = this.info.rule_detail_info.findIndex(item1 => item1.pro_rule_id === item.pro_rule_id);
							isHad !== -1 ? this.info.rule_detail_info.forEach((item1, index) => {
								if (item.pro_rule_id === item1.pro_rule_id)	{
									this.info.rule_detail_info.splice(index, 1);
								}
							}) : '';
						}
					}
				});

				// 同固定规则
				res.man_made_rules.forEach(item => {
					if (!item._disabled) {
						if (item.is_choose) {
							let isHad = this.info.rule_detail_info.findIndex(item1 => item1.pro_rule_id === item.pro_rule_id);
							isHad === -1 ? this.info.rule_detail_info.splice(this.info.rule_detail_info.length, 0, {
								pro_rule_id: item.pro_rule_id,
								rule_name: item.rule_name + `${item.description ? '（' + item.description + '）' : ''}`
							}) : '';
						}
						if (!item.is_choose) {
							let isHad = this.info.rule_detail_info.findIndex(item1 => item1.pro_rule_id === item.pro_rule_id);
							isHad !== -1 ? this.info.rule_detail_info.forEach((item1, index) => {
								if (item.pro_rule_id === item1.pro_rule_id)	{
									this.info.rule_detail_info.splice(index, 1);
								}
							}) : '';
						}
					}
				});
			}).catch(err => {});
		},
		// 删除
		handleDeleteRule(id) {
			let index = this.info.rule_detail_info.findIndex(item => item.pro_rule_id === id);
			index !== -1 ? this.info.rule_detail_info.splice(index, 1) : '';
		},
		// 规则库
		handleToStore() {
			const { query } = this.$route;
			this.$router.push(getHashUrl(
				'/hr/employee/rank/up/store',
				{
					depart_name: query.depart_name ? query.depart_name : '',
					depart_id: query.depart_id ? query.depart_id : '',
					system_id: this.system_id,
					cycle_id: this.cycle_id ? this.cycle_id : '',
				}
			));
		},
		handleIsChanged() {
			if (this.$refs.condition && this.$refs.condition[0] && !this.isHistory) {
				let _form = this.$refs.condition[0];
				// 判断附件值是否相等
				if (this.file.length !== this.oldData.cycle_attach_doc.length) {
					return false;
				} else {
					let isequal = lodash.isEqual(this.file, this.oldData.cycle_attach_doc);
					if (!isequal) {
						return false;
					}
				}
				// 判断规则值是否相等
				if (_form.formData.list.length !== this.oldData.rule_detail_info.length) {
					return false;
				} else {
					let isequal = lodash.isEqual(this.oldRuleList, _form.formData.list);
					if (!isequal) {
						return false;
					}
				}
			}
			return true;
		},
	},
};
</script>

<style lang="scss" scoped>
.v-hr-employee-rank-up-rule {
	margin-bottom: 60px;
	._title {
		._left {
			display: inline-block;
			width: 2px;
			height: 16px;
			background: #e84854;
			margin-right: 10px;
		}
		._right {
			display: inline-block;
			color: #e84854;
			font-size: 16px;
		}
	}
	._content {
		border: 1px solid #EBEEF1;
		._header {
			height: 40px;
			line-height: 40px;
			border-bottom: 1px solid #EBEEF1;
			background-color: #F0F4FC;
			.ivu-col {
				color: #000;
				padding-left: 20px;
				border-right: 1px solid #EBEEF1;
			}
		}
		._tbody {
			.ivu-col {
				color: #333;
				padding: 20px;
			}
			.ivu-col:nth-of-type(1) {
				color: #818794;
			}
			.ivu-col:nth-of-type(2) {
				min-height: 300px;
				border-left: 1px solid #EBEEF1;
				border-right: 1px solid #EBEEF1;
			}
		}
	}
	._footer {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 60px;
		background-color: #fff;
		box-shadow: 0px -2px 9.9px 0.1px rgba(0, 0, 0, 0.08);
		._disabled:hover {
			color: #333 !important;
			border: 1px solid #d4d7d8;
			cursor: not-allowed;
		}
	}
	._norank {
		height: 450px;
		img {
			margin-bottom: 50px;
		}
	}
}
</style>

<style lang="scss">
.v-hr-employee-rank-up-rule {
	._tabs {
		.ivu-tabs-bar .ivu-tabs-nav-container {
			.ivu-tabs-nav-scrollable {
				padding: 0 30px;
			}
			.ivu-tabs-nav-scroll-disabled {
				display: none !important;
			}
			.ivu-tabs-nav-prev, .ivu-tabs-nav-next {
				display: inline-block;
				width: 30px;
				text-align: center;
				border-top: 1px solid #dcdee2;
				border-left: 1px solid #dcdee2;
				border-top-left-radius: 4px;
			}
			.ivu-tabs-nav-next {
				border-right: 1px solid #dcdee2;
				border-top-left-radius: 0;
				border-top-right-radius: 4px;
			}
			.ivu-tabs-tab:nth-child(2) {
				border-radius: 0 0 0 0 !important;
			}
			.ivu-tabs-tab:last-child {
				border-radius: 0 0 0 0 !important;
			}
			.ivu-tabs-nav-scroll-disabled + .ivu-tabs-nav-scroll .ivu-tabs-nav > .ivu-tabs-tab:nth-child(2) {
				border-top-left-radius: 4px !important;
			}
			.ivu-tabs-nav-scroll-disabled + .ivu-tabs-nav-scroll .ivu-tabs-nav > .ivu-tabs-tab:last-child {
				border-top-right-radius: 4px !important;
			}
		}
	}
}
</style>
