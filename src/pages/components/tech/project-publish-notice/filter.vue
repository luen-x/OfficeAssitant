<template>
	<div>
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="query.search" 
					placeholder="请输入内容标题/更新人搜索" 
					style="width: 220px"
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleClear"
				/>
				<i-select
					v-model="query.project_id"
					placeholder="请选择项目"
					style="width: 220px"
					class="g-m-r-5"
					clearable
					transfer
					@on-change="handleSearch"
				>
					<i-option 
						v-for="item in projectList" 
						:value="item.project_id" 
						:key="item.project_id"
					>
						{{ item.project_name }}
					</i-option>
				</i-select>
				<i-button 
					type="primary"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>
			<div>
				<vc-debounce-click
					v-if="$auth[1424]"
					class="g-m-l-10 g-red-btn-line"
					@click="handleAdd"
				>
					发布内容
				</vc-debounce-click>
			</div>
		</div>
	</div>
</template>

<script>
import { Input, Button, Select, Option } from 'iview';
import { Expand } from 'wya-vc';
import { debounce } from 'lodash';
import { getParseUrl, getHashUrl } from '@utils/utils';

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
			query: {
				search: '',
				project_id: '',
				...query,
			},
			projectList: []
		};
	},
	created() {
		this.loadProjectList();
	},
	methods: {
		loadProjectList() {
			this.$request({
				url: '_TECH_PROJECT_PUBLISH_NOTICE_PROJECT_LIST_GET',
				type: "GET",
				param: {},
				loading: false
			}).then((res) => {
				this.projectList = res.data;
			}).catch((error) => {
			});
		},
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/tech/project/publish/notice', 
				{
					...this.$route.query,
					fixPosition: true,
					...this.formatQuery()
				}
			));
			this.$store.commit('TECH_PROJECT_PUBLISH_NOTICE_LIST_INIT');
		}, 200),
		handleClear(val) {
			val = val.target.value;
			if (val == undefined || val == '') {
				this.handleSearch();
			}
		},
		formatQuery() {
			const _query = {};
			Object.keys(this.query).forEach(key => {
				if (this.query[key] instanceof Date) {
					_query[key] = moment(this.query[key]).format("YYYY-MM-DD");
				} else {
					_query[key] = this.query[key];
				}
			});
			return _query;
		},
		handleAdd() {
			this.$router.push({
				path: '/tech/project/publish/notice/add',
			});
		}
	}
};

</script>

<style lang="scss" scoped>

</style>
