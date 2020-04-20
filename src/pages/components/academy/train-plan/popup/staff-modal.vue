<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			title="参与人员"
			class="v-academy-train-plan-staff-modal"
			@on-ok="handleOk"
			@on-cancel="handleCancel"
		>
			<div>
				<div v-for="(item, index) in staff" :key="index" class="_staff">{{ item }}</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Form, FormItem, Message, Radio, RadioGroup } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';
import { PreModal } from '../../support-course/popup/pre-modal';

export default {
	name: 'v-academy-train-plan-staff-modal',
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
		'i-radio-group': RadioGroup,
		'i-radio': Radio,
	},
	props: {
		staff: {
			type: Array,
			default: () => {}
		},
	},
	data() {
		return {
			visible: false,
		};
	},
	watch: {
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.visible = false;
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const StaffModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-academy-train-plan-staff-modal {
    ._staff {
        display: inline-block;
        background-color: #e84c57;
        color: #fff;
        padding: 3px 5px 3px 5px;
        margin: 10px;
        border-radius: 3px;
    }
}
</style>