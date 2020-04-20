<template>
	<div class="v-academy-main-enroll-filter js-filter">
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="query.search"
					:maxlength="50"
					clearable
					placeholder="请输入姓名/电话/身份证号"
					style="width: 300px"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleSearch"
				/>
				<i-button 
					type="primary"
					@click="handleSearch"
				>
					搜索
				</i-button>
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
			</div>
			<div class="g-flex">
				<vc-debounce-click
					v-if="$auth[1532]"
					class="g-red-btn-line g-m-r-10"
					@click="handleAdd"
				>
					添加
				</vc-debounce-click>
			</div>
		</div>
		<vc-expand 
			ref="expand"
			v-model="show"
		>
			<div class="g-m-t-10 g-pd-lr-10 g-pd-t-5 g-pd-b-10 g-lh-40 g-bg-gray-mid">
				<i-select
					ref="invite"
					:value="query.staff_id"
					:remote-method="loadInvite"
					:loading="inviteLoading"
					style="width: 220px;"
					class="g-m-r-5"
					filterable
					remote
					clearable
					transfer
					label-in-value
					placeholder="请选择邀约人"
					@on-change="handleInviteChange"
					@on-query-change="handleQueryChange"
				>
					<i-option
						v-for="(item, index) in inviteData"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
				<i-select
					v-model="query.position_id"
					transfer
					clearable
					filterable
					placeholder="请输入职位查询"
					style="width: 220px;"
					class="g-m-r-5"
					@on-change="handleSearch"
				>
					<i-option
						v-for="item in recruitAllPosition"
						:key="item.position_id"
						:value="item.position_id"
					>
						{{ item.position_name }}
					</i-option>
				</i-select>
				<i-select
					v-model="query.ditch"
					style="width: 220px"
					class="g-m-r-5"
					clearable
					transfer
					filterable
					placeholder="请选择招聘渠道"
					@on-change="handleSearch"
				>
					<i-option
						v-for="(item, index) in ditches"
						:key="index"
						:value="item.value"
					>{{ item.label }}</i-option>
				</i-select>
			</div>
		</vc-expand>
	</div>
	
</template>

<script>
import { Input, Button, Cascader, Select, Option } from "iview";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import { services, createSearch } from "@stores/services/hr";
import { AuditModal } from "./popup/add";

export default {
	name: "oa-filter",
	components: {
		"i-cascader": Cascader,
		"i-select": Select,
		"i-option": Option,
		"i-input": Input,
		"i-button": Button,
		"vc-expand": Expand
	},
	mixins: [
		services.recruitAllPosition(),
		services.ditches(),
		createSearch({ key: 'invite' })
	],
	data() {
		const { query = {} } = this.$route;
		return {
			invite: String(query.invite_name),
			query: {
				position_id: Number(query.position_id),
				ditch: Number(query.ditch),
				staff_id: Number(query.staff_id),
				search: query.search,
			},
			show: false
		};
	},
	methods: {
		handlePositionChange(value, selected) {
			this.query.position_id = value;
			this.handleSearch();
		},
		handleAdd() {
			AuditModal.popup({}).then(res => {
				this.$store.commit("HR_RECRUIT_SOCIAL_BLACKLIST_LIST_INIT");
			}).catch(err => err && console.error(err.msg));
		},
		handleSearch(event) {
			this.$router.replace(
				getHashUrl("/hr/recruit/social/blacklist", {
					...this.$route.query,
					...this.query
				})
			);
			this.$store.commit("HR_RECRUIT_SOCIAL_BLACKLIST_LIST_INIT");
		},
		handleToggle() {
			this.$refs.expand.toggle();
		},
		handleInviteChange(staff) {
			this.query.staff_id = staff && staff.value ? staff.value : '';
			this.query.invite_name = staff && staff.label ? staff.label : '';
			this.handleSearch();
		},
		handleQueryChange(query = '') {
			let targetQuery = this.query.invite_name || '';
			if (targetQuery.length > query.length) {
				this.$refs.invite.clearSingleSelect();
			}
		},
	}
};
</script>

<style lang="scss" scoped>
</style>
