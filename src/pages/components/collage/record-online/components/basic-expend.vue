<template>
	<div class="c-collage-detail-expend">
		<div class="_header" @click="handleToggle">
			<i 
				:class="[detailData.show ? 'icon-triangle-down' : 'icon-triangle-up']"
				class="icon iconfont g-fs-12"
				style="vetical-align: middle"
			/>
			<span class="g-c-black2 g-fs-14">
				{{ detailData.staff_name }}（{{ ROLE_ENUM[detailData.role_type] }}）
			</span>

			<span class="g-fr g-fs-12">
				<span :style="{ color: STATUS[detailData.record_status].color }">
					{{ STATUS[detailData.record_status].label }}
				</span>

				<span 
					v-if="showEdit || showSubmit"
					class="g-pd-l-15 g-c-blue-mid"
				>
					<span 
						v-if="showEdit" 
						@click.stop="handleEdit"
					>
						编辑
					</span>
					<span 
						v-if="showSubmit" 
						@click.stop="handleSubmit"
					>
						提交
					</span>
				</span>

				<!-- <span 
					v-if="canAudit"
					class="__audit g-m-l-10 g-red-btn-line" 
					style="margin-right: -20px"
					@click.stop="handleAudit"
				>
					审核
				</span> -->
			</span>
		</div>
		<vc-expand 
			ref="expand"
			v-model="detailData.show"
		>
			<slot/>
		</vc-expand>
	</div>
</template>

<script>
import { Button } from 'iview';
import { Expand } from "wya-vc";
import API_ROOT from '@stores/apis/root';
import { STATUS, ROLE_ENUM } from './constants';

export default {
	components: {
		"vc-expand": Expand,
		'i-button': Button
	},
	model: {
		event: 'change',
		prop: 'isEdit'
	},
	props: {
		detailData: {
			type: Object,
			// required: true,
			default() {
				return {
					show: true,
					isEdit: false,
					record_status: 1,
				};
			}
		},
		isEdit: {
			type: Boolean,
			required: true
		},
		handleSubmit: {
			type: Function,
			default: () => () => {}
		},
		// handleAudit: {
		// 	type: Function,
		// 	default: () => () => {}
		// },
		type: {
			type: Number,
			required: true
		}
	},
	data() {
		return {
			STATUS,
			ROLE_ENUM
		};
	},
	computed: {
		// 判断是否有权限审核
		// 流程对接人 不需要审核 直接通过
		canAudit() {
			return this.type == 3
				&& this.detailData.auth_type < 3
				&& this.detailData.record_status != 3;
		},
		showEdit() {
			// 权限区分线上（1403）线下（1406）
			return !this.isEdit
				&& this.detailData.record_status != 1
				&& (this.$auth[this.detailData.lesson_type == 1 ? 1403 : 1406])
				&& this.detailData.is_edit
				&& this.detailData.lesson_status == 0
				&& !this.canAudit;
		},
		showSubmit() {
			return (this.isEdit || this.detailData.record_status == 1)
				&& (this.$auth[this.detailData.lesson_type == 1 ? 1403 : 1406])
				&& (this.detailData.auth_type < 3 || this.detailData.is_edit)
				&& this.detailData.lesson_status == 0;
		}
	},
	methods: {
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleEdit() {
			this.$emit('change', true);
			!this.detailData.show && this.handleToggle();
		}
	}
};
</script>

<style lang="scss">
.c-collage-detail-expend {
    position: relative;
    width: 850px;
    background: rgba(250,250,250,1);
    border-radius: 4px 4px 0px 0px;
    &::before {
        content: '';
        width: 0;
        height: 0;
        border-top: 20px solid rgb(255, 83, 97);
        border-right: 20px solid #fafafa;
        border-top-left-radius: 4px;
        position: absolute;
        top: 0px;
        left: 0px
    }
    ._header {
        height: 50px;
        line-height: 50px;
        padding-left: 20px;
        padding-right: 20px;
        cursor: pointer;
        border-bottom: 1px solid #EBEEF1;
    }
    .__audit {
        width: 60px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        margin-top: 10px;
    }
}
</style>
