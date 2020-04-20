<template>
	<i-tabs 
		:value="type" 
		:animated="false"
		type="card" 
		class="v-hr-academy-elite-talent"
		@on-click="handleChange"
	>
		<div class="_content" >
			<div v-if="echelons.length" class="__left" >
				<div class="g-fs-14 g-m-b-20" style="color: #4B4F57" >人才梯队</div>
				<i-tree 
					:data="echelons"
					class="__tree"
					@on-select-change="handleSelectChange"/>
			</div>
			<!-- <div class="__height"/> -->
			<div class="__right">
				<i-tab-pane 
					v-for="(item, i) in tabs"
					:key="item.depart_id"
					:label="item.depart_name" 
					:name="i + ''"
					class="_tabs-pane"
				>
					<div v-if="tabs.length && echelons.length" >
						<oa-header 
							:data="stages" 
							:depart-id="item.depart_id" 
							:position-list="positionList"/>
						<oa-filter />
						<vc-paging
							ref="tableTarget"
							:columns="columns"
							:show="i == type" 
							:type="i"
							:data-source="listInfo[i].data"
							:total="listInfo[i].total"
							:reset="listInfo[i].reset"
							:current.sync="current[i]"
							:history="true"
							:load-data="loadData"
							:table-opts="{ 'tooltip-theme': 'light' }"
							class="v-hr-academy-elite-talent-list"
							mode="table"
							@page-change="handlePageChange"
							@page-size-change="handleChangePageSize"
							@selection-change="handleSelectionChange"
						>
							<div v-if="$auth[1088]" slot="extra" class="g-flex-ac">
								<i-checkbox
									v-model="isAll"
									@on-change="handleIsAll"
								>
									全选
								</i-checkbox>
								<i-button @click="handleChangeTeam">变更梯队</i-button>
								<i-button class="g-m-l-10" @click="handleBatchDel">批量删除</i-button>
							</div>
						</vc-paging>
					</div>
				</i-tab-pane>
			</div>
		</div>
	</i-tabs>
</template>

<script>
import { Tabs, TabPane, Tree, Checkbox, Button } from 'iview';
import checkAll from '@extends/mixins/checkAll';
import { Paging } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import API_ROOT from '@stores/apis/root';
import { ModalTip } from '@components/hr/academy-train-detail/_common/popup/model-tips';
import Filter from './filter';
import Header from './header';
import item from './item';
import { EchelonModal } from './popup/elite-echelon';

