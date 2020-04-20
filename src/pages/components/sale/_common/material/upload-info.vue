<template>
	<i-modal 
		ref="modal"
		v-model="visible" 
		:loading="true"
		:mask-closable="false" 
		width="680px" 
		class="v-sale-material-upload-info"
	>
		<div slot="header" class="g-tc">
			<span>{{ title }}</span>
		</div>

		<i-form :label-width="150">
			<i-form-item label="素材用途：">
				<span class="g-c-black3">
					{{ 
						['晋级视频','晋升视频','学分素材','谈判录音','内训录音','咨询服务录音','市场支持服务中心素材','其他'][+material_data.material_use - 1 ] || '--' 
					}}
				</span>
			</i-form-item>
			<i-form-item label="素材提供人：">
				<span 
					v-if="material_data.provider_list" 
					class="g-c-black3"
				>
					{{ material_data.provider_list.map(it => it.staff_name).join(' | ') || '--' }}
				</span>
			</i-form-item>
			<i-form-item label="素材简介：">
				<span class="g-c-black3">{{ material_data.describe || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="[4, 5, 6, 7].includes(material_data.material_use)" 
				label="素材名称："
			>
				<span class="g-c-black3">{{ tape_data.tape_material_name || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="[4, 5, 6].includes(material_data.material_use)"
				label="录音日期："
			>
				<span class="g-c-black3">{{ tape_data.tape_date || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="[4, 5, 6].includes(material_data.material_use)" 
				label="录音者："
			>
				<span class="g-c-black3">{{ tape_data.tape_person || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="[5, 6].includes(material_data.material_use)" 
				label="主述人："
			>
				<span class="g-c-black3">{{ tape_data.chief_prosecutor || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 5" 
				label="培训主题："
			>
				<span class="g-c-black3">{{ tape_data.train_theme || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 5" 
				label="培训大纲："
			>
				<span class="g-c-black3">{{ tape_data.train_program || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 5" 
				label="培训对象："
			>
				<span class="g-c-black3">{{ tape_data.train_object || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="[4, 6].includes(material_data.material_use)" 
				label="客户信息："
			>
				<span class="g-c-black3">{{ tape_data.customer_info || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 6" 
				label="客户公司类型："
			>
				<span class="g-c-black3">{{ ['传统企业','微商企业'][+tape_data.company_type - 1] || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="客户基本情况："
			>
				<span class="g-c-black3">{{ tape_data.base_situation_name || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="客户产品："
			>
				<span class="g-c-black3">{{ tape_data.customer_product || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="谈判手："
			>
				<span class="g-c-black3">{{ tape_data.negotiator || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="沟通地点："
			>
				<span class="g-c-black3">{{ tape_data.communicate_place || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="沟通结果："
			>
				<span class="g-c-black3">{{ tape_data.communicate_result || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="业务流程："
			>
				<span class="g-c-black3">{{ tape_data.operation_flow || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="沟通前客户存在问题："
			>
				<span class="g-c-black3">{{ tape_data.customer_problem || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 4" 
				label="面谈前同事做了什么："
			>
				<span class="g-c-black3">{{ tape_data.colleague_do || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 6" 
				label="咨询信息："
			>
				<span class="g-c-black3">{{ tape_data.advisory_information || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 6" 
				label="预约目的："
			>
				<span class="g-c-black3">{{ tape_data.reservation_purpose || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 6" 
				label="客户所处阶段："
			>
				<span class="g-c-black3">{{ tape_data.customer_stage || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 7" 
				label="内容简介："
			>
				<span class="g-c-black3">{{ tape_data.content_validity || '--' }}</span>
			</i-form-item>
			<i-form-item 
				v-if="material_data.material_use === 7" 
				label="所属板块："
			>
				<span class="g-c-black3">
					{{ tape_data.belong_plate_name || '--' }}
				</span>
			</i-form-item>
		</i-form>
		<div slot="footer">
			<i-button type="primary" @click="handleOk">确定</i-button>
		</div>
	</i-modal>
</template>

<script>
import { Modal, Button, Form, FormItem } from "iview";
import { CreatePortal } from "wya-vc";
import API_ROOT from "@stores/apis/root";
import orderModal from '@extends/mixins/orderModal';

export default {
	name: "oa-material-upload-info",
	components: {
		"i-modal": Modal,
		"i-button": Button,
		"i-form": Form,
		"i-form-item": FormItem
	},
	mixins: [orderModal],
	props: {
		title: String,
		materialId: [String, Number]
	},
	data() {
		return {
			visible: false,
			material_data: {},
			tape_data: {}
		};
	},
	mounted() {
		this.visible = true;
		this.loadData();
	},
	methods: {
		/**
		 * 初始化加载
		 */
		loadData() {
			this.loadMaterialData();
			this.loadTapeData();
		},
		/**
		 * 素材详情
		 */
		loadMaterialData() {
			this.$request({
				url: API_ROOT._SALE_LIBRARY_MATERIAL_DETAIL_GET,
				type: 'GET',
				loading: false,
				param: {
					material_id: this.materialId
				},
				autoTip: false
			}).then(res => {
				this.material_data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 录音表单详情
		 */
		loadTapeData() {
			this.$request({
				url: API_ROOT._SALE_LIBRARY_MATERIAL_TAPE_DETAIL_GET,
				type: 'GET',
				loading: false,
				param: {
					material_id: this.materialId
				},
				autoTip: false
			}).then(res => {
				this.tape_data = res.data;
			}).catch(error => {
				this.$Message.error(error.msg);
			});
		},
		/**
		 * 点击确定
		 */
		handleOk() {
			this.visible = false;
			this.$emit('sure');
		}
	}
};

export const FractionMaterialUploadInfo = CreatePortal({}, module.exports.default);
</script>

<style lang="scss">
.v-sale-material-upload-info {
	.ivu-modal-body {
		max-height: 386px;
		overflow-y: auto;
		padding: 16px 0;
	}
	.ivu-form-item {
		margin-bottom: 0!important;
	}
	.ivu-form .ivu-form-item-label {
		padding-right: 0;
		color: #818794;
	}
	.ivu-form-item-content {
		width: 75%;
		word-break: break-all;
		padding-top: 1px;
	}
}
</style>

