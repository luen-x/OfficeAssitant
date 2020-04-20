<template>
	<div class="v-assess-statistics-item">
		<div class="_title">
			<span class="_spot" />
			<span>{{ name }}</span>
		</div>
		<div v-for="(item, index) of formdata[infoKey]" :key="index">
			<div class="g-flex">
				<i-formitem 
					:prop="`${infoKey}.${index}.cate_name`" 
					:rules="validator.cate_name"
					class="g-m-t-20" 
					label="类别">
					<i-input 
						v-model="item.cate_name"
						:maxlength="5"
						placeholder="请输入类别"
						style="width: 270px"
					/>
				</i-formitem>
				<i 
					v-if="index > 0"
					class="icon iconfont icon-remove-circle g-m-lr-10" 
					style="font-size: 16px; color: #E74854; margin-top: 25px;"
					@click="() => handleDel(index)"
				/>
			</div>
			<div class="g-bg-gray-mid" style="padding: 20px 80px 20px 40px;">
				<div v-for="(ques, i) of item.question_arr" :key="i">
					<div class="g-flex">
						<i-formitem 
							:label="`问题${i + 1}`" 
							:prop="`${infoKey}.${index}.question_arr.${i}.question_name`"
							:rules="validator.question_name"
						>
							<i-input 
								v-model="ques.question_name"
								:maxlength="20"
								placeholder="请输入问题名称"
								style="width: 270px"
							/>
						</i-formitem>
						<i-formitem 
							:prop="`${infoKey}.${index}.question_arr.${i}.key_word`"	
							:rules="validator.key_word"							
							label="关键词"
						>
							<i-input 
								v-model="ques.key_word"
								:maxlength="5"
								placeholder="请输入问题关键词"
								style="width: 270px"
							/>
						</i-formitem>
						<i 
							v-if="i > 2"
							class="icon iconfont icon-remove-circle g-m-t-5 g-m-lr-10" 
							style="font-size: 16px; color: #E74854"
							@click="() => handleItemDel(index, i)"
						/>
						<i 
							v-if="i === item.question_arr.length - 1"
							class="icon iconfont icon-add1 g-m-t-5 g-m-l-10" 
							style="font-size: 16px; color: #2296f9"
							@click="() => handleItemAdd(index, i)"
						/>
					</div>
					<i-formitem
						:prop="`${infoKey}.${index}.question_arr.${i}.value`"
					>
						<i-radio-group 
							v-model="ques.value"
							style="margin-bottom: 10px" 
							vertical>
							<i-radio label="1">
								<span>很好</span>
							</i-radio>
							<i-radio label="2">
								<span>一般</span>
							</i-radio>
							<i-radio label="3">
								<span>很差</span>
							</i-radio>
							<i-radio label="4">
								<span>特差</span>
							</i-radio>
						</i-radio-group>
					</i-formitem>
				</div>
			</div>
		</div>
		<i-button type="primary" class="g-m-t-20" @click="handleAdd">添加类别</i-button>

	</div>
</template>

<script>
import { Form, FormItem, Input, Radio, RadioGroup, Button } from 'iview';

export default {
	name: 'oa-assess-statistics-item',
	components: {
		'i-form': Form,
		'i-formitem': FormItem,
		'i-input': Input,
		'i-radio': Radio,
		'i-radio-group': RadioGroup,
		'i-button': Button
	},
	props: {
		name: String,
		dataInfo: Object,
		infoKey: String
	},
	data() {
		return {
			formdata: this.dataInfo,
			validator: {
				cate_name: [
					{ required: true, message: '请输入类别名称', trigger: 'blur' }
				],
				question_name: [
					{ required: true, message: '请输入问题名称', trigger: 'blur' }					
				],
				key_word: [
					{ required: true, message: '请输入问题关键词', trigger: 'blur' }										
				],
			}
		};
	},
	watch: {
		dataInfo(val) {
			this.formdata = val;
		}
	},
	methods: {
		handleAdd() {
			this.formdata[this.infoKey].push({ question_arr: [{}, {}, {}] });
		},
		handleDel(index) {
			this.formdata[this.infoKey].splice(index, 1);
		},
		handleItemDel(index, i) {
			this.formdata[this.infoKey][index].question_arr.splice(i, 1);
		},
		handleItemAdd(index, i) {
			this.formdata[this.infoKey][index].question_arr.push({});
		},
	}
};
</script>

<style lang="scss" scoped>
.v-assess-statistics-item {
	& > ._title {
		color: #E74854;
		display: flex;
		align-items: center;
		font-size: 16px;

		& > ._spot {
			display: inline-block;
			width: 2px;
			height: 18px;
			margin-right: 5px;
			background: #E74854;
			
		}
	}
}
</style>


