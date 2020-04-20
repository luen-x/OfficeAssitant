<template>
	<div>
		<div v-if="data.showEdit">
			<i-input
				ref="input"
				v-model="name"
				:maxlength="8"
				:autofocus="true"
				style="width: 200px"
				@on-blur="handleBlur"/>
		</div>
		<div v-else>
			<span class="g-pd-r-5">{{ data.category_name }}</span>
			<i-icon
				:size="16"
				style="cursor: pointer; margin-bottom: 2px"
				type="md-create"
				@click="handleShowEdit"/>
		</div>
	</div>
</template>

<script>
import { Input, Icon } from 'iview';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'oa-text-input',
	components: {
		'i-input': Input,
		'i-icon': Icon
	},
	props: {
		data: Object,
	},
	data() {
		return {
			name: ''
		};
	},
	methods: {
		handleShowEdit() {
			this.name = this.data.category_name;
			this.data.showEdit = true;
			this.$nextTick(() => {
				this.$refs.input.focus();
			});
		},
		handleBlur() {
			if (!this.name) {
				this.$Message.error('名称不能为空！');
				this.data.showEdit = false;
				return;
			}
			if (this.name === this.data.category_name) {
				this.data.showEdit = false;
				return;
			}
			this.data.category_name = this.name;
			this.$request({
				url: API_ROOT._CONTENT_ACTIVITY_CLASSIFY_RENAME_POST,
				type: "POST",
				param: {
					id: this.data.category_id,
					name: this.data.category_name
				}
			}).then(res => {
				this.$Message.success(res.msg);
				this.data.showEdit = false;
			}).catch(err => this.$Message.error(err.msg));
		}
	}
};
</script>




