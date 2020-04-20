<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="请选择人才梯队"
		width="360px"
		class="v-hr-train-elite-related-subject"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-l-30 g-m-t-10 g-fs-14 g-c-black2">
			<div class="g-c-black2 g-m-b-20">人才梯队</div>
			<i-tree 
				ref="tree" 
				:data="treeData" 
				show-checkbox
				check-strictly
				@on-check-change="handleCheckChange"/>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Tree } from 'iview';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-hr-train-elite-related-subject",
	components: {
		'i-modal': Modal,
		'i-tree': Tree
	},
	props: {
		data: Array
	},
	data() {
		return {
			visible: false,
			treeData: (JSON.parse(JSON.stringify(this.data))),
			allStages: []
		};
	},
	created() {
		this.treeData = this.handleInitTreeData(this.treeData);
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			const select = this.$refs.tree.getCheckedNodes();
			if (select.length > 1) {
				this.$Message.error('只能选择一个人才梯队奥');
				return;
			}
			this.$emit('sure', select[0]);
			this.visible = false;
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		},
		handleCheckChange(select) {
			// 便利数据更改状态
		},
		handleInitTreeData(data) {
			data.forEach(echelon => {
				echelon.expand = true;
				echelon.disableCheckbox = true;
				echelon.title = echelon.echelon_name;
				if (echelon.children && echelon.children.length) {
					echelon.disableCheckbox = true;
					echelon.children.forEach(plan => {
						plan.title = plan.echelon_name;
						plan.expand = true;
						if (plan.stage && plan.stage.length) {
							if (plan.stage.length === 1) {
								plan.clickInfo = {
									echelon_name: plan.echelon_name,
									echelon_id: plan.echelon_id,
									stage_id: plan.stage[0].stage_id
								};
								this.allStages.push(plan.stage[0]);
							} else {
								plan.children = plan.stage;
								plan.disableCheckbox = true;
								plan.stage.forEach(stage => {
									stage.title = stage.stage_name;
									stage.clickInfo = {
										echelon_id: plan.echelon_id,
										stage_id: stage.stage_id,
										echelon_name: plan.echelon_name
									};
									this.allStages.push(stage);
								});
							}
						} 
					});
				}
			});
			return data;
		}
	}
};
export const EchelonModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-train-elite-related-subject {
    .ivu-modal-body {
        max-height: 300px;
        overflow: auto;
    }
    .ivu-checkbox-wrapper-checked + span {
        color: #E84C57
    }
    .ivu-tree-title-selected {
        background-color: #fff!important;
    }
	.ivu-tree ul li {
		margin: 12px 0;
	}
}
</style>

