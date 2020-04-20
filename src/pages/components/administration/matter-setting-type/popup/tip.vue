<template>
	<div >
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true" 
			:mask-closable="false"
			width="400"
			class="v-matter-setting-type-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div slot="header" class="g-tc">{{ title }}</div>
			<div class="g-flex  g-flex-cc g-m-t-10 g-fs-14 _tip" >
				<div >真的要删除我吗，删除后就无法恢复咯。</div>
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
		eventTypeId: Number
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
				url: API._ADMINISTRATION_MATTER_TYPE_DEL_POST,
				type: "GET",
				param: {
					event_type_id: this.eventTypeId
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.$store.commit("ADMINISTRATION_MATTER_SETTING_TYPE_LIST_INIT");
				this.$emit("sure", true);
			}).catch(err => { this.$Message.error(err.msg); this.$refs.modal.buttonLoading = false; });
		}, 0),
		handleCancel() {
			this.visible = false;
		}
	}
};

export const TipModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-matter-setting-type-modal{
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


