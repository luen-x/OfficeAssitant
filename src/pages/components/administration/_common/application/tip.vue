<template>
	<div >
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true" 
			:mask-closable="false"
			width="400"
			class="v-application-mine-tip-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="g-flex  g-flex-cc g-m-t-10 g-fs-14 _tip" >
				<div >真的要撤回我吗，撤回后我可就消失咯。</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal } from "iview";
import lodash from "lodash";
import { CreatePortal } from "wya-vc";
import API from "@stores/apis/root";

export default {
	name: "hr-add-customer-modal",
	components: {
		"i-modal": Modal,
	},
	props: {
		title: String,
		eventId: Number
	},
	data() {
		return {
			visible: false,
		};
	},
	computed: {},
	created() {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk: lodash.debounce(function (event) {
			this.$request({
				url: API._ADMINISTRATION_APPLICATION_MINE_EVENT_APPLY_DEL_GET,
				type: "GET",
				param: {
					event_id: this.eventId
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit("ADMINISTRATION_APPLICATION_MINE_LIST_INIT");
				this.$emit("sure", true);
			}).catch(error => {
				this.$Message.error(error.msg);
				this.$refs.modal.buttonLoading = false;
			});
		}, 0),
		handleCancel() {
			this.visible = false;
		}
	}
};

export const TipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-application-mine-tip-modal{
	._tip{
	height:100px;
	}
	
	.ivu-modal-content{
		.ivu-modal-body{
			padding:6px 0px !important;

		}
		.ivu-modal-footer{
			padding:0px 20px 20px 18px !important;
		}
	}
}
</style>


