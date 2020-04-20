<template>
	<div class="v-content-commom-upload">
		<vc-files-picker
			ref="filesPicker"
			v-model="filesList"
			:upload="{multiple: true, max: max, size ,accept,fileBefore:onBefore}"
			:max="max"
			style="margin:0"
			@error="$emit('error',$event)"
		>

			<slot slot="trigger" name="trigger"/>
			<template slot-scope="slotProps">
				<slot name="top"/>
				<div>
					<div
						v-for="(item, index) in slotProps.files"
						:key="index"
						:style="{marginTop: index == 0 ? '13px' : '17px'}"
						class="_progress"
					>
						<div
							:style="{color:item.error_time?'red':''}"
							style="line-height: 12px;"
							@click="handlePostFile($event,item)"
						>
							<i class="iconfont icon-accessory"/>
							<span v-if="item.title.length < 18" style="width: 300px; word-break: break-all;line-height: 14px;">{{ item.title }}</span>
							<i-tooltip
								v-else
								:content="item.title"
								placement="top"
								theme="light"
								max-width="300">
								{{ item.title.slice(0, 18) + '...' }}
							</i-tooltip>
							<span
								class="g-fr g-operation"
								@click.stop="handleDel(item,index)"
							>删除</span>
						</div>
						<div class="g-flex">
							<i-progress :percent="parseInt(item.percent)" :stroke-color="color"/>
							<slot :name="'check'+index"/>
						</div>
					</div>
				</div>
			</template>
			<slot name="bottom"/>
		</vc-files-picker>
	</div>
</template>

<script type="text/ecmascript-6">
import { FilesPicker } from 'wya-vc';
import { Progress, Tooltip } from 'iview';

export default {
	components: {
		'vc-files-picker': FilesPicker,
		'i-progress': Progress,
		'i-tooltip': Tooltip
	},
	props: {
		value: {
			type: Array,
			default() {
				return [];
			}
		},
		// dataSource: {
		// 	type: Array,
		// 	default() {
		// 		return [];
		// 	}
		// },
		size: {
			type: Number,
			default: 20
		},
		accept: String,
		onBefore: Function,
		onError: Function,
		max: {
			type: Number,
			default: 10
		},
		color: {
			type: String,
			default: '#19be6b'
		}
	},
	data() {
		return {
			filesList: [...this.value]

		};
	},
	watch: {
		filesList(v) {
			
			this.filesList = v;
			this.$emit('input', v);
		},
		value(v) {
			this.filesList = v;
		},


	},
	methods: {
		handleDel(item, index) {
			this.$refs.filesPicker && this.$refs.filesPicker.handleDel(item, index);
		},
		handlePostFile(e, v) {
			this.$emit('postFile', e, v);
		},
	}
};
</script>

<style  lang="scss">
.v-content-commom-upload{
	.ivu-progress-show-info .ivu-progress-outer {
		padding-right: 34px;
		margin-right: -34px;
	}
}

</style>