export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'oa-filter': Filter,
		'oa-header': Header,
		'i-tree': Tree,
		'i-checkbox': Checkbox,
		'i-button': Button,
	},
	mixins: [item, checkAll],
	data() {
		const { query } = this.$route;
		return {
			type: String(query.type || "0"), // 同tabs下的value
			current: {},
			tabs: [],
			stages: {},
			echelon_id: '', // 计划——id
			stage_id: '',
			echelon_name: '',
			count: 0,
			echelons: [],
			positionList: [],
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.hrAcademyEliteTalent.listInfo;
		},
		nowTab() {
			return this.tabs[this.type - 1];
		}
	},
	async created() {
		await this.loadTabsData();
		await this.loadEchelonData();
		await this.loadPositionData();
		await this.loadStageData();
	},
	mounted() {
	},
	methods: {
		loadData(page, pageSize) {
			this.isAll = false;
			this.selected = [];
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'HR_ACADEMY_ELITE_TALENT_LIST_GET',
				type: 'GET',
				param: {
					...query,
					type: this.type,
					page,
					pageSize
				},
				loading: false
			}).then((res) => {
			}).catch((error) => {
				console.error(error);
			});
		},
		async loadTabsData() {
			const { data } = await this.$request({
				url: API_ROOT.HR_STAIR_DEPART_GET,
				type: "GET",
				loading: false
			});
			this.tabs = data;
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_TABS_GET', data);
		},
		async loadEchelonData() {
			let { data } = await this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_TALENT_ECHELON_LIST_GET,
				type: "GET",
				param: { depart_id: this.tabs[+this.type].depart_id },
			});
			if (!Array.isArray(data)) {
				data = [];
				this.$Message.warning('该分类下暂无数据奥');
			} else {
				this.handleInitTreeData(data);
			}
			this.handleRenderData(data);
			this.echelons = data;
			this.handleReplaceQuery();
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_TABS_GET', this.tabs); 
		},
		async loadStageData() {
			const { data } = await this.$request({
				url: API_ROOT._HR_ACADEMY_ELITE_SETTING_STAGE_INFO_GET,
				param: {
					stage_id: this.stage_id
				},
				loading: false
			});
			this.stages = data;
		},
		async loadPositionData() {
			const { data } = await this.$request({
				url: API_ROOT._HR_DEPART_POSITION_GET,
				type: 'GET',
				loading: false
			});
			this.positionList = data
				.filter(v => v.depart_id == this.tabs[+this.type].depart_id)[0].positions
				.map(v => {
					Number(v.position_id);
					return v;
				});
		},
		async handleSelectChange({ data }) {
			if (!data) return;
			const { clickInfo } = data;
			if (!clickInfo || this.stage_id == clickInfo.stage_id) return;
			if (clickInfo) {
				this.echelon_id = clickInfo.echelon_id;
				this.stage_id = clickInfo.stage_id;
				this.echelon_name = clickInfo.echelon_name;
			}
			await this.loadPositionData();
			await this.loadStageData();
			this.handleReplaceQuery();
			// 初始化数据
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_TABS_GET', this.tabs); 
		},
		async handleChange(type) {
			this.type = type;
			this.count = 0;
			this.echelon_id = '';
			this.stage_id = '';
			this.echelon_name = '';
			this.echelons = [];
			this.stages = {};
			this.isAll = false;
			this.handleIsAll(false);
			await this.loadEchelonData();
			await this.loadStageData();
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type: this.type,
				page: this.current[this.type],
				echelon_id: this.echelon_id,
				stage_id: this.stage_id,
				echelon_name: this.echelon_name,
				depart_id: this.tabs[+this.type].depart_id,
				keyword: '',
				position_id: '',
				start_seniority: '',
				end_seniority: '',
				start_time: '',
				end_time: ''
			};
			this.$router.replace(getHashUrl('/hr/academy/elite/talent', { ...query }));
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_TABS_GET', this.tabs);
		},
		handleRenderData(data) {
			data.forEach((v, i) => {
				data[i] = {
					...v,
					render: (h, param) => {
						return (
							<span 
								title={param.data.title}
								class={ (v.clickInfo && this.$route.query.stage_id == v.clickInfo.stage_id) ? 'g-c-red-light' : '' }
								onClick={ () => this.handleSelectChange(param) }>
								{ param.data.title.length > 6 ? param.data.title.slice(0, 6) + '...' : param.data.title }
							</span>);
					}
				};
				if (v.children && v.children.length) {
					this.handleRenderData(v.children);
				}
			});
		},
		handleReplaceQuery() {
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type: this.type,
				page: this.current[this.type],
				echelon_id: this.echelon_id,
				stage_id: this.stage_id,
				echelon_name: this.echelon_name,
				depart_id: this.tabs[+this.type].depart_id
			};
			this.$router.replace(getHashUrl('/hr/academy/elite/talent', { ...query }));
		},
		handleChangePageSize() {
			this.isAll = false;

			// 初始化数据
			this.$store.commit('HR_ACADEMY_ELITE_TALENT_TABS_GET', this.tabs);
		},
		handleIsAll(val) {
			this.$refs.tableTarget && this.$refs.tableTarget.length
			&& this.$refs.tableTarget[this.type].$refs.tableTarget.selectAll(val);
		},
		handleSelect(name) {
		},
		handleChangeTeam() {
			if (!this.selected.length) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}
			EchelonModal.popup({
				data: this.echelons
			}).then(({ clickInfo }) => {
				ModalTip.popup({
					content: `您选择的${this.handleSelectData().staff_name.join('、')}已在“${this.echelon_name}”中，确定变更到“${clickInfo.echelon_name}”中吗？`
				}).then(res => {
					this.$request({
						url: API_ROOT._HR_ACADEMY_ELITE_TALENT_CHANGE_ECHELON_POST,
						param: {
							old_echelon_id: this.echelon_id,
							old_stage_id: this.stage_id,
							new_echelon_id: clickInfo.echelon_id,
							new_stage_id: clickInfo.stage_id,
							staff_ids: this.handleSelectData().staff_id
						},
						type: "POST"
					}).then(resp => {
						this.$Message.success(resp.msg);
						this.handleResetFirst();
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				});
			});
		},
		handleBatchDel() {
			if (!this.selected.length) {
				this.$Message.warning('请至少选择一项进行操作！');
				return;
			}
			if (!this.$auth[1089]) {
				this.$Message.error('没有权限');
				return;
			}
			this.handleSubmitDelete(this.handleSelectData());
		},
		handleSingleDel(rowData) {
			if (!this.$auth[1089]) {
				this.$Message.error('没有权限');
				return;
			}
			this.handleSubmitDelete({
				staff_id: [rowData.staff_id],
				applicant_id: [rowData.applicant_id]
			});
		},
		handleSubmitDelete({ staff_id, applicant_id }) {
			ModalTip.popup({
				content: '删除后，以后再进入该梯队，需手动添加，确定要将其从人才梯队中移除吗？',
				title: '删除'
			}).then(() => {
				this.$request({
					url: API_ROOT._HR_ACADEMY_ELITE_TALENT_DELETE_STAFF_POST,
					type: "POST",
					param: {
						echelon_id: this.$route.query.echelon_id,
						stage_id: this.$route.query.stage_id,
						staff_id,
						applicant_id
					}
				}).then(res => {
					this.$Message.success(res.msg);
					this.handleResetFirst();
				}).catch(err => this.$Message.error(err.msg));
			});
		},
		handleSelectData() {
			return this.selected.reduce((init, cur) => {
				init.staff_name.push(cur.staff_name);
				init.staff_id.push(cur.staff_id);
				init.applicant_id.push(cur.applicant_id);
				return init;
			}, { staff_id: [], staff_name: [], applicant_id: [] });
		},
		handleInitTreeData(data) {
			data.forEach(echelon => {
				echelon.expand = true;
				echelon.title = echelon.echelon_name;
				if (echelon.child && echelon.child.length) {
					echelon.children = echelon.child;

					echelon.child.forEach(plan => {
						plan.title = plan.echelon_name;
						plan.expand = true;
						if (plan.stage && plan.stage.length) {
							if (plan.stage.length === 1) {
								// clickInfo: 代表可以点击  以及保存点击信息
								plan.clickInfo = {
									echelon_name: plan.echelon_name,
									echelon_id: plan.echelon_id,
									stage_id: plan.stage[0].stage_id
								};
								if (!this.count) {
									this.echelon_id = plan.echelon_id;
									this.stage_id = plan.stage[0].stage_id;
									this.echelon_name = plan.echelon_name;
								}
							} else {
								plan.children = plan.stage;
								plan.stage.forEach(stage => {
									stage.title = stage.stage_name;
									stage.clickInfo = {
										echelon_id: plan.echelon_id,
										stage_id: stage.stage_id,
										echelon_name: plan.echelon_name
									};
								});
								if (!this.count) {
									this.echelon_id = plan.echelon_id;
									this.stage_id = stage.stage_id;
									this.echelon_name = plan.echelon_name;
								}
							}
						} 
						this.count++;
					});
				}
			});
		}
	}
};

