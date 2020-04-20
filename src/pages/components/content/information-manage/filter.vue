<template>
	<div class="v-content-manage-filter js-filter">
		<div>
			<i-input
				v-model="keyword"
				clearable
				placeholder="请输入标题、关键词搜索"
				style="width: 300px"
				@on-enter="handleSearch"
				@on-change="handleInputChange"
			/>
			<i-button
				type="primary"
				class="g-m-l-5"
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
			<router-link
				v-if="$auth[55]"
				:to="'/content/information/manage/preview?status=1'"
				class="g-red-btn-line g-fr"
			>
				新增资讯
			</router-link>
		</div>

		<vc-expand
			ref="expand"
			v-model="show"
		>
			<div 
				class="g-m-t-10 g-pd-lr-10 g-lh-42 g-bg-gray-mid"
				style="padding-top: 3px;padding-bottom: 7px;"
			>
				<i-select
					v-model="category_id"
					clearable
					transfer
					style="width:200px"
					placeholder="请选择分类"
					class="g-m-r-5"
					@on-change="handleSearch({category_id: arguments[0]})"
				>
					<i-option
						v-for="item in materialClassAll"
						:value="item.category_id"
						:key="item.category_id"
					>
						{{ item.category_name }}
					</i-option>
				</i-select>

				<i-input
					v-model="username"
					clearable
					placeholder="请输入添加人搜索"
					style="width: 220px;"
					class="g-m-r-5"
					@on-enter="handleSearch"
					@on-change="handleInputChange"
				/>
			</div>
		</vc-expand>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from "iview";
import { Expand } from "wya-vc";
import { getParseUrl, getHashUrl } from "@utils/utils";
import API_ROOT from "@stores/apis/root";
import { services } from "@stores/services/content";
import { debounce } from 'lodash';

export default {
	name: "oa-filter",

	components: {
		"i-input": Input,
		"i-button": Button,
		"vc-expand": Expand,
		"i-select": Select,
		"i-option": Option
	},

	data() {
		const { query = {} } = this.$route;
		return {
			keyword: String(query.keyword || ""),
			username: String(query.username || ""),
			show: false,
			category_id: String(query.category_id || ""), // 搜索分类
			materialClassAll: []
		};
	},

	mounted() {
		this.handleGetClassAll();
	},

	methods: {
		handleSearch: debounce(function (value) {
			this.$router.replace(
				getHashUrl("/content/information/manage", {
					...this.$route.query,
					keyword: this.keyword,
					username: this.username,
					category_id: this.category_id
				})
			);

			this.$store.commit("CONTENT_INFORMATION_MANAGE_LIST_INIT");
		}, 300),
		handleToggle() {
			this.$refs.expand.toggle();
		},

		// 新增资讯
		handleNewConsulting() {
			this.$router.push({
				path: "/content/information/manage/preview",
				query: { status: 1 }
			});
		},
		
		handleInputChange(e) {
			if (!e.target.value) {
				this.handleSearch();
			}
		},

		handleGetClassAll() {
			this.$request({
				url: API_ROOT._CONTENT_INFORMATION_MANAGE_ALL_GET,
				type: 'GET',
				param: {},
			}).then((res) => {
				let result = [];

				const deep = arr => {
					arr.map(v => {
						result.push(v);

						if (v.children) {
							deep(v.children);
						}

						return v;
					});
				};

				deep(res.data);

				this.materialClassAll = result;
			}).catch((error) => {
			});
		}
	}
};
</script>

<style lang="scss" scoped>
</style>