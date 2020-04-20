<template>
	<div>
		<i-modal
			ref="modal"
			v-model="visible"
			:loading="true"
			:width="680"
			:mask-closable="false"
			class="v-hr-assess-integration-rules"
		>
			<div slot="header" class="g-tc">
				{{ isEdit ? '编辑规则' : '新增规则' }}
			</div>
			<i-radio-group 
				v-if="step === 1"
				v-model="ruleId">
				<i-radio 
					v-for="(item, index) of options"
					:key="index"
					:label="item.value"
					class="g-m-t-20 g-flex"
				>
					<span>
						<span style="width: 120px; display: inline-block;" >{{ item.label }}</span> 
					</span>
					<span style="color:#818794">{{ item.plain }}</span>
				</i-radio>
			</i-radio-group>
			<oa-rule-form 
				v-else 
				ref="ruleForm"
				:info="data"
				:type="type"
				:id="ruleId" />
			<div slot="footer">
				<i-button 
					type="text" 
					@click="handleCancel"
				>
					取消
				</i-button>
				<i-button
					v-if="step === 1" 
					type="primary" 
					@click="handleNext"
				>
					下一步
				</i-button>
				<i-button 
					v-else
					type="primary" 
					@click="handleOk"
				>
					确定
				</i-button>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, RadioGroup, Radio, Button } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { integrationOptions } from './integration-options';
import { creditOptions } from './credit-options';
import RuleForm from './rules-form';

export default {
	name: 'hr-system-integration-rules',
	components: {
		'i-modal': Modal,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'oa-rule-form': RuleForm
	},
	props: {
		type: String,
		info: Object,
		isEdit: Boolean,
		type_id: Number
	},
	data() {
		const { query } = this.$route;
		return {
			query,
			visible: false,
			options: this.type === '1' ? integrationOptions : creditOptions,
			step: this.isEdit ? 2 : 1,
			ruleId: this.info.rule_type + '' || '',
			data: cloneDeep(this.info)
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$refs.ruleForm.$refs.form.validateAndScroll(item => {
				const formdata = this.$refs.ruleForm.formdata;
				let form = {};
				let rule = [];
				Object.keys(formdata).forEach(info => {
					if (formdata[info] !== null) {
						form[info] = formdata[info];
					}
				});
				form.rules = formdata.rules.map(info => {
					let obj = {};
					Object.keys(info).forEach(mess => {
						if (info[mess] !== null) {
							obj[mess] = info[mess];
						}
						if (info.performance_to === '不限') {
							obj.performance_to = -1;
						}
					});
					return obj;
				});
				if (item) {
					this.$request({
						url: '_HR_SYSTEM_ASSESS_CREDITINTE_RULES_SAVE_POST',
						type: 'POST',
						param: {
							...this.query,
							...form,
							cate: this.type,
							type_id: this.type_id,
							rule_type: this.ruleId,
							rule_info_id: this.info.rule_info_id,
							start_month: formdata.start_month && moment(formdata.start_month).format('YYYY-MM')
						},
					}).then(res => {
						this.$Message.success(res.msg);
						this.$emit('sure');
					}).catch(err => {
						this.$Message.error(err.msg);
					});
				}
			});
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleNext() {
			if (this.ruleId === "") {
				this.$Message.error('请先选择一个条件项');
				return;
			}
			this.step = 2;
		}
	}
};
export const RulesModal = CreatePortal({ }, module.exports.default);
</script>

<style lang="scss">
.v-hr-assess-integration-rules {
	.ivu-radio {
		margin-top: 2px;
	}
	.ivu-modal-body {
		overflow: auto;
		max-height: 480px;
	}
	.ivu-radio-wrapper {
		white-space: normal;
		display: flex;
	}
}
</style>