</script>

<style lang="scss">
.v-hr-academy-elite-talent {
	padding-bottom: 100px;
	&.ivu-tabs {
		// height: calc(100% - 20px);
		height: 100%;
		width: calc(100% - 5px);
		// overflow-x: auto;
	}
	.ivu-tabs-content {
		height: 100%;
	}
	._content {
		display: flex;
		height: 107%;
		width: 100%;
			.__left {
				min-width: 160px;
				max-width: 160px;
				height: 100%;
				margin-right: 20px;
				background: rgba(245, 245, 246, 1);
				padding: 20px;
				user-select: none;
				overflow-y: hidden;
				overflow-x: hidden;
				&:hover {
					overflow-y: auto;
				}
			}
			.__right {
				flex: 1;
				overflow-y: auto;
				padding-bottom: 20px;
				// margin-right: -20px;
				// padding-right: 15px;
				&::-webkit-scrollbar {display:none}
			}
		}
		.__height {
			position: fixed;
			bottom: 0;
			left: 180px;
			width: 160px;
			height: 100px;
			z-index: -1;
			background-color: rgba(245, 245, 246, 1);
			}
		.__tree {
			color: #4B4F57;
			cursor: pointer;
			.ivu-icon-ios-arrow-forward::before {
				content: '\F341';
				font-size: 16px;
			}
			.ivu-tree-arrow-open {
				.ivu-icon-ios-arrow-forward::before {
					// content: '\F33D';
					font-size: 16px;
			}
			}
			.ivu-icon {
				// transform: translateY(-2px)
				margin-top: -2px;
			}
			.ivu-tree-title-selected:hover {
				background: none;
				color: #E84C57;
			}
			.ivu-tree-title-selected {
				background: none;
				color: #E84C57;
			}
		}
		.ivu-tree ul li {
				margin: 12px 0!important;
		}
		.__footer {
			width: calc(100% - 340px) !important;
		}
	}
</style>
