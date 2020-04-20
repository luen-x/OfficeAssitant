<template>
	<div v-if="isFetched" class="v-collage-setting-promoting">

		<div class="g-flex g-jc-fe g-m-b-5">
			<vc-debounce-click
				v-if="$auth[1322]"
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
					class="v-collage-setting-promoting-list"
					mode="table"
					@page-change="handlePageChange"
					@page-size-change="handleChangePageSize"
					@selection-change="handleSelectionChange"
				>
					<div slot="extra" class="g-flex-ac">
						<i-checkbox
							v-model="isAll"
							@on-change="handleIsAll">
							全选
						</i-checkbox>

						<vc-debounce-click
							v-if="$auth[1325]"
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
import { PModal } from './popup/modal.vue';
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
			return this.$store.state.collageSettingPromoting.isFetched;
		},
		hasSetting() {
			return this.$store.state.collageSettingPromoting.hasSetting;
		},
		tabs() {
			return this.$store.state.collageSettingPromoting.tabs;
		},
		listInfo() {
			return this.$store.state.collageSettingPromoting.listInfo;
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
				url: 'COLLAGE_SETTING_PROMOTING_LIST_GET',
				type: 'GET',
				param: {
					...query,
					depart_id: this.depart_id,
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
				this.$router.replace(getHashUrl('/collage/setting/promoting', { ...query }));
			}
		},
		handleChangePageSize() {
			this.isAll = false;
			this.$store.commit('COLLAGE_SETTING_PROMOTING_LIST_INIT', this.depart_id);
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
		// 新增提成制度
		handleAdd() {
			PModal.popup({
				data: {
					action: 'add',
					depart_id: this.depart_id
				}
			}).then(res => {

				let rate = [];
				let separate = [];
				res.pointList.forEach(item1 => {
					rate.push(item1.rate);
					separate.push(item1.separate);
				});

				// 新增制度
				this.$request({
					url: API_ROOT._HR_SALARY_ADD_PER_GET,
					type: "GET",
					param: {
						...res,
						rate,
						separate,
						depart_id: this.depart_id
					},
					loading: false
				}).then(response => {
					this.$Message.success('操作成功');
					this.$store.commit('COLLAGE_SETTING_PROMOTING_LIST_INIT', this.depart_id);
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(() => {});
		},
		// 点击删除
		handleMultiDelete() {
			if (this.selected.length) {
				// 获取被选底薪制度id数组
				let arr = this.selected.map(sed => sed.rate_case_id);

				PModal.popup({
					data: {
						action: 'delete-multi',
						selected: arr
					}
				}).then(res => {
					this.isAll = false;
					res === 1 ? this.$store.commit('COLLAGE_SETTING_PROMOTING_LIST_INIT', this.depart_id) : '';
				}).catch(() => {});
			} else {
				this.$Message.warning('请至少选择一项进行操作！');
			}
		},
	}
};

</script>

<style lang="scss">
.v-collage-setting-promoting {
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
