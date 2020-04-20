<template>
	<i-modal
		v-model="visible"
		:mask-closable="false"
		title="查看"
		class-name="v-content-config-material-check-check"
		width="680"
		@on-ok="handleOk"
		@on-cancel="handleCancel"
	>
		<div class="g-fs-16" style="margin-left:90px">
			<div class="g-c-red-mid g-m-b-20">
				<label>驳回理由:</label>
				<span>{{ material.audit_remark }}</span>
			</div>
			<oa-fileicon v-if="material.file_url" :file-url="material.file_url"/>
			{{ material.material_name }}</div>

		<!-- 咨询服务录音 -->
		<div v-if="material.material_use==6" class="_content g-m-t-20">
			<div >
				<label>素材用途:</label>
				<span>{{ material.material_use_name }}</span>
			</div>
			<div>
				<label>素材提供人:</label>
				<span v-for="(item,index) in material.provider_list" :key="index" >{{ item.staff_name }}</span>
			</div>
			<div>
				<label>备注:</label>
				<span>{{ material.describe }}</span>
			</div>
			<div>
				<label>素材名称:</label>
				<span>{{ tape.tape_material_name }}</span>
			</div>
			<div>
				<label>录音日期:</label>
				<span>{{ tape.tape_date }}</span>
			</div>
			<div>
				<label>客户信息:</label>
				<span>{{ tape.customer_info }}</span>
			</div>
			<div>
				<label>主述人:</label>
				<span>{{ tape.chief_prosecutor }}</span>
			</div>
			<div>
				<label>客户公司类型:</label>
				<span>{{ tape.company_type_name }}</span>
			</div>
			<div>
				<label>咨询信息:</label>
				<span>{{ tape.advisory_information }}</span>
			</div>
			<div>
				<label>预约目的:</label>
				<span>{{ tape.reservation_purpose }}</span>
			</div>
			<div>
				<label>客户所处阶段:</label>
				<span>{{ tape.customer_stage }}</span>
			</div>
		</div>
		<!-- 谈判录音 -->
		<div v-else-if="material.material_use==4" class="_content g-m-t-20">
			<div >
				<label>素材用途:</label>
				<span>{{ material.material_use_name }}</span>
			</div>
			<div>
				<label>素材提供人:</label>
				<span v-for="(item,index) in material.provider_list" :key="index" >{{ item.staff_name }}</span>
			</div>
			<div>
				<label>素材简介:</label>
				<span>{{ material.describe }}</span>
			</div>


			<div>
				<label>素材名称:</label>
				<span>{{ tape.tape_material_name }}</span>
			</div>
			<div>
				<label>录音日期:</label>
				<span>{{ tape.tape_date }}</span>
			</div>
			<div>
				<label>录音者:</label>
				<span>{{ tape.tape_person }}</span>
			</div>
			<div>
				<label>客户信息:</label>
				<span>{{ tape.customer_info }}</span>
			</div>

			<div>
				<label>客户基本情况:</label>
				<span>{{ tape.tape_material_name }}</span>
			</div>


			<div>
				<label>客户产品:</label>
				<span>{{ tape.customer_product }}</span>
			</div>
			<div>
				<label>谈判手:</label>
				<span>{{ tape.negotiator }}</span>
			</div>
			<div>
				<label>沟通地点:</label>
				<span>{{ tape.communicate_place }}</span>
			</div>
			<div>
				<label>沟通结果:</label>
				<span>{{ tape.communicate_result }}</span>
			</div>
			<div>
				<label>业务流程:</label>
				<span>{{ tape.operation_flow }}</span>
			</div>
			<div>
				<label>沟通前客户存在问题:</label>
				<span>{{ tape.customer_problem }}</span>
			</div>
			<div>
				<label>面谈前同事做了什么:</label>
				<span>{{ tape.colleague_do }}</span>
			</div>
		</div>
		<!-- 内训录音 -->
		<div v-else-if="material.material_use==5" class="_content g-m-t-20">
			<div >
				<label>素材用途:</label>
				<span>{{ material.material_use_name }}</span>
			</div>
			<div>
				<label>素材提供人:</label>
				<span v-for="(item,index) in material.provider_list" :key="index" >{{ item.staff_name }}</span>
			</div>
			<div>
				<label>素材简介:</label>
				<span>{{ material.describe }}</span>
			</div>


			<div>
				<label>素材名称:</label>
				<span>{{ tape.tape_material_name }}</span>
			</div>
			<div>
				<label>录音日期:</label>
				<span>{{ tape.tape_date }}</span>
			</div>
			<div>
				<label>录音者:</label>
				<span>{{ tape.tape_person }}</span>
			</div>
			<div>
				<label>主述人:</label>
				<span>{{ tape.chief_prosecutor }}</span>
			</div>
			<div>
				<label>培训主题:</label>
				<span>{{ tape.train_theme }}</span>
			</div>
			<div>
				<label>培训大纲:</label>
				<span>{{ tape.train_program }}</span>
			</div>
			<div>
				<label>培训对象:</label>
				<span>{{ tape.train_object }}</span>
			</div>
		</div>
		<!-- 市场支持服务中心 -->
		<div v-else-if="material.material_use==7" class="_content g-m-t-20">
			<div >
				<label>素材用途:</label>
				<span>{{ material.material_use_name }}</span>
			</div>
			<div>
				<label>素材提供人:</label>
				<span v-for="(item,index) in material.provider_list" :key="index" >{{ item.staff_name }}</span>
			</div>
			<div>
				<label>素材简介:</label>
				<span>{{ material.describe }}</span>
			</div>
			<div>
				<label>素材名称:</label>
				<span>{{ tape.tape_material_name }}</span>
			</div>
			<div>
				<label>内容简介:</label>
				<span>{{ tape.content_validity }}</span>
			</div>
			<div>
				<label>所属板块:</label>
				<span>{{ tape.belong_plate_name }}</span>
			</div>
		</div>
		<!-- 其他 -->
		<div v-else class="_content g-m-t-20">
			<div >
				<label>素材用途:</label>
				<span>{{ material.material_use_name }}</span>
			</div>
			<div>
				<label>素材提供人:</label>
				<span v-for="(item,index) in material.provider_list" :key="index" >{{ item.staff_name }}</span>
			</div>
			<div>
				<label>素材简介:</label>
				<span>{{ material.describe }}</span>
			</div>
		</div>
		<div slot="footer">
			<i-button v-if="0" class="g-m-r-10" type="text" @click="handleCancel()">取消</i-button>
			<i-button type="primary" @click="handleOk()">确定</i-button>
		</div>
	</i-modal>
</template>
<script>
import { Modal, Form, FormItem, Input, DatePicker,
	Select, Option, Button, Cascader, InputNumber,
	RadioGroup, Radio, CheckboxGroup, Checkbox } from 'iview';
import { CreatePortal } from 'wya-vc';
import fileicon from '@components/_common/file-icon/file-icon';
import { services } from "@stores/services/sale";
import API from "@stores/apis/root";

export default {
	name: "v-add-stuff",
	components: {
		"i-modal": Modal,
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-checkbox-group": CheckboxGroup,
		"i-checkbox": Checkbox,
		'i-cascader': Cascader,
		'i-select': Select,
		'i-option': Option,
		"i-button": Button,
		'i-date-picker': DatePicker,
		'oa-fileicon': fileicon
	},
	mixins: [
		services.departMy()
	],
	props: {
		data: Object
	},
	data() {
		return {
			visible: false,
			material: {

			},
			tape: {

			},

		};
	},
	computed: {
	},
	created() {
		if (this.data.material_id) {
			this.loadData(this.data.material_id);
		}
	},
	mounted() {
		this.visible = true;
	},
	methods: {

		loadData(id) {
			this.$request({
				url: API._CONTENT_CONFIG_MATERIAL_CHECK_TAPE_DETAIL_GET,
				type: "get",
				param: {
					material_id: id
				}
			}).then(res => {
				this.material = res.data.material;
				this.tape = res.data.tape;
			});
		},
		handleOk() {
			/**
             * v-model会默认被触发，要由该组件控制，给组件i-modal传值 loading: true
             */
			this.visible = false;
			this.$emit('sure');
		},
		handleCancel() {
			this.visible = false;
			this.$emit('close');
		},
	}
};
export const Check = CreatePortal({}, module.exports.default);
</script>
<style lang="scss">
    .v-content-config-material-check-check {
        ._content {
			margin-left:60px;
            label {
                width: 80px;
				text-align: right;
				margin-right:10px ;
				margin-bottom: 20px;
				display: inline-block;
            }
        }
    }
</style>
