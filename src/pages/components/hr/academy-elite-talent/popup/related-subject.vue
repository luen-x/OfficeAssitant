<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="关联课程"
		width="360px"
		class="v-hr-train-elite-related-subject"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-l-30 g-m-t-10 g-fs-14 g-c-black2">
			<div 
				v-for="(item, i) in list"
				:key="i"
				class="g-tl"
				style="padding: 5px 0">
				<span class="g-c-black5">课程名称：</span>
				<span class="g-c-black3">{{ item.course_name }}</span>
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Upload } from 'iview';
import API_ROOT from '@stores/apis/root';
import { CreatePortal } from 'wya-vc';

export default {
	name: "oa-hr-train-elite-related-subject",
	components: {
		'i-modal': Modal,
	},
	props: {
		subject_id: {
			type: Number | String,
			required: true
		}
	},
	data() {
		return {
			visible: false,
			list: []
		};
	},
	created() {
		this.$request({
			url: API_ROOT._HR_ACADEMY_ELITE_COURSE_INFO_LIST_GET,
			param: {
				subject_id: this.subject_id
			},
			type: "GET"
		}).then(({ data }) => {
			this.list = data;
		}).catch(err => {
			this.$Message.error(err.msg);
		});
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('sure', true);
		},
		handleCancel() {
			this.$refs.modal.buttonLoading = false;
			this.$emit('close', false);
			this.visible = false;
		}
	}
};
export const RelatedModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-hr-train-elite-related-subject {
    .ivu-modal-body {
        max-height: 300px;
        overflow: auto;
    }
}
</style>

