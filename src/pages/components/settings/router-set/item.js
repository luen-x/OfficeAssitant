import { Dropdown, DropdownMenu, DropdownItem } from 'iview';
import AutoTooltip from "@components/_common/auto-tooltip/auto-tooltip";
import { FrontEndRouter } from './popup/front-end-router';

const findRow = (rows, id) => {
	if (!Array.isArray(rows)) {
		return undefined;
	}
	let exist = rows.find(_item => _item.menus_id === id);
	if (exist) return exist;
	for (let i = 0; i < rows.length; i++) {
		exist = findRow(rows[i].children, id);
		if (exist) return exist;
	}
	return undefined;
};

export default {
	data() {
		return {
			isOpen: false,
			columns: [
				{
					title: '权限ID',
					key: 'menus_id',
					width: 100
				},
				{
					title: '名称',
					key: 'name',
					render: (h, params) => {
						const { row: { __level__, __expand__, name, children }, index } = params;

						const handleClick = (e) => {
							this.$refs.tableTarget.expand({ index });
							const data = this.$refs.tableTarget.data;
							this.expand.keys = data.filter(i => i.__expand__).map(i => i.menus_id);
							this.updateTableHeightDelay();
						};
						return <div 
							style={{ marginLeft: `${(__level__ - 1) * 20}px`, boxSizing: `content-box` }}
							class={ children && "g-pointer"}
							onClick={handleClick}
						>
							<i class={`iconfont g-c-black2 g-fs-12 g-m-r-10 ${
								children ? !__expand__ ? 'icon-triangle-right' : 'icon-triangle-down' : ''
							}`}/>
							<span>{name}</span>
						</div>;
						
					}
				},
				{
					title: '后端路由',
					key: 'backend_urls',
					render: (h, params) => {
						if (!params.row.backend_urls) {
							return <div onClick={() => this.handleDetail(params.row)}>无</div>;
						}
						const urls = params.row.backend_urls.split(',');
						return (
							<div onClick={() => this.handleDetail(params.row)}>
								{urls.map((i, index) => <div key={index}>{i}</div>)}
							</div>
						);
												
					}
				},
				{
					title: '前端路由',
					key: 'frontend_url',
					render: (h, params) => {
						if (!params.row.frontend_url) {
							return <div onClick={() => this.handleDetail(params.row)}>无</div>;
						}
						const urls = params.row.frontend_url.split(',');
						return (
							<div onClick={() => this.handleDetail(params.row)}>
								{urls.map((i, index) => <div key={index}>{i}</div>)}
							</div>
						);
												
					}
				},
				{
					title: '操作',
					key: 'operate',
					width: 150,
					render: (h, params) => {
						return (
							<div class="g-operation">
								<span onClick={() => this.handleDetail(params.row)}
								>查看</span>
								<span class="g-m-lr-5">|</span>
								<span onClick={() => this.handleDetail(params.row)}>
										编辑
								</span>	
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('SETTINGS_ROUTER_SET_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('SETTINGS_ROUTER_SET_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleDetail(row) {
			this.isOpen = true;
			FrontEndRouter.popup({
				routerName: row.name,
				menusId: row.menus_id,
				frontendUrl: row.frontend_url,
				isBackendUrl: row.is_backend_url,
				backendUrls: row.backend_urls
			}).then((res) => {
				this.updateRow(res);
			}).catch((err) => err && console.error(err)).finally(() => {

				setTimeout(() => {
					this.isOpen = false;
				
				}, 1000);
			
			});
		},
		updateRow(row) {
			const exist = findRow(this.list, row.menus_id);
			if (exist) {
				exist.frontend_url = row.frontend_url;
				exist.backend_urls = row.backend_urls;
			}
			this.$forceUpdate();				
		},
	}
};

