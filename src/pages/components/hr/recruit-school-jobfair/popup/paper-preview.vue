<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:width="680"
		:mask-closable="false"
		:loading="true"
		class="hr-integration-look"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div slot="header" class="g-tc">
			试题预览
		</div>
		<div class="g-m-tb-15" style="fontWeight: 700; fontSize: 14px; text-align: center">
			{{ info.paper_theme }}
		</div>
		<div class="g-flex g-jc-sb g-ai-c">
			<i class="icon iconfont icon-prev _left" @click="() => handlePrev(index !== 0)"/>
			<div style="width: 300px">
				<p>
					<span class="g-m-r-10">{{ index + 1 }}.</span>
					{{ currentPaper.title }}
				</p>
				<i-radio-group
					v-if="currentPaper.option && currentPaper.option.length"
					class="g-m-t-10"
					vertical
				>
					<i-radio
						v-for="(item, i) of currentPaper.option"
						:key="i"
						disabled
					>{{ item.option_name }}</i-radio>
				</i-radio-group>
			</div>
			<i class="icon iconfont icon-next _right" @click="() => handleNext(index !== info.questions.length - 1)"/>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Radio, RadioGroup } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';
import OaUpload from '@components/_common/upload/upload';
import TextArea from '@components/_common/limit-words/limit-words';

export default {
	name: 'hr-look',
	components: {
		'i-modal': Modal,
		'i-radio-group': RadioGroup,
		'i-radio': Radio
	},
	props: {
		paper_id: Number
	},
	data() {
		return {
			visible: false,
			index: 0,
			info: {
				questions: []
			},
			currentPaper: {}
		};
	},
	watch: {
		index(val) {
			this.currentPaper = this.info.questions[val];
		}
	},
	mounted() {
		this.visible = true;
		this.loadInfo();
	},
	methods: {
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handlePrev(auth) {
			if (auth) {
				this.index -= 1;
			}
		},
		handleNext(auth) {
			if (auth) {
				this.index += 1;
			}
		},
		loadInfo() {
			this.$request({
				url: '_HR_RECRUIT_PAPER_LIST_DETAIL_GET',
				type: 'POST',
				loading: false,
				param: {
					paper_id: this.paper_id
				}
			}).then(res => {
				this.info = res.data;
				this.currentPaper = res.data.questions[0];
			}).catch(err => {
				this.$Message.error(err.msg);
			});
		}
	}
};
export const PaperModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.hr-integration-look {
	._left {
		font-size: 20px;
		cursor: pointer;
		color: #818794;
	}
	._right {
		font-size: 20px;
		cursor: pointer;
		color: #818794;
	}
	.ivu-form-item-label {
		color: #818794 !important;
	}
	.ivu-form-item-content {
		color: #4b4f57;
	}
	.ivu-form-item {
		margin-bottom: 10px !important;
	}
}
</style>