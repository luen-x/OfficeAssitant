<template>
	<i-form-item :label="config.label+'：'" :prop="config.prop">
		<i-input
			v-if="config.itemType ==='input'"
			v-model="formData[config.prop]"
			:placeholder="config.placeholder"
			:maxlength="config.max"
			:disabled="config.disabled"
			:clearable="!config.disabled"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		/>
		<i-select
			v-else-if="config.itemType ==='select'"
			v-model="formData[config.prop]"
			:placeholder="config.placeholder"
			:transfer="true"
			:disabled="config.disabled"
			:clearable="!config.disabled"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		>
			<i-option
				v-for="(item,index) in config.options"
				:key="index"
				:value="item.value"
				:disabled="item.disabled"
			>{{ item.label }}</i-option>
		</i-select>
		<!-- <span v-else-if="config.itemType ==='input-number'">
			<span v-if="config.unit" class="_number-append">{{ config.unit }}</span>
			<i-input-number
				v-model="formData[config.prop]"
				:placeholder="config.placeholder"
				:min="0" 
				:max="999999999"
				:disabled="config.disabled"
				:clearable="!config.disabled"
				@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
			/>
		</span> -->
		<i-date-picker
			v-else-if="config.itemType ==='date-picker'"
			v-model="formData[config.prop]"
			:placeholder="config.placeholder"
			:transfer="true"
			:disabled="config.disabled"
			:clearable="!config.disabled"
			type="date"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		/>
		<i-date-picker
			v-else-if="config.itemType ==='date-time-picker'"
			v-model="formData[config.prop]"
			:disabled="config.disabled"
			:placeholder="config.placeholder"
			:transfer="true"
			:clearable="!config.disabled"
			type="datetime"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		/>
		<i-radio-group
			v-else-if="config.itemType ==='radio-group'"
			v-model="formData[config.prop]"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		>
			<i-radio 
				v-for="(item,index) in config.options" 
				:key="index" 
				:label="item.value"
				:disabled="config.disabled"
			>
				{{ item.label }}
			</i-radio>
		</i-radio-group>
		<i-checkbox-group
			v-else-if="config.itemType ==='checkbox-group'"
			v-model="formData[config.prop]"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		>
			<i-checkbox
				v-for="(item,index) in config.options"
				:key="index"
				:label="item.value"
				:disabled="config.disabled"
			>{{ item.label }}</i-checkbox>
		</i-checkbox-group>
		<oa-limit-words
			v-else-if="config.itemType ==='limit-words'"
			v-model="formData[config.prop]"
			:width="config.width || '300px'"
			:disabled="config.disabled"
			:placeholder="config.placeholder"
			:max="config.max"
			@input="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		/>
		<i-cascader
			v-else-if="config.itemType ==='region'"
			ref="region"
			v-model="formData[config.prop]"
			:data="region3"
			:placeholder="config.placeholder"
			:disabled="config.disabled"
			change-on-select
			filterable
			clearable
			@on-change="handleRegionChange"
		/>
		<i-radio-group
			v-else-if="config.itemType ==='radio-group-input'"
			ref="groupInput"
			v-model="formData[config.prop]"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		>
			<i-radio 
				v-for="(item,index) in config.options" 
				:key="index" 
				:label="item.value"
				:disabled="config.disabled"
			>
				{{ item.label }}
			</i-radio>
			<i-radio :label="extraInput">其他
				<i-input v-model="extraInput" style="width:60px" @on-change="handleExtraChange"/>
			</i-radio>
		</i-radio-group>
		<i-checkbox-group
			v-else-if="config.itemType ==='checkbox-group-input'"
			ref="groupInput"
			v-model="formData[config.prop]"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		>
			<i-checkbox
				v-for="(item,index) in config.options"
				:key="index"
				:label="item.value"
				:disabled="config.disabled"
			>{{ item.label }}</i-checkbox>
			<i-checkbox :label="extraInput">
				其他
				<i-input v-model="extraInput" style="width:60px" @on-change="handleExtraChange"/>
			</i-checkbox>
		</i-checkbox-group>
		<i-time-picker
			v-else-if="config.itemType ==='time-picker'"
			:placeholder="config.placeholder"
			:disabled="config.disabled"
			:transfer="true"
			v-model="formData[config.prop]"
			:clearable="!config.disabled"
			type="time"
			@on-change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
		/>
		<template v-else-if="config.itemType ==='img-picker'">
			<div class="g-flex">
				<oa-imgs-picker
					:placeholder="config.placeholder"
					:max="config.max"
					:disabled="config.disabled"
					v-model="formData[config.prop]"
					@change="$emit('change',{prop:config.prop,value:formData[config.prop]})"
					@error="handleError"
				/>
				<!-- v-if="config.upload_example && config.upload_example.length" -->
				<i-tooltip
					v-if="config.upload_example && config.upload_example.length"
					content="点击可查看示例"
					theme="light"
					placement="top"
					transfer
				>
					<i 
						style="position: relative;top: -8px;"
						class="icon iconfont icon-view g-c-blue-mid g-pointer g-fs-20"
						@click="handlePreview($event,config.upload_example )"
					/>
				</i-tooltip>
			</div>
		</template>
		<i-select
			v-else-if="config.itemType ==='remote-select-single'||config.itemType ==='remote-select-muti'"
			v-model="formData[config.prop]"
			:placeholder="config.placeholder"
			:transfer="true"
			:disabled="config.disabled"
			:clearable="!config.disabled"
			:remote-method="handleSearch"
			:loading="searchLoading"
			:multiple="config.itemType ==='remote-select-muti'"
			label-in-value
			filterable
			remote
			@on-change="handleRemoteChange"
		>
			<i-option
				v-for="(item,index) in options"
				:key="index"
				:value="item.value"
			>{{ item.label }}</i-option>
		</i-select>
	</i-form-item>
