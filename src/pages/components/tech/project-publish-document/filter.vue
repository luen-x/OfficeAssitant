<template>
	<div>
		<div class="g-flex g-fd-r g-jc-sb g-ai-c">
			<div>
				<i-input
					v-model="query.search" 
					placeholder="请输入内容标题/更新人搜索" 
					style="width: 300px"
					class="g-m-r-5"
					clearable
					@on-enter="handleSearch"
					@on-change="handleClear"
				/>
				<i-button 
					type="primary"
					@click="handleSearch"
				>
					搜索
				</i-button>
			</div>

			<div>
				<vc-debounce-click
					v-if="$auth[1430]"
					class="g-m-l-10 g-red-btn-line"
					@click="$router.push({
						path: '/tech/project/publish/document/add'
					})"
				>
					发布内容
				</vc-debounce-click>

				<vc-debounce-click
					v-if="$auth[1431]"
					class="g-m-l-5 g-red-btn-line"
					@click="$router.push({
						path: '/tech/project/publish/document/category'
					})"
				>
					类目管理
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
				...query,
			}
		};
	},
	methods: {
		handleSearch: debounce(function (event) {
			this.$router.replace(getHashUrl(
				'/tech/project/publish/document', 
				{
					...this.$route.query,
					fixPosition: true,
					...this.formatQuery()
				}
			));
			this.$store.commit('TECH_PROJECT_PUBLISH_DOCUMENT_LIST_INIT');
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
		
	}
};
</script>

<style lang="scss" scoped>
</style>