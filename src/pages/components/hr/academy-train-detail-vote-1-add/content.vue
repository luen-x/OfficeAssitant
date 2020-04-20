<template>
	<div class="v-hr-academy-train-vote-add">
		<oa-add-vote ref="vote"/>
	</div>
</template>

<script>
import API_ROOT from '@stores/apis/root';
import addVote from './common/add-edit-vote';

export default {
	name: "oa-activity-classify-add",
	components: {
		'oa-add-vote': addVote
	},
	data() {
		return {
			visible: false,
			
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSubmit() {
			this.$refs.formValidate.validateAndScroll((valid) => {
				if (valid) {
					this.$emit('sure');
					// this.$request({
					// 	url: API_ROOT._CONTENT_ACTIVITY_CLASSIFY_ADD_POST,
					// 	type: "POST",
					// 	param: {
					// 		category_name: this.formValidate.name,
					// 		image_url: this.formValidate.image[0]
					// 	} }).then(res => {
					// 	this.visible = false;
					// 	this.$Message.success(res.msg);
					// 	app.$store.commit('CONTENT_ACTIVITY_CLASSIFY_LIST_RESET', { type: '' });
					// }).catch(err => this.$Message.error(err.msg));
					// this.$refs.modal.buttonLoading = false;
					// this.visible = true;
					// this.$Message(err.msg);
					// this.$emit('sure');
				} else {
					this.$refs.modal.buttonLoading = false;
					this.visible = true;
				}
			});
		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handleChange(matter) {
			// master 0: 关联项目 1： 关联课程
			// if (master) {

			// }
		}
	}
};
</script>

<style lang="scss">

</style>

