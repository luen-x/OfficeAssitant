<template>
	<div class="js-filter">
		<div>
			<i-input
				v-model="keyword" 
				clearable
				placeholder="请输入通知标题、通知内容搜索" 
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleChange"
			/>
			<vc-debounce-click
				:tag="Button"
				type="primary"
				class="g-m-l-5"
				style="height: 32px"
				@click="handleSearch"
			>
				搜索
			</vc-debounce-click>
			<span 
				class="g-m-l-20 g-c-black-dark g-fs-12 g-pointer"
				@click="handleToggle" 
			>
				更多搜索条件
				<i 
					:class="show ? 'icon-triangle-up' : 'icon-triangle-down'" 
					class="iconfont g-fs-12 g-c-black-dark"
				/>
			</span>
			<i-button
				v-if="$auth['61']"
				:class="['g-fr', {'_btn': canAdd} ]"
				:disabled="canAdd"
				type="error"
				ghost
				@click="handleNewNotice">新增通知</i-button>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;">
				<i-select 
					v-model="notice_type" 
					clearable 
					style="width: 220px"
					label="请选择通知类型" 
					class="_short g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option value="1">可立即关闭</i-option>
					<i-option value="2">等待再关闭</i-option>
				</i-select>

				<i-select
					ref="role" 
					:value="role_id"
					:remote-method="remote"
					:loading="isLoading"
					placeholder="请填写接收角色"
					filterable
					clearable
					remote
					label-in-value
					style="width: 220px"
					class="_short g-m-r-5"
					@on-change="handleRoleChange"
					@on-query-change="handleQueryChange"
				>
					<i-option v-for="(role, index) in allRoles" :value="role.role_id" :key="index">{{ role.role_name }}</i-option>
				</i-select>
				
				<i-select 
					v-model="send_type" 
					clearable 
					label="请选择发送类型"
					style="width: 220px"
					class="_short g-m-r-5"
					@on-change="handleSearch"	
				>
					<i-option value="1">下次登录</i-option>
					<i-option value="2">每次登录</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { getParseUrl, getHashUrl } from '@utils/utils';
import { services } from '@stores/services/hr';
import ROOT_API from '@stores/apis/root';
import { PModalAddNew } from './popup/add-new';

export default {
	name: 'oa-filter',
	components: {
		'i-input': Input,
		'i-button': Button,
		'vc-expand': Expand,
		'i-select': Select,
		'i-option': Option
	},
	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ''),
			name: String(query.name || ''),
			show: false,
			notice_type: query.notice_type,
			send_type: query.send_type,
			role_id: Number(query.role_id) || '',
			allRoles: [],
			isLoading: false,
			role_name: '',
			remote: null
		};
	},
	computed: {
		canAdd() {
			return this.$store.state.contentNoticeInform.count_open >= 10; 
		}
	},
	beforeCreate() {
		this.Button = Button;
	},
	created() {
		this.handleRoleDefault();
	},
	methods: {
		handleQueryChange(query = '') {
			let targetQuery = this.role_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.role.clearSingleSelect();
			}
		},
		handleSearch(event) {
			this.$router.replace(getHashUrl(
				'/content/notice/inform', 
				{ 
					...this.$route.query, 
					keyword: this.keyword,
					name: this.name,
					notice_type: this.notice_type,
					send_type: this.send_type,
					role_id: this.role_id,
					label: this.role_name,
					fixPosition: true
				}
			));
			this.$store.commit('CONTENT_NOTICE_INFORM_LIST_INIT');
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleNewNotice() {
			PModalAddNew.popup({}).catch(() => {});
		},
		handleSelectRole(query) {
			this.isLoading = true;

			return this.$request({
				url: ROOT_API._AUTH_ROLE_LIST_GET,
				type: 'GET',
				param: {
					role_name: query
				}
			}).then(res => {
				this.isLoading = false;
				this.allRoles = res.data.list;
			});
		},
		handleChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},
		handleRoleChange(role = {}) {
			this.role_id = role.value || '';
			this.role_name = role.label || '';
			this.handleSearch();
		},
		// 刷新页面 保持角色不变
		handleRoleDefault() {
			const { query = {} } = this.$route;
			
			if (query.label) {
				this.handleSelectRole(query.label).then(() => {
					this.remote = this.handleSelectRole;
				});
			} else {
				this.remote = this.handleSelectRole;
			}
		}
	}
};
</script>