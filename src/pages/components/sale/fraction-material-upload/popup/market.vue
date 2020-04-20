<template>
	<div class="v-sale-material-upload-market">
		<i-form-item label="素材名称：" prop="tape_material_name">
			<i-input 
				v-model="formData.tape_material_name" 
				:maxlength="50"
				clearable
				placeholder="请输入提供人+内容板块+品牌商或同行名称"
				style="width: 300px"
			/>
		</i-form-item>
		<i-form-item label="内容简介：" prop="content_validity">
			<oa-limit-words 
				v-model="formData.content_validity"
				:max="200"
				clearable
				placeholder="请填写内容简介"
				style="width: 300px;margin-bottom: 20px;"
			/>
		</i-form-item>
		<i-form-item label="所属板块：" prop="belong_plate">
			<i-select 
				v-model="formData.belong_plate"
				placeholder="请选择所属板块"
				clearable
				transfer
				style="width: 300px"
			>
				<i-option 
					v-for="(item, index) in belong_plates" 
					:key="index" 
					:value="item.value"
				>
					{{ item.name }}
				</i-option>
			</i-select>
		</i-form-item>
	</div>
</template>

<script>
import { Button, Input, FormItem, Select, Option } from "iview";
import LimitWords from '@components/_common/limit-words/limit-words';
import * as Tools from "../tools";

export default {
	name: "oa-material-upload-market",
	components: {
		"i-button": Button,
		"i-input": Input,
		"i-form-item": FormItem,
		'i-select': Select,
		'i-option': Option,
		'oa-limit-words': LimitWords
	},
	props: {
		formData: Object,
		tapeData: Object
	},
	data() {
		return {
			loadTapeData: Tools.loadTapeData,
			belong_plates: [], // 所属板块
		};
	},
	mounted() {
		this.loadTapeData('belong_plate');
		if (this.tapeData) {
			for (let key in this.tapeData) {
				if (key in this.formData) {
					if (['belong_plate'].includes(key)) {
						this.formData[key] = +this.tapeData[key];
					} else {
						this.formData[key] = this.tapeData[key];
					}
				}
			}
		}
	}
};

export const FractionMaterialUploadMarket = module.exports.default;

</script>

<style lang="scss">

</style>

