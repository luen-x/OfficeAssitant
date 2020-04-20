<script>
import { Tabs, TabPane } from 'iview';
import OaLoading from '@components/_common/loading/loading';
import { getParseUrl, getHashUrl } from '@utils/utils';
import Result from './result';

export default {
	name: 'content-search-result',
	mixins: [Result],
	props: {
		name: String,
		keyword: String,
	},
	data() {
		const { query } = this.$route;
	
		return {
			type: String(query.type || "1"), // 同tabs下的value
			animate: false,
			current: {},
			show: false,
			isLoading: false,
		};
	},
	computed: {
		listInfo() {
			return this.$store.state.contentSearchResult.listInfo;
		},
		list() {
			return this.$store.state.contentSearch.data;
		},
		typeNow() {
			return this.$route.query.type || this.type;
		}
	},
	watch: {
		$route: {
			handler(val, oldval) {
				this.getPath();
			},
			// 深度观察监听
			deep: true
		},
	},
	created() {
		this.loadData();
		// this.getList();
	},
	methods: {
		getPath() {
			this.loadData();
		},
		getList(key) {
			let m_type = '';
			if (this.typeNow == '8') {
				m_type = '1';
			} else if (this.typeNow == '7') {
				m_type = '2';
			} else if (this.typeNow == '10') {
				m_type = '3';
			}
			this.request({
				url: 'CONTENT_SEARCH_GET',
				type: "GET",
				param: {
					material_type: m_type,
					keyword: key
				},
				loading: false
			}).then(res => {
				this.$store.commit('CONTENT_SEARCH_RELATION_LIST_GET_SUCCESS', res.data);
			}).catch(error => {
			});
		},
		loadData(page, pageSize) {
			this.isLoading = true;
			let { query = {} } = getParseUrl();
			return this.request({
				url: 'CONTENT_SEARCH_RESULT_GET',
				type: 'GET',
				param: {
					...query,
					type: this.typeNow,
					page: page || 1,
					pageSize: pageSize || 10,
				},
			}).then((res) => {
				this.isLoading = false;
				if (this.type == '7' || this.type == '8' || this.type == '10') {
					let arr = [];
					let keyword = '';
					res.data.list.map(item => {
						arr.push(item.keyword);
						return;
					});
					keyword = arr.join(' ');
					this.getList(keyword);
				}
			}).catch((error) => {
				console.error(error);
			});
		},
		handleChange(type) {
			if (type == this.typeNow) {
				return;
			}
			this.$store.commit('CONTENT_SEARCH_RESULT_INIT');
			this.type = type;
			let { query = {} } = getParseUrl(); // this.$route需要设置paging.sync
			query = {
				...query,
				type,
				page: 1,
				pageSize: 10
			};
			this.$router.replace(getHashUrl('/content/search/result', { ...query }));
			// this.loadData();
		},
		handleChangePageSize() {
			this.$store.commit('CONTENT_SEARCH_RESULT_LIST_INIT');
		}
	},
	render(h) {
		let stringType = this.typeNow.toString();
		const { isLoading } = this;
		return (
			<Tabs value={stringType} on-on-click={this.handleChange} animated={this.animate}>
				{
					this.getTabs && this.getTabs.map((item, index) => {
						const Component = item.Component;
						return (
							<TabPane label={item.label} name={item.value} style="min-height: 350px;">
								{isLoading 
									? <OaLoading/>
									: <Component 
										label={item.label} 
										type={this.typeNow} 
										keyword={this.keyword} 
										showitem={ this.typeNow == item.value }
										loadData={this.loadData}
										style={{ minWidth: '1100px' }}
									/>}
							</TabPane>
						);
					})
				}
			</Tabs>
		);
	},

};
</script>

<style lang="scss">

</style>


