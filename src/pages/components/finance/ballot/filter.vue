<template>
	<div class="js-filter">
		<div class="g-flex g-jc-sb">
			<div>
				<i-input
					v-model="formdata.keyword"
					:maxlength="50"				 
					placeholder="请输入公司名称，姓名或电话进行搜索" 
					style="width: 300px" 
					clearable
					@on-change="handleSearch"
					@on-enter="handleSearch"
				/>
				<i-button
					type="primary"
					class="g-m-l-5"
					@click="handleSearch"
				>
					搜索
				</i-button>
				<span 
					class="g-m-l-20 g-c-black3 g-fs-12 g-pointer"
					@click="handleToggle" 
				>
					更多搜索条件
					<i 
						:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
						class="iconfont g-fs-12 g-c-black-dark"
					/>
				</span>
			</div>
			<span v-if="$auth['1017']" class="g-red-btn-line" @click="handleSetting">审核设置</span>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-bg-gray-mid g-pd-lr-10 g-lh-42"
				style="padding-top: 3px; padding-bottom: 7px">
				<i-input
					v-model="formdata.invoice_code" 				 
					placeholder="请输入发票代码或发票号码" 
					style="width: 220px" 
					class="g-m-r-5" 
					clearable
					@on-change="handleSearch"
					@on-enter="handleSearch"
				/>
				<i-select
					v-model="formdata.invoice_type" 
					placeholder="发票类型" 
					style="width: 220px"
					class="g-m-r-5" 
					transfer
					clearable
					@on-change="handleSearch" 
				>
					<i-option value="1">增值税专用发票</i-option>
					<i-option value="2">增值税普通发票</i-option>
				</i-select>
				<i-datepicker
					v-model="formdata.create_time"
					placeholder="选择申请时间"
					style="width: 220px"
					class="g-m-r-5" 
					transfer
					clearable
					@on-change="handleSearch" 					 
				/>
				<i-select
					v-model="formdata.is_receive" 
					placeholder="请选择是否领票" 
					style="width: 220px"
					class="g-m-r-5" 
					transfer
					clearable
					@on-change="handleSearch" 
				>
					<i-option value="1">是</i-option>
					<i-option value="0">否</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option, DatePicker } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl, formatMoment } from '@utils/utils';
import { SettingModal } from './popup/setting';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-datepicker': DatePicker,
		'i-option': Option,
		 
	},
	data() {
		const { query = {} } = this.$route;
		return {
			formdata: query,
			show: false
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/finance/ballot', 
				{ 
					...this.formdata,
					fixPosition: true,
					create_time: formatMoment(this.formdata.create_time)
				}
			));
			this.$store.commit('FINANCE_BALLOT_LIST_INIT');
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleSetting() {
			SettingModal.popup({

			}).then({

			}).catch({

			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
