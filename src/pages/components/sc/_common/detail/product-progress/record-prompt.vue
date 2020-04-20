<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible" 
			:width="400"
			:loading="true"
			:mask-closable="false"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">
				{{ name == '20' ? '删除跟进记录确认' : '温馨提示' }}
			</div>

			<div v-if="name=='1'">确认完成此步骤?</div>
			<div v-else-if="name=='10'">确认删除该条记录？</div>
			<div v-else>是否删除该条跟进记录？</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";

export default {
	name: "sc-record-prompt-modal",

	components: {
		"i-modal": Modal
	},

	props: {
		name: String,
		make_id: String,
		record_id: String,
		step_id: String
	},

	data() {
		return {
			visible: false
		};
	},

	mounted() {
		this.visible = true;
	},

	methods: {
		handleOk() {
			this.handleSave();
		},

		handleSave() {
			let API = "";
			let make_id = "";
			let step_id = "";
			let record_id = "";

			if (this.name == '1') {
				API = "_SC_CUSTOMER_COOPERATE_COMPLETE_STEP_POST";
				make_id = this.make_id;
				step_id = this.step_id;
			} else if (this.name == '10') {
				API = "_SC_CUSTOMER_COOPERATE_DEL_RECORD_POST";
				record_id = this.record_id;
			} else {
				API = "_SC_CUSTOMER_COOPERATE_DEL_TRACK_RECORD_POST";
				record_id = this.record_id;
			}

			this.$request({
				url: API_ROOT[API],
				type: "POST",
				param: {
					make_id,
					step_id,
					record_id
				}
			}).then(res => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.$refs.modal.buttonLoading = false;
				this.visible = false;
				this.$emit('sure', true);
			}).catch(error => {
				this.$Message.error(error.msg);

				this.$refs.modal.buttonLoading = false;
			});
		},

		handleCancel() {
			this.$emit("close");
		}
	}
};
export const RecordPromptModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
</style>