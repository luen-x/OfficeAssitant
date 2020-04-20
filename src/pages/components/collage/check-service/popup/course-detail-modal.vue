<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="400"
			:mask-closable="false"
			:footer-hide="true"
			title="课程详情"
			class="v-collage-check-service-course-detail-modal"
		>
			<div v-for="(item, index) in data" :key="index" class="g-pd-t-20 g-pd-lr-20 g-m-b-30">
				<div class="g-m-b-20">
					<span>课程主题：</span>
					<span>{{ item.subject_name }}</span>
				</div>
				<div class="g-m-b-30">
					<span>讲课时间：</span>
					<span v-if="Array.isArray(item.lecture_time)">{{ item.lecture_time[0] }} ~ {{ item.lecture_time[1] }}</span>
					<span v-else>{{ item.lecture_time }}</span>
				</div>
			</div>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Message, Select, Option, Button } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'sc-service-start-modal',
	components: {
		'i-modal': Modal,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button
	},
	mixins: [
	],
	props: {
		data: Array
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
		
	}
};
export const CourseDetailModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-check-service-allocate-modal {
}
</style>