</template>

<script >
import { ImgsPicker, ImgsPreview } from 'wya-vc';
import { Tooltip } from 'iview';
import LimitWords from "@common/limit-words/limit-words";
import { services } from '@stores/services/sale';
import { getItem } from '@utils/utils';
import iview from '../../iview';

const lecturerSearch = {
	url: '_SALE_CONTRACT_DEPART_STAFF_SEARCH_GET',
	getParam: (search) => {
		const ids = getItem(`firstDepartId_${_global.version}`).res.data;
		return {
			depart_id: ids.bs,
			search
		};
	},
	labelKey: 'staff_name',
	valueKey: 'staff_id'
};
const remoteSelectConfig = {
	promote_lecturer: lecturerSearch,
	intention_lecturer: lecturerSearch
};

export default {
	name: 'oa-form-item',
	components: {
		'oa-limit-words': LimitWords,
		'oa-imgs-picker': ImgsPicker,
		'i-tooltip': Tooltip
	},
	mixins: [iview, services.region3({ autoLoad: false })],
	props: {
		config: Object,
		formData: Object,
	},
	data() {
		let extraInput = '';
		if (this.config.itemType == 'radio-group-input') {
			extraInput = ((this.config.value && this.config.value.startsWith('value_')) ? '' : this.config.value);
		} else if (this.config.itemType == 'checkbox-group-input') {
			extraInput = (this.config.value && this.config.value.find(val => !val.startsWith('value_'))) || '';
		}
		return {
			extraInput,
			options: [],
			searchLoading: false,
			canSearch: false
		};
	},
	created() {
		if (this.config.itemType == 'region') this.loadRegion3();
	},
	mounted() {
		if (this.config.itemType == 'remote-select-single' || this.config.itemType == 'remote-select-muti') {
			this.$nextTick(() => {
				this.options = [...this.config.options];
				this.canSearch = true;
			}); 
		} else {
			this.canSearch = true;
		}

	},
	methods: {
		handleRemoteChange(val) {
			this.$emit('change', { prop: this.config.prop, value: this.formData[this.config.prop] });
			if (this.config.itemType == 'remote-select-muti') {
				this.config.options = [...val];

			} else if (this.config.itemType == 'remote-select-single') {
				this.config.options = [val];
			}
			
			// this.$emit("change", val);
			

		},
		handleExtraChange() {
			if (this.config.itemType == 'radio-group-input') {
				this.formData[this.config.prop] = this.extraInput;
				this.$refs.groupInput && this.$refs.groupInput.dispatch('FormItem', 'on-form-change', this.extraInput);
			} else if (this.config.itemType == 'checkbox-group-input') {
				const index = this.formData[this.config.prop].findIndex(val => !val.startsWith('value_'));
				if (index > -1) {
					this.formData[this.config.prop][index] = this.extraInput;
				}
				this.$refs.groupInput && this.$refs.groupInput.dispatch('FormItem', 'on-form-change', this.formData[this.config.prop]);

			}
		},
		handleRegionChange(event) {
			this.$emit('change', { prop: this.config.prop, value: this.formData[this.config.prop] });
			if (this.$refs.region.selected) {
				this.config.options = this.$refs.region.selected.map(({ label, value }) => ({ label, value }));
			}

		},
		handleError(err) {
			this.$Message.error(err.msg);
		},
		handlePreview(e, imgs) {
			ImgsPreview.popup({
				visible: true,
				dataSource: imgs,
			});
		},
		handleSearch(search) {
			if (!this.canSearch) return;
			this.searchLoading = true;
			const config = remoteSelectConfig[this.config.prop];
			if (!config) {
				console.error('未知的远程搜索字段 ' + this.config.prop);
				return;
			}
			this.$request({
				url: config.url,
				type: "GET",
				param: config.getParam(search),
				loading: false,
			}).then(res => {
				const data = res.data.list || (Array.isArray(res.data) ? res.data : []);
				this.options = data.map(i => {
					return {
						label: i[config.labelKey],
						value: i[config.valueKey] + ''
					};
				});
				
				

			}).catch((res) => {
				console.error(res);
				this.$Message.error(res.msg);
			}).finally(() => {
				this.searchLoading = false;
			});

		}
	},
};
</script>

<style  lang="scss">
</style>
