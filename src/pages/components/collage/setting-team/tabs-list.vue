<template>
	<div class="v-collage-setting-team">

		<div class="g-flex g-jc-fe g-m-b-5">
			<vc-debounce-click
				v-if="$auth[1327]"
				class="g-red-btn-line"
				@click="handleAdd">
				新增提成制度
			</vc-debounce-click>
		</div>

		<i-tabs
			v-if="hasSetting"
			:value="depart_id"
			:animated="false"
			type="card"
			@on-click="handleChange"
		>
			<i-tab-pane
				v-for="(item) in tabs"
				:key="item.depart_id"
				:label="item.depart_name"
				:name="item.depart_id + ''"
			>
				<vc-paging
					ref="tableTarget"
					:columns="columns"
					:show="item.depart_id == depart_id"
					:type="item.depart_id"
					:data-source="listInfo[item.depart_id].data"
					:total="listInfo[item.depart_id].total"
					:reset="listInfo[item.depart_id].reset"
					:current.sync="current[item.depart_id]"
					:history="true"
					:load-data="loadData"
					class="v-collage-setting-team-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
					@row-click="handleShowDetail"
				>

					<div v-if="$auth[1330]" slot="extra" class="g-flex-ac">
						<i-checkbox
							v-model="isAll"
							@on-change="handleIsAll">
							全选
						</i-checkbox>

						<vc-debounce-click
							class="g-gray-btn-line g-m-l-10"
							@click="handleMultiDelete">
							批量删除
						</vc-debounce-click>
					</div>

				</vc-paging>
			</i-tab-pane>
		</i-tabs>
		<div v-else class="_nosetting g-flex g-fd-c g-jc-c g-ai-c">
			<img :src="nobaseUrl">
			<span>请先设置组织架构，再设置提成</span>
		</div>
	</div>
</template>

<script>
import { Paging } from 'wya-vc';
import API_ROOT from "@stores/apis/root";
import { stairDepart } from '@stores/services/hr';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { Button, Tabs, TabPane, Checkbox } from 'iview';
import { OSS_NOBASE } from '@constants/constants';
import { DelTipModal } from '../../hr/_common/delete-tip';
import { modifyDrawer } from './popup/drawer.vue';
// item
import item from './item';


export default {
	name: 'oa-table',
	components: {
		'vc-paging': Paging,
		'i-button': Button,
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-checkbox': Checkbox,
	},
	mixins: [item, stairDepart()],
	data() {
		const { query } = this.$route;

		return {
			isAll: false,
			depart_id: String(query.depart_id || "12"), // 同tabs下的value
			current: {},
			nobaseUrl: OSS_NOBASE
		};
	},
	computed: {
		isFetched() {
			return this.$store.state.collageSettingTeam.isFetched;
		},
		hasSetting() {
			return this.$store.state.collageSettingTeam.hasSetting;
		},
		tabs() {
			return this.$store.state.collageSettingTeam.tabs;
		},
		listInfo() {
			return this.$store.state.collageSettingTeam.listInfo;
		}
	},
	watch: {
		tabs(newVal, oldVal) {
			const { query } = this.$route;
			this.depart_id = String(query.depart_id || newVal.filter(v => v.depart_name == "商学院")[0].depart_id);
			if (newVal.length === 0) {
				this.loadStairDepart();
			}
		},
	},
	methods: {
		loadData(page, pageSize) {
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'COLLAGE_SETTING_TEAM_LIST_GET',
				type: 'GET',
				param: {
					...query,
					depart_id: this.depart_id,
					type: 2,
					page,
					pageSize
				},
				loading: false
			}).then((res) => {
				
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(departId) {
			if (this.depart_id !== departId) {
				this.isAll = false;
				this.handleIsAll(false);
				this.depart_id = departId;

				let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
				query = {
					...query,
					depart_id: departId,
					page: this.current[departId]
				};
				this.$router.replace(getHashUrl('/collage/setting/team', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT');
		},
		handlePageChange(page) {
			this.isAll = false;
			this.selected = [];
		},
		handleSelectionChange(sed) {
			let data = this.listInfo[this.depart_id].data[this.$route.query.page || 1];
			data = data.filter(it => !it._disabled);
			data && (this.isAll = (data.length == sed.length));
			this.selected = sed;
		},
		handleIsAll(val) {
			let id = '';
			this.tabs.forEach((tab, index) => {
				if (tab.depart_id === +this.depart_id) {
					id = index;
				}
			});
			this.$refs.tableTarget[id].$refs.tableTarget.selectAll(val);
		},
		handleAdd() {
			modifyDrawer.popup({
				type: 'add',
				depart_id: this.depart_id
			}).then(res => {
				this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT');
			}).catch(() => {});
		},
		// 点击删除
		handleMultiDelete() {
			if (this.selected.length) {
				// 获取被选底薪制度id数组
				let arr = this.selected.map(sed => sed.rate_case_id);

				DelTipModal.popup({
					title: '删除提成制度',
					content: '是否确认删除该提成制度?'
				}).then(res => {
					this.$request({
						url: '_HR_SALARY_DELETE_PER_GET',
						type: "GET",
						param: {
							rate_case_id: arr
						},
						loading: false
					}).then(response => {
						this.$Message.success("操作成功");
						this.$store.commit('COLLAGE_SETTING_TEAM_LIST_INIT', this.depart_id);
					}).catch(err => {});
				}).catch(() => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		}
	}
};

</script>

<style lang="scss">
.v-collage-setting-team {
	.ivu-tabs-nav-container {
		display: none;
	}
	.ivu-tabs-bar {
		border-bottom: none;
	}
	._nosetting {
		height: 650px;
		img {
			margin-bottom: 50px;
		}
	}
}
</style>
