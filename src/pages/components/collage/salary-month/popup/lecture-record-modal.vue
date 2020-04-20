<template>
	<div>
		<i-modal
			ref="modal"
			:loading="true"
			v-model="visible"
			:width="680"
			:mask-closable="false"
			:footer-hide="true"
			title="查看详情"
			class="v-collage-salary-month-lecture-record-modal"
		>
			<div class="_wrapper">
				<div class="g-fs-14 g-c-black2 g-m-b-30 g-m-l-20">浙江微一案信息科技有限公司</div>
				<i-form>
					<div>
						<div class="__item">
							<span class="__label">课程主题：</span>
							<span>财富机制逻辑推演</span>
						</div>
						<div class="__item">
							<span class="__label">讲课时间：</span>
							<span>2018-02-25 22:25:30</span>
						</div>
					</div>
					<div class="__item">
						<span class="__label">套系名称：</span>
						<span>新兵</span>
					</div>
					<div class="__item">
						<span class="__label">课时数：</span>
						<span>2节</span>
					</div>
					<div class="__item">
						<span class="__label">课程类型：</span>
						<span>内巡回</span>
					</div>
					<div class="__item">
						<span class="__label">业绩金额：</span>
						<span>25152</span>
					</div>
					<div class="__item">
						<span class="__label">讲课时长：</span>
						<span>25</span>
					</div>
					<div class="__item">
						<span class="__label">课时费：</span>
						<span>252</span>
					</div>
					<div class="__item">
						<span class="__label">补贴金额：</span>
						<i-tooltip 
							class="g-pointer g-c-blue-mid"
							placement="top"
							theme="light"
							content="我给你破败郊区的月亮：25252"
						>
							252
						</i-tooltip>
					</div>
				</i-form>
			</div>
		</i-modal>
	</div>
</template>

<script>
import lodash from 'lodash';
import { Modal, Message, Select, Option, Button, Tooltip } from 'iview';
import API_ROOT from '@stores/apis/root';
import { services as commonServices } from '@stores/services/common';
import AutoToolTip from "@components/_common/auto-tooltip/auto-tooltip";
import { CreatePortal } from 'wya-vc';
import { dataValidity } from '@utils/utils';
import moment from 'moment';

export default {
	name: 'v-collage-salary-month-lecture-record-modal',
	components: {
		'i-modal': Modal,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button,
		'i-tooltip': Tooltip
	},
	mixins: [
	],
	props: {
		quality_id: Array
	},
	data() {
		return {
			visible: false
		};
	},
	mounted() {
		this.visible = true;
		// this.loadData();
	},
	methods: {
		// 初始化数据
		async loadData() {
			return this.$request({
				url: '_COLLAGE_CHECK_SERVICE_ALLOCATE_LIST_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				
			}).catch((error) => {
			});
		},
	}
};
export const LectureRecordModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-collage-salary-month-lecture-record-modal {
    ._wrapper {
        padding: 20px 20px 40px 40px;
        .__item {
            display: inline-block;
            width: 281px;
            margin-bottom: 20px;
            .__label {
                display: inline-block;
                width: 80px;
                text-align: right;
            }
        }
    }
}
</style>


