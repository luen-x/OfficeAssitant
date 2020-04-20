<template>
	<div class="v-hr-tool-modules-config">
		<p class="g-m-b-5">{{ info.name }}</p>
		<i-select
			v-model="template_id"
			style="width: 220px"
			clearable
			transfer
			placeholder="请选择模板"
			@on-change="handleChange"
		>
			<i-option
				v-for="(item, index) in link"
				:key="index"
				:value="item.template_id + ''"
			>
				{{ item.name }}
			</i-option>
		</i-select>
	</div>
</template>

<script>
import { Select, Option, Message } from 'iview';
import API_ROOT from '@stores/apis/root';

export default {
	name: 'hr-tool-modules-config',
	components: {
		'i-select': Select,
		'i-option': Option,
	},
	props: {
		info: {
			type: Object,
			default() {
				return {};
			}
		},
		scenario: String | Number
	},
	data() {
		return {
			template_id: this.info.template_id + '',
			link: []
		};
	},
	watch: {
		info(newVal, oldVal) {
			this.template_id = newVal.template_id + '';
			this.loadLink();
		}
	},
	created() {
		this.loadLink();
	},
	methods: {
		handleChange(value) {
			this.$emit('change', value);
		},
		loadLink() {
			this.$request({
				url: API_ROOT["_HR_TOOL_WORKFLOW_LINK_GET"],
				type: 'GET',
				param: {
					scenario: this.scenario,
					type: this.info.type
				},
				loading: false
			}).then((res) => {
				this.link = res.data;
			}).catch((error) => {
				this.$Message.error(error.msg);
			});
		}
	}
};
</script>


<style lang="scss">

</style>
