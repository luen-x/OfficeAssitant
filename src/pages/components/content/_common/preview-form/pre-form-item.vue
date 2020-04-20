<template>
	<i-form-item
		:label="config.component_label+':'"
		:prop="config.prop"
		:label-width="140"
		style="width:360px">
		<i-select
			v-if="config.component_type==1"
			:placeholder="config.placeholder"
			style="width:220px"
			clearable>
			<i-option
				v-for="(item,index) in config.options"
				:key="index"
				:value="item.value"
			>{{ item.label }}</i-option>
		</i-select>
		<i-input
			v-else-if="config.component_type ==2"
			:placeholder="config.placeholder"
			:maxlength="config.input_limit-0"
			clearable
		/>
		<i-input
			v-else-if="config.component_type ==3"
			:rows="3"
			:placeholder="config.placeholder"
			:maxlength="config.input_limit-0"
			type="textarea"
			clearable
		/>
		<i-date-picker
			v-else-if="config.component_type ==4"
			:placeholder="config.placeholder"
			:type="config.time_type==1?'date':'daterange'"

			style="width:220px"
			clearable
		/>
		<i-date-picker
			v-else-if="config.component_type ==5"
			:placeholder="config.placeholder"
			:type="config.time_type==1?'datetime':'datetimerange'"
			style="width:220px"
			clearable
		/>
		<vc-imgs-picker v-else-if="config.component_type ==6"/>
		<i-cascader
			v-else-if="config.component_type==8"
			:placeholder="config.placeholder"
			change-on-select
			style="width:220px"
			clearable
		/>
		<div v-else-if="config.component_type ==7">
			<i-radio-group v-if="config.check_type ==1||config.check_type ==0" style="justify-content: end;">
				<i-radio
					v-for="(item,index) in config.data"
					:key="index"
					:label="item.value"
				>{{ item.label }}</i-radio>
				<i-radio v-if="config.data.length==0">请添加选择条件</i-radio>
				<div>
					<i-radio v-if="config.has_other==1" label="99">其他
						<i-input :maxlength="20" style="width:150px" />
					</i-radio>
				</div>
			</i-radio-group>
			<i-checkbox-group v-else-if="config.check_type ==2" style="justify-content: end;">
				<i-checkbox
					v-for="(item,index) in config.data"
					:key="index"
					:label="item.value"
				>{{ item.label }}</i-checkbox>
				<i-checkbox v-if="config.data.length==0">请添加选择条件</i-checkbox>
				<i-checkbox v-if="config.has_other==1">其他
					<i-input :maxlength="20" style="width:150px"/>
				</i-checkbox>
			</i-checkbox-group>
		</div>
		<i-select
			v-else-if="config.component_type ==9"
			v-model="model13"
			:placeholder="config.placeholder"
			:remote-method="remoteMethod1"
			:loading="loading1"
			filterable
			remote>
			<i-option v-for="(option, index) in options1" :value="option.value" :key="index">{{ option.label }}</i-option>
		</i-select>
	</i-form-item>
</template>

<script >

export const eleType = [
	"0",
	"select",
	"input",
	"textarea",
	"datepicker",
	"timepicker",
	"upload",
	"check",
	"regional"
];

// {
// 	process_id: "1",
// 	step_id: "3",
// 	sort: "3",
// 	step_name: "电子稿对接",
// 	productComponent: [],
// 	productComponent_num: 0
// };
import LimitWords from "@common/limit-words/limit-words";
import { ImgsPicker, FilesPicker } from 'wya-vc';
import { services } from '@stores/services/sale';
import iview from "../iview";



export default {
	name: 'oa-form-item',
	components: {
		'oa-limit-words': LimitWords,
		'vc-imgs-picker': ImgsPicker

	},
	mixins: [iview, services.region3()],
	props: {
		config: Object,
		formData: Object,
	},
	data() {
		return {
			eleType,
			model13: '',
			loading1: false,
			options1: [],
			list: [
				'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
				'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia',
				'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas',
				'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
				'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
				'Nebraska', 'Nevada', 'New hampshire', 'New jersey', 'New mexico',
				'New york', 'North carolina', 'North dakota', 'Ohio', 'Oklahoma',
				'Oregon', 'Pennsylvania', 'Rhode island', 'South carolina',
				'South dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia',
				'Washington', 'West virginia', 'Wisconsin', 'Wyoming'
			]
		};
	},
	created() {

	},
	methods: {
		remoteMethod1(query) {
			if (query !== '') {
				this.loading1 = true;
				setTimeout(() => {
					this.loading1 = false;
					const list = this.list.map(item => {
						return {
							value: item,
							label: item
						};
					});
					this.options1 = list.filter(item => item.label.toLowerCase().indexOf(query.toLowerCase()) > -1);
				}, 200);
			} else {
				this.options1 = [];
			}
		},
	},
};
</script>

<style  lang="scss">
</style>
