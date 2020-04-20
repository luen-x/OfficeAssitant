<template>
	<div class="g-pd-20">
		<oa-content 
			v-if="query.ic_system_id" 
			:disabled="true" 
			:info="editInfo.new"
			:cate="cate" />
		<oa-content ref="content" :cate="cate" :info="editInfo.next" />
	</div>
</template>

<script>
import Content from './content';

export default {
	name: 'add-content-container',
	components: {
		'oa-content': Content,
	},
	props: {
		cate: String
	},
	data() {
		const { query } = this.$route;
		return {
			query,
			editInfo: {
			}
		};
	},
	mounted() {
		this.query.ic_system_id && this.loadInfo();
	},
	methods: {
		loadInfo() {
			this.$request({
				url: '_HR_SYSTEM_ASSESS_CREDITINTE_EDIT_INFO_GET',
				type: 'GET',
				param: {
					...this.query,
					need_rule: 0
				},
			}).then(res => {
				this.editInfo = res.data;
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
</script>

