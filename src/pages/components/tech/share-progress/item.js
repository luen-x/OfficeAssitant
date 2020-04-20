import AutoTooltip from '@common/auto-tooltip/auto-tooltip';
import { getParseUrl, getHashUrl } from '@utils/utils';

export default {
	data() {
		return {
			columns: [
				{
					title: '需求点',
					key: 'need_name',
					width: 250,
					fixed: 'left',
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.need_name}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '所属板块',
					key: 'plate',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.plate}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '所属经理',
					key: 'manager',
					minWidth: 100
				},
				{
					title: '提出公司',
					key: 'company',
					minWidth: 250,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.company}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '负责产品',
					key: 'product',
					minWidth: 120,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.product}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				},
				{
					title: '上线时间',
					key: 'online_time',
					minWidth: 160,
					renderHeader: (h, { row }) => {
						return (
							<span>
								上线时间
								<span class="ivu-table-sort">
									<i 
										class={[
											'ivu-icon ivu-icon-md-arrow-dropup',
											{ 'g-c-blue-mid': this.order == 'online_time' && this.sort === 0 }
										]} 
										onClick={() => { this.handleaAsc('online_time'); }} 
									/>
									<i 
										class={[
											'ivu-icon ivu-icon-md-arrow-dropdown',
											{ 'g-c-blue-mid': this.order == 'online_time' && this.sort === 1 }
										]} 
										onClick={() => { this.handleDesc('online_time'); }} 
									/>
								</span>
							</span>
						);
					},
				},
				{
					title: '发布时间',
					key: 'create_time',
					minWidth: 160,
					renderHeader: (h, { row }) => {
						return (
							<span>
								发布时间
								<span class="ivu-table-sort">
									<i 
										class={[
											'ivu-icon ivu-icon-md-arrow-dropup',
											{ 'g-c-blue-mid': this.order == 'create_time' && this.sort === 0 }
										]} 
										onClick={() => { this.handleaAsc('create_time'); }} 
									/>
									<i 
										class={[
											'ivu-icon ivu-icon-md-arrow-dropdown',
											{ 'g-c-blue-mid': this.order == 'create_time' && this.sort === 1 }
										]} 
										onClick={() => { this.handleDesc('create_time'); }} 
									/>
								</span>
							</span>
						);
					},
				},
				{
					title: '功能描述',
					key: 'function_description',
					minWidth: 250,
					render: (h, { row }) => {
						return (
							<div>
								<AutoTooltip 
									content={row.function_description}
									theme="dark"
									placement="bottom"
									labelClass="g-c-black3"
								/>
							</div>
						);
					}
				}
			],
		};
	},
	methods: {
		handleaAsc(order) {
			let { query = {} } = getParseUrl();
			if (this.sort === 0) {
				this.sort = undefined;
				this.order = undefined;
			} else {
				this.order = order;
				this.sort = 0;
			}
			this.handleSearch({ ...query, order: this.order, sort: this.sort });
		},
		handleDesc(order) {
			let { query = {} } = getParseUrl();
			if (this.sort === 1) {
				this.sort = undefined;
				this.order = undefined;
			} else {
				this.order = order;
				this.sort = 1;
			}
			this.handleSearch({ ...query, order: this.order, sort: this.sort });
		},
		handleSearch(query = {}) {
			this.$router.replace(getHashUrl(
				'/tech/share/progress',
				{
					...this.$route.query,
					...query
				}
			));
			this.$store.commit('TECH_SHARE_PROGRESS_LIST_INIT');
		},
	}
};

