<template>
	<div class="v-picker-staff_filter">
		<i-input
			v-model="name"
			clearable
			class="g-m-l-5"
			style="width: 220px"
			placeholder="请输入姓名或者手机号搜索"/>
		<i-date-picker
			v-model="time"
			class="g-m-l-5"
			type="month"
			style="width: 220px"
			@on-change="handleSearch"/>
		<i-select v-model="department" class="g-m-l-5" style="width: 220px">
			<i-option v-for="item in options" :key="item" value="item">{{ item }}</i-option>
		</i-select>
		<i-button type="primary" class="g-m-l-5" @click="handleSearch">搜索</i-button>
		<i-button type="error" ghost class="g-m-l-5 g-fr" @click="handleOutput">导出</i-button>
		<i-button type="error" ghost class="g-m-l-5 g-fr" @click="handlePkNow">PK现场</i-button>
	</div>
</template>

<script>
import { DatePicker, Select, Option, Input, Button } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-date-picker': DatePicker,
		'i-select': Select,
		'i-option': Option,
		'i-button': Button
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false,
			time: '',
			department: '',
			options: [1, 2, 3, 4]
		};
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/sale/main/pk/staff', 
				{ 
					...this.$route.query, 
					name: this.name
				}
			));
			this.$store.commit('SALE_MAIN_PK_STAFF_LIST_INIT');
		},
		handlePkNow() {
			this.$router.push('/sale/main/scene');
		},
		handleOutput() {
			alert('output');
		}
	}
};

</script>

<style lang="scss" scoped>
	.v-picker-staff_filter {
		margin: -10px 0 0 -10px;
	}
</style>
