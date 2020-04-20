<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true" 
		:mask-closable="false"
		width="650"
		class="v-hr-entry-role-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			晋升团队
		</div>
		<div class="v-hr-archives-person-detail">
			<i-tabs 
				:value="type" 
				:animated="false"
				type="card" 
				class="g-tabs-card"
				name="tab1"
				@on-click="handleChange"
			>
				<i-tab-pane 
					v-for="item in tabs"
					:key="item.value" 
					:label="item.label" 
					:name="item.value"
					tab="tab1"
				>
					<oa-add-staff 
						v-show="type==='1'" 
						ref="staffModal" 
						:pro-team-staff-arr="proTeamStaffArr" 
						:staff_id="staff_id" />
					<oa-add-organization 
						v-show="type==='2'" 
						ref="organizationModal" 
						:pro-team-depart-arr="proTeamDepartId" 
						:staff_id="staff_id"/>
				</i-tab-pane>
			</i-tabs>
		</div>
	</i-modal>
</template>
<script>
import { Tabs, TabPane, Modal } from 'iview';
import { CreatePortal } from "wya-vc";
import { getParseUrl, getHashUrl } from '@utils/utils';
import AddStaffModal from './add-staff';
import OrganizationModal from './add-organization';

export default {
	name: "v-hr-archives-person-detail",
	components: {
		'i-tabs': Tabs,
		'i-tab-pane': TabPane,
		"i-modal": Modal,
		"oa-add-staff": AddStaffModal,
		"oa-add-organization": OrganizationModal
	},
	props: {
		staff_id: String,
		proTeamDepartId: Array,
		proTeamStaffArr: Array,
	},
	data() {
		const { query } = this.$route;
		return {
			visible: false,
			data: {},
			type: "1", // 同tabs下的value
			current: {},
			pro_team_staff_id: [],
			pro_team_depart_id: [],
			tabs: [
				{
					label: "添加个人",
					value: "1"
				},
				{
					label: "添加组织",
					value: "2"
				}
			],
		};
	},
	mounted() {
		this.visible = true; 
	},
	methods: {
		
		handleChange(type) {
			this.type = type;
		},
		handleOk() {
			this.pro_team_staff_id = [];
			this.pro_team_depart_id = [];
			if (this.$refs.staffModal['0'].ids.length) {
				this.pro_team_staff_id = this.$refs.staffModal['0'].ids;
			}
			if (this.$refs.organizationModal['1'].ids.length) {
				this.pro_team_depart_id = this.$refs.organizationModal['1'].ids;
			}
			// this.$refs.organizationModal['1'].ids.length && this.pro_team_depart_id.push(...this.$refs.organizationModal['1'].ids);
			// this.$emit("sure", { pro_team_staff_id: this.pro_team_staff_id, pro_team_depart_id: this.pro_team_depart_id });
			this.$emit("sure", [this.pro_team_staff_id, this.pro_team_depart_id]);
		},
		handleCancel() {
			this.$emit("close", false);
		},
	}
};
export const AddProTeamModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
</style>
