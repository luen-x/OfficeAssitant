<template>
	<div class="js-filter">
		<i-input
			v-model="keyword"
			clearable 
			placeholder="请输入角色名称" 
			style="width: 220px"
			@on-enter="handleSearch"
			@on-change="handleSearch"
		/>
		<i-select
			v-model="level"
			:maxlength="30"
			style="width: 220px"
			clearable
			class="g-m-l-5"
			placeholder="请选择角色等级"
			@on-enter="handleSearch"
			@on-change="handleSearch">
			<i-option :value="1">高级管理 </i-option>
			<i-option :value="2">中级管理</i-option>
			<i-option :value="3">普通员工</i-option>
		</i-select>
		<vc-debounce-click
			:tag="Button"
			type="primary"
			class="g-red-btn-small"
			style="margin-left: 5px"
			@click="handleSearch"
		>
			搜索
		</vc-debounce-click >
		<vc-debounce-click
			v-if="$auth['269']"
			class="g-fr g-red-btn-line" 
			@click="handleAddNew">新增角色</vc-debounce-click>
			<!-- <div class="g-fr"><i-add-new>新增角色</i-add-new></div> -->
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { PModalAddNew } from './popup/add-new-role';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option,
		// 'i-add-new': AddNewRole
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.role_name || ''),
			level: Number(query.level) || '',
			name: String(query.name || ''),
			show: false
		};
	},
	beforeCreate() {
		this.Button = Button;
	},
	methods: {
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/hr/system/role', 
				{ 
					...this.$route.query, 
					type: this.$route.query.type || '0',
					role_name: this.keyword,
					name: this.name,
					level: this.level
				}
			));
			this.$store.commit('HR_ROLE_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleAddNew() {
			PModalAddNew.popup({});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
