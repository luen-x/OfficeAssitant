<template>
	<i-poptip
		:transfer="true"
		trigger="hover"
		placement="right"
		class="c-sc-tip-item"
	>
		<slot />
		<div slot="content">
			<p class="g-m-b-25 g-fs-14">{{ content }}</p>

			<div class="g-c-blue-mid g-flex-ac g-jc-fe">
				<i 
					class="iconfont icon-uncomplete g-pointer" 
					@click="handleClose" 
				/>

				<i 
					v-if="is_complete == 0"
					class="iconfont icon-vertical-line g-c-black5" 
				/>
				<i 
					v-if="is_complete == 0"
					class="iconfont icon-edit1 g-pointer" 
					@click="handleEdit"
				/>
				<i 
					v-if="is_complete == 0"
					class="iconfont icon-vertical-line g-c-black5" 
				/>
				<i 
					v-if="is_complete == 0"
					class="iconfont icon-completed g-pointer" 
					@click="handleComplete"
				/>
			</div>
		</div>
	</i-poptip>
</template>

<script>
import { Poptip } from 'iview';
import API_ROOT from "@stores/apis/root";
import { AddSchedModal } from './add-sched-modal';
import { DelPromptModal } from './del-prompt';

export default {
	name: 'v-sc-main-tip-item',

	components: {
		'i-poptip': Poptip,
	},

	props: {
		content: String,
		record_id: [String, Number],
		remind_date: String,
		remind_end_date: String,
		is_complete: [String, Number],
		onRefresh: Function
	},

	methods: {
		handleClose() {
			DelPromptModal.popup({
			}).then((res) => {
				if (res) {
					this.$request({
						url: API_ROOT._SC_MAIN_DEL_REMIND_POST, // eslint-disable-line
						type: 'POST',
						param: {
							record_id: this.record_id
						}
					}).then((ress) => {
						this.$Message.success(ress.msg);
					}).then(() => {
						this.onRefresh && this.onRefresh();
					}).catch((error) => {
						this.$Message.error(error.msg);
					});
				}
			}).catch((res) => {
			});
		},
		handleEdit() {
			AddSchedModal.popup({
				record_id: this.record_id,
				remind_date: this.remind_date,
				remind_end_date: this.remind_end_date,
				edit: true,
				content: this.content
			}).then((res) => {
				this.onRefresh && this.onRefresh();
			}).catch((res) => {
			});
		},
		handleComplete() {
			this.$request({
				url: API_ROOT._SC_MAIN_COMPLETE_REMIND_POST, // eslint-disable-line
				type: 'POST',
				param: {
					record_id: this.record_id
				}
			}).then((res) => {
				this.$Message.success(res.msg);
			}).then(() => {
				this.onRefresh && this.onRefresh();
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>

<style lang="scss">
.c-sc-tip-item {
	.ivu-poptip-rel {
		display: block !important;
	}
}
</style>