<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="添加课题"
		width="400"
		@on-ok="handleSave"
		@on-cancel="handleCancel"
	>
		<i-form
			ref="form"
			:model="formData"
			:rules="rules"
			:label-width="90"
			class="g-pd-l-10"
		>
			<i-form-item label="课题名称:" prop="subject_id">
				<i-cascader
					v-model="formData.subject_id"
					:data="subjectTree"
					clearable
					class="g-m-r-5"
					placeholder="请选择课题"
					style="width: 220px"
				/>
			</i-form-item>
		</i-form>
	</i-modal>
</template>

<script>
import { Modal, Icon, Input, Form, FormItem, RadioGroup, Radio, Button, Poptip, Select, Option, Cascader } from 'iview';
import Explain from '@components/_common/explain/explain';
import { CreatePortal } from 'wya-vc';
import { dataValidity, objRegex } from '@utils/utils';
import API from '@stores/apis/root';
import { services } from '@stores/services/hr';
import { debounce } from 'lodash';

export default {
	name: "oa-sale-add-conatct",
	components: {
		'i-modal': Modal,
		'i-icon': Icon,
		'i-input': Input,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
		'i-button': Button,
		'i-poptip': Poptip,
		'oa-explain': Explain,
		'i-select': Select,
		'i-option': Option,
		'i-cascader': Cascader
	},
	mixins: [services.subjectTree()],
	props: {
		questionIds: Array,

	},
	data() {

		return {
			visible: false,
			searchLoading: false,
			formData: {
				subject_id: []
			},
			rules: {
				subject_id: [{ required: true, type: 'array', message: '请选择课题', trigger: "change" }]
			}
		};
	},
	created() {

	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		handleSave: debounce(function () {
			this.$refs.modal.buttonLoading = true;
			this.$refs.form.validate(valid => {
				if (!valid) return this.$refs.modal.buttonLoading = false;
				this.$request({
					url: "_HR_ACADEMY_COURSE_QUESTION_AUDIT_RELA_SUB_POST",
					type: "POST",
					param: {
						question_id: this.questionIds,
						subject_id: this.formData.subject_id[this.formData.subject_id.length - 1]
					},
					loading: false,
				}).then(res => {
					this.handleOk();
				}).catch((res) => {
					this.$Message.error(res.msg);
				}).finally(() => {
					this.$refs.modal.buttonLoading = false;
				});
			});
		}, 200)
	}
};
export const SetSubject = CreatePortal({}, module.exports.default);
</script>
<style lang="scss" scoped>
</style>

