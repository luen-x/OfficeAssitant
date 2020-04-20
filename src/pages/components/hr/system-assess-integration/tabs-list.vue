<template>
	<div class="v-system-assess-integration g-tabs-card">
		<div class="g-flex g-jc-fe">
			<span 
				v-if="$auth[1152]"
				class="g-red-btn-line" 
				@click="() => handleAdd()">新增积分体系</span>
		</div>
		<i-tabs 
			:value="depart_id" 
			:animated="false"
			type="card" 
			style="margin-top: 20px"
			@on-click="handleChange"
		>
			<i-tab-pane 
				v-for="(item) in tabs"
				:key="item.depart_id"
				:label="`${item.depart_name}`" 
				:name="item.depart_id + ''"
			>
				<div v-if="depart_id == item.depart_id">
					<oa-table 
						v-for="info of data"
						:key="info.ic_system_id"
						:info="info"
						cate="1"
						class="g-m-b-20"
					>
						<div slot="title">
							<span>{{ info.system_name }}</span>
							<span
								v-if="$auth[1160]" 
								class="g-operation g-m-l-20" 
								style="fontSize: 14px"
								@click="() => handleRules(info.ic_system_id)">积分规则</span>
							<span 
								v-if="info.new === 1"
								style="color: #e84c57" 
								class="g-m-l-20">下月生效</span>
						</div>
						<div slot="extra">
							<span 
								v-if="$auth[1152]"
								class="g-operation"
								style="fontSize: 14px" 
								@click="() => handleAdd(info.ic_system_id)">修改</span>
							<i-divider 
								v-if="$auth[1152] && $auth[1168]"
								type="vertical"/>
							<span 
								v-if="$auth[1168]"
								class="g-operation" 
								style="fontSize: 14px"
								@click="() => handleDel(info.ic_system_id)">删除</span>
						</div>
					</oa-table>
				</div>
			</i-tab-pane>
		</i-tabs>
	</div>
</template>

<script>
import { Tabs, TabPane, Divider } from 'iview';
import { getParseUrl, getHashUrl } from '@utils/utils';

import { stairDepart } from '@stores/services/hr';
import Table from '@components/hr/_common/system-credit-integration/table';
import { ConfirmModal } from '@components/hr/_common/popup/confirm';

export default {
	name: 'oa-system-assess-integration',
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		'i-divider': Divider,
		'oa-table': Table
	},
	mixins: [stairDepart()],
	data() {
		const { query } = this.$route;
		return {
			depart_id: query.depart_id,
			data: []
		};
	},
	computed: {
		tabs() {
			return this.$store.state.hrSystemAssessIntegration.tabs;
		},
		listInfo() {
			return this.$store.state.hrSystemAssessIntegration.listInfo;
		}
	},
	watch: {
		tabs(val) {
			const { query } = this.$route;
			this.depart_id = query.depart_id || (this.tabs[0] && this.tabs[0].depart_id + "");
			this.loadData();
		}
	},
	methods: {
		handleChange(depart_id) {
			this.depart_id = depart_id;

			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				depart_id,
			};
			this.$router.replace(getHashUrl('/hr/system/assess/integration', { ...query }));
			this.loadData();
		},
		handleAdd(ic_system_id) {
			this.$router.push(getHashUrl('/hr/system/assess/integration/add', 
				{ depart_id: this.depart_id, ic_system_id }));
		},
		handleRules(ic_system_id) {
			this.$router.push(getHashUrl('/hr/system/assess/integration/rules', 
				{ depart_id: this.depart_id, ic_system_id }));
		},
		handleDel(ic_system_id) {
			ConfirmModal.popup({
				content: '真的要删除我吗，删除就无法恢复咯'
			}).then(info => {
				this.$request({
					url: '_HR_SYSTEM_ASSESS_CREDITINTE_DEL_POST',
					type: 'GET',
					param: {
						ic_system_id
					},
				}).then(res => {
					this.$Message.success(res.msg);
					this.loadData();
				}).catch(err => {
					this.$Message.error(err.msg);
				});
			}).catch(err => {

			});
		},
		loadData() {
			this.$request({
				url: '_HR_SYSTEM_ASSESS_CREDITINTE_GET',
				type: 'GET',
				param: {
					cate: 1,
					depart_id: this.depart_id
				},
			}).then(res => {
				this.data = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
				this.data = [];
			});
		}
	},
};
</script>

<style lang="scss" scoped>
.v-system-assess-integration {
	padding: 20px;
	.ivu-tabs {
		margin-top: 0px !important;
	}
}
</style>
