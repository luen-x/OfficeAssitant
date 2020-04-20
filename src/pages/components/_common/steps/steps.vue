<template>
	<div class="c-steps">
		<div
			v-for="(item, index) in dataSource"
			:key="index"
		>
			<div class="g-flex">
				<div>
					<div class="g-jc-c" style="width: 16px; margin-top: 4px">
						<div
							v-if="type === 1"
							:class="index === 0 ? '_dot-active' : '_dot'"
						/>
						<div
							v-else
							:class="index < length - 1 ? '_dot' : '_dot-active'"
						/>
					</div>
					<div v-if="index < length - 1" class="_line" />
				</div>
				<div
					:style="{'min-width': minWidth}"
					style="max-width: 600px"
				>
					<step-title :render="renderTitle" :rows="getRow(item, index, dataSource)" />
					<step-content :render="renderContent" :rows="getRow(item, index, dataSource)" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { CreateCustomer } from 'wya-vc';

const StepTitle = CreateCustomer({
	rows: Object
});
const StepContent = CreateCustomer({
	rows: Object
});
export default {
	name: 'oa-steps',
	components: {
		'step-title': StepTitle,
		'step-content': StepContent,
	},
	props: {
		dataSource: {
			type: Array,
			default() {
				return [];
			}
		},
		minWidth: {
			type: String,
			default() {
				return "200px";
			}
		},
		type: Number, // 1 表示_dot-active向上,其余的表示向下
		renderTitle: {
			type: Function,
			default(h, params = {}) {
				const { title } = params.rows;
				return (
					<p class="g-fs-14 g-c-black2 g-m-l-10 g-oneline" style="color: #4b4f57">{ title }</p>
				);
			}
		},
		renderContent: {
			type: Function,
			default(h, params = {}) {
				const { content } = params.rows;
				return (
					<p class="g-c-black4 g-pd-t-5 g-pd-b-10 g-m-l-10 g-nobreak" style="color: #818794">{ content }</p>
				);
			}
		}
	},

	data() {
		return {};
	},
	computed: {
		length() {
			return this.dataSource.length;
		}
	},
	methods: {
		getRow(item, index, data) {
			return { ...item, index, data };
		}
	}
};
</script>

<style lang="scss">
.c-steps {
	._dot {
		width: 12px;
		height: 12px;
		margin-left: 2px;
		border-radius: 6px;
		border: 1px solid #e74854;
	}
	._dot-active {
		width: 16px;
		height: 16px;
		border-radius: 8px;
		background-color: #e74854;
		border: 4px solid #f5b6bb;
	}
	._line {
		width: 1px;
		height: calc(100% - 22px);
		background-color: #cdcdcd;
		margin-left: 7px;
		margin-top: 4px;
	}
}
</style>
