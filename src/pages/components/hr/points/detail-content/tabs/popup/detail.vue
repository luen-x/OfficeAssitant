<template>
	<div>
		<i-modal
			v-model="visible"
			:width="400"
			:mask-closable="false"
			class="hr-points-detail-modal"
		>
			<div slot="header" class="g-tc">
				查看详情
			</div>
			<div class="_content  g-c-black2">
				<p class="__title g-fs-16 g-c-black2">项目跟进</p>
				<i-row v-if="Number(datas.return_amount) > 0" class="g-m-b-20">
					<i-col span="5" class="g-tr">回款金额：</i-col>
					<i-col span="19">{{ datas.return_amount }}万元</i-col>
				</i-row>
				<i-row v-if="Number(datas.agent_num) > 0" class="g-m-b-20">
					<i-col span="5" class="g-tr">代理人数：</i-col>
					<i-col span="19">{{ datas.agent_num }}人</i-col>
				</i-row>
				<i-row class="g-m-b-20">
					<i-col span="5" class="g-tr">备注：</i-col>
					<i-col span="19" style="word-break:break-all">{{ datas.remarks }}</i-col>
				</i-row>
				<i-row v-if="datas.fileImage.length" class="g-m-b-20">
					<i-col span="5" class="g-tr">凭证：</i-col>
					<i-col span="19">
						<v-imgs-preview :data-source="datas.fileImage"/>
					</i-col>
				</i-row>
				<i-row class="g-m-b-20">
					<i-col span="5" class="g-tr">确认备注：</i-col>
					<i-col span="19" style="word-break:break-all">{{ datas.mark }}</i-col>
				</i-row>
				<!-- <i-row class="g-m-b-20">
					<i-col span="5" class="g-tr">积分：</i-col>
					<i-col span="19">1000</i-col>
				</i-row> -->
			</div>
		</i-modal>
	</div>
</template>

<script>
import { Modal, Row, Col } from 'iview';
import { CreatePortal, ImgsPreview } from 'wya-vc';

export default {
	name: 'hr-points-detail-modal',
	components: {
		'i-modal': Modal,
		'i-row': Row,
		'i-col': Col,
		'v-imgs-preview': ImgsPreview
	},
	props: {
		name: String,
		datas: {
			type: Object,
			default: () => {}
		}
	},
	data() {
		return {
			visible: false,
			dataSource: [],
			formdata: {}
		};
	},
	mounted() {
		this.visible = true;
	},
	methods: {
		handleOk() {
			this.$emit('sure');
		},
		handleCancel() {
			this.$emit('close');
		}
	}
};
export const DetailModal = CreatePortal({}, module.exports.default);
</script>

<style lang="scss" scoped>
.hr-points-detail-modal {
    ._content {
		position: relative;
        padding: 0 30px 0 30px;
		.__text {
			word-wrap: break-word;
		}
		.__grey {
			color: #818794;
			border-bottom: 1px solid #d4d9da;
		}
		.__title {
			margin: 0 0 20px 6px;
			font-weight: bold;
		}
    }
}
</style>


