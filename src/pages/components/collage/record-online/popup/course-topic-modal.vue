<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="课程主题"
		width="500px"
		class="v-collage-course-topic-modal"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-m-l-30 g-fs-12 g-c-black2">
			<div 
				v-for="(item, i) in list"
				:key="i"
				class="g-tl g-c-black3 g-lh-40">
				<div 
					style="display: flex">
					<div style="flex: 2">课程主题：</div>
					<div style="flex: 8">{{ item.subject_name }}</div>
				</div>
				<div 
					style="display: flex">
					<div style="flex: 2">讲课时间：</div>
					<div style="flex: 8">{{ item.lecture_time }}</div>
				</div>
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
		record_id: {
			type: Number | String,
			required: true
		},
		online: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			visible: false,
			list: []
		};
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		loadData() {
			this.$request({
				url: API_ROOT._COLLEAGE_RECORD_LESSON_SUBJECT_GET,
				param: {
					record_id: this.record_id
				},
				type: "GET"
			}).then(({ data }) => {
				!this.online && data.forEach(v => { 
					v.lecture_time = JSON.parse(v.lecture_time).join('至');
				});
				this.list = data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		},
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
export const CourseTopicModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-course-topic-modal {
    .ivu-modal-body {
        max-height: 300px;
        overflow: auto;
    }
}
</style>

