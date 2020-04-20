<template>
	<div>
		<oa-title title="身份信息" class="v-hr-resume-title g-m-l-30">
			<div class="g-m-l-20">
				<template v-if="edit">
					<span class="g-operation" @click="handleCancel">取消</span>
					<span class="g-operation g-m-l-10" @click="handleSave">保存</span>
				</template>
				<span v-else class="g-operation" @click="handleEdit">编辑</span>
			</div>
		</oa-title>
		<div class="g-flex-cc g-jc-sb g-ai-fs g-fw-w">
			<oa-form-item
				:edit="edit"
				:rules="rules.id_card"
				:content="old.id_card"
				label="身份证号:"
				prop="id_card">
				<i-input v-model="formValidate.id_card" :maxlength="18" style="width:300px" placeholder="请输入身份证号" />
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.nation_id"
				:content="old.nation_name"
				label="民族:"
				prop="nation_id"
				style="width:50%">
				<i-select v-model="formValidate.nation_id" clearable style="width:300px" placeholder="请选择民族">
					<i-option v-for="(item, index) in nations" :key="index" :value="item.value">
						{{ item.label }}
					</i-option>
				</i-select>
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.birthday_type"
				:content="old.birthday_type == '0' ? '公历' : '农历'"
				label="生日类型:"
				prop="birthday_type"
				style="width:50%">
				<i-radio-group v-model="formValidate.birthday_type">
					<i-radio label="0">公历</i-radio>
					<i-radio label="1">农历</i-radio>
				</i-radio-group>
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.birthday"
				:content="old.birthday"
				label="公历生日:"
				prop="birthday"
				style="width:50%">
				<i-date-picker
					v-model="formValidate.birthday"
					style="width:300px"
					type="date"
					format="yyyy-MM-dd"
					placeholder="请选择公历生日"
					@on-change="handleChange" />
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:content="old.constellation_name"
				label="星座:"
				style="width:50%">
				<i-input
					v-model="formValidate.constellation"
					:maxlength="20"
					disabled
					style="width:300px"
					placeholder="暂无星座信息" />
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.is_married"
				:content="old.is_married == '0' ? '未婚' : '已婚'"
				label="婚否:"
				prop="is_married"
				style="width:50%">
				<i-radio-group v-model="formValidate.is_married">
					<i-radio label="0">未婚</i-radio>
					<i-radio label="1">已婚</i-radio>
				</i-radio-group>
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.region"
				:content="old.native"
				label="籍贯:"
				prop="region"
				style="width:50%">
				<i-cascader
					v-model="formValidate.region"
					:data="region"
					style="width: 300px; display: inline-block"
					clearable
					transfer
					trigger="hover"
					change-on-select
					placeholder="请选择籍贯"
					@on-change="handleRegion" />
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.address"
				:content="old.address"
				label="户口地址:"
				prop="address"
				style="width:50%">
				<oa-limit-words v-model="formValidate.address" :max="50" style="width:300px" placeholder="请输入身份证上的地址" />
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.now_address"
				:content="old.now_address"
				label="现住地址:"
				prop="now_address"
				style="width:50%">
				<oa-limit-words v-model="formValidate.now_address" :max="50" style="width:300px" placeholder="请输入现住地址" />
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.health_condition"
				:content="old.health_condition"
				label="健康状况："
				prop="health_condition"
				style="width:50%">
				<i-input v-model="formValidate.health_condition" :maxlength="10" style="width:300px" placeholder="请输入健康状况" />
			</oa-form-item>
			<oa-form-item
				:edit="edit"
				:rules="rules.has_medical_history"
				:content="old.has_medical_history == '1' ? '有' : '无'"
				label="重大病史:"
				prop="has_medical_history"
				style="width:50%">
				<i-radio-group v-model="formValidate.has_medical_history">
					<i-radio label="1">有</i-radio>
					<i-radio label="2">无</i-radio>
				</i-radio-group>
			</oa-form-item>
			<oa-form-item
				v-if="formValidate.has_medical_history=='1'" 
				:edit="edit"
				:rules="rules.medical_history"
				:content="old.medical_history"
				label="病史说明:"
				prop="medical_history"
				style="width:50%">
				<oa-limit-words v-model="formValidate.medical_history" :max="200" style="width:300px" placeholder="请详细说明情况，便于工作岗位和强度安排" />
			</oa-form-item>
		</div>
	</div>
</template>

<script>
import {
	Form,
	FormItem,
	Input,
	InputNumber,
	Select,
	Option,
	DatePicker,
	Cascader,
	Message,
	Row,
	Col,
	RadioGroup,
	Radio,
	Button
} from 'iview';
import { services } from "@stores/services/hr";
import LimitWords from '@components/_common/limit-words/limit-words';
import { services as commonServices } from '@stores/services/common';
import moment from 'moment';
import Title from "../_common/title";
import Item from './item';

export default {
	name: 'hr-recruit-social-resume',
	components: {
		"i-form": Form,
		"i-form-item": FormItem,
		"i-input": Input,
		"i-input-number": InputNumber,
		"i-select": Select,
		"i-option": Option,
		"i-date-picker": DatePicker,
		"i-row": Row,
		"i-col": Col,
		"i-cascader": Cascader,
		"i-radio-group": RadioGroup,
		"i-radio": Radio,
		"i-button": Button,
		"oa-title": Title,
		'oa-limit-words': LimitWords,
		"oa-form-item": Item
	},
	mixins: [
		services.constellation(),
		services.nations(),
		commonServices.region()
	],
	props: {
		formValidate: Object,
		rules: Object,
		old: Object
	},
	data() {
		return {
			edit: false
		};
	},
	methods: {
		handleEdit() {
			this.edit = true;
			this.$emit('edit');
		},
		handleCancel() {
			this.edit = false;
			this.$emit('cancel');
		},
		handleSave() {
			this.$emit('save', {
				type: 2,
				cb: () => {
					this.edit = false;
				}
			});
		},
		handleRegion(value) {
			if (value.length == 0) {
				this.formValidate.city = 0;
				this.formValidate.province = 0;
			}
			this.formValidate.region = value;
			this.$forceUpdate();
		},
		handleChange(data) {
			let month = data.slice(5, 7);
			let day = data.slice(8, 10);
			this.getAstro(month, day);
		},
		getAstro(month, day) {
			let s = "魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
			let arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
			this.formValidate.constellation = s.substr(month * 2 - (day < arr[month - 1] ? 2 : 0), 2) + "座";
			return this.formValidate.constellation;
		},
	}
};
</script>

<style lang="scss">
</style>


