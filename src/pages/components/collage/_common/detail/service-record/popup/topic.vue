<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true" 
		:mask-closable="false"
		width="400px" 
		class="v-collage-service-record-topic"
	>
		<div slot="header" class="g-tc">
			<span>课程主题</span>
		</div>

		<i-form 
			:label-width="120"
			@submit.native.prevent
		>
			<div v-for="(item, index) in subject" :key="index">
				<i-form-item label="课程主题：">
					<span>{{ item.subject_name }}</span>
				</i-form-item>
				<i-form-item label="讲课时间：">
					<span v-if="lessonType === 1">{{ formatDate(item.lecture_time) }}</span>
					<span v-else>{{ formatDate(JSON.parse(item.lecture_time)).join(' - ') }}</span>
				</i-form-item>
			</div>
		</i-form>
		<div slot="footer"/>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import moment from 'moment';
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-service-record-topic",
	components: {
		'i-modal': Modal,
		'i-button': Button,
		'i-form': Form,
		'i-form-item': FormItem
	},
	mixins: [orderModal],
	props: {
		lessonType: [String, Number],
		subject: {
			type: Array,
			default: () => ({})
		}
	},
	data() {
		return {
			visible: false
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		/**
		 * 点击取消
		 */
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		},
		formatDate(date) {
			if (typeof date === 'object') {
				return [moment(date[0]).format('YYYY-MM-DD HH:mm'), moment(date[1]).format('YYYY-MM-DD HH:mm')];
			} else {
				return moment(date).format('YYYY-MM-DD HH:mm');
			}
		}
	}
};

export const ServiceRecordTopic = CreatePortal({}, module.exports.default);

</script>

<style lang="scss">
.v-collage-service-record-topic {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
	}
}
</style>

