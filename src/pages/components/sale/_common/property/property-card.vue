<template>
	<i-modal
		ref="modal"
		v-model="visible"
		:loading="true"
		:mask-closable="false"
		title="道具介绍"
		width="400"
		class="v-property-card"
		footer-hide
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div :style="`background: url(${imageSrc});height: 100%;width: 100%;`" class="_wrapper">
			<div class="g-fs-20 g-pd-t-30" style="color: #fff">
				一 {{ prop_name }} 一
			</div>
			<div class="g-fs-16" style="color: #fff; margin-top: 220px;">功效：{{ title }}</div>
			<div v-if="tip" class="g-c-white g-m-t-20">{{ tip }}</div>
			<div 
				:style="{color: textColor}" 
				class="__wrapper-button g-pointer"
				@click="handleOk"
			>
				确认使用
			</div>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Form, FormItem } from 'iview';
import { CreatePortal } from 'wya-vc';
import { OSS_PROP_BG_M01, OSS_PROP_BG_M02, OSS_PROP_BG_M03, OSS_PROP_BG_M04,
	OSS_PROP_BG_M05, OSS_PROP_BG_M06, OSS_PROP_BG_M07 } from '@constants/constants';


export default {
	name: "v-property-card",
	components: {
		'i-modal': Modal,
		'i-form': Form,
		'i-form-item': FormItem,
	},
	props: {
		typeId: Number,
		tip: String
		// datas: {
		// 	type: Object,
		// 	default: () => ({})
		// },
	},
	data() {
		return {
			visible: false,
			prop_name: '',
			title: '',
			propData: {
				1: {
					image: OSS_PROP_BG_M01,
					color: '#FD7452'
				}, // 每日领取客户券
				2: {
					image: OSS_PROP_BG_M03,
					color: '#2460DA'
				}, // 一次性普通客户保护券
				3: {
					image: OSS_PROP_BG_M07,
					color: '#F21E1E'
				}, // 一次性重要客户保护券
				4: {
					image: OSS_PROP_BG_M02,
					color: '#FD5252'
				}, // 120天普通客户名额券
				5: {
					image: OSS_PROP_BG_M06,
					color: '#5155D4'
				}, // 120天重要客户名额券
				6: {
					image: OSS_PROP_BG_M04,
					color: '#00BFA5'
				}, // 保护期延长盾牌
				7: {
					image: OSS_PROP_BG_M05,
					color: '#B654D6'
				}, // 抢资料优先令牌
			},
		};
	},
	computed: {
		imageSrc() {
			return this.propData[this.typeId].image;
		},
		textColor() {
			return this.propData[this.typeId].color;
		}
	},
	created() {
		this.loadData();
	},
	mounted() {
		this.visible = true;

	},
	methods: {
		loadData() {
			this.$request({
				url: "_SALE_PROPERTY_CENTER_PROPERTY_DETAIL_GET",
				type: 'GET',
				param: {
					type_id: this.typeId
				},
				loading: false
			}).then((res) => {
				this.prop_name = res.data.prop_name;
				this.title = res.data.title;
			});
		},
		handleOk(res) {
			this.visible = false;
			this.$emit('sure', res);
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const PropertyCard = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
.v-property-card {
    .ivu-modal-close .ivu-icon-ios-close {
        font-size: 42px;
        color: #fff;
    }
    .ivu-modal-close .ivu-icon-ios-close:hover {
        color: #fff;
    }
    .ivu-modal-body {
        padding: 0;
        height: 500px;
        width: 400px;
    }
    .ivu-modal-content {
        border-radius: 26px;
    }
    .ivu-modal-header {
        display: none;
    }
    ._wrapper {
        position: relative;
        margin: 0 auto;
        text-align: center;
        border-radius: 16px;
        padding: 20px;
        .__wrapper-button {
            position: absolute;
            left: 50px;
            bottom: 50px;
            font-size: 16px;
            width: 300px;
            height: 48px;
            line-height: 48px;
            border-radius: 24px;
            background-color: #fff;
            color: #000;
        }
    }
}
</style>

