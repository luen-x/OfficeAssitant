export const departListMixin = {
	computed: {
		departList() {
			if (this.firstDepartId.sale) {
				const sale = this.departAll.find(dep => dep.value == this.firstDepartId.sale);
				if (!sale) return [];
				const deps = sale.children.map(it => ({ value: it.value, label: it.label }));
				// deps.unshift({ value: this.firstDepartId.sale, label: '营销中心' });
				return deps; 
			} else return [];
		},
	},
};

export const saleDepartTreeMixin = {
	computed: {
		saleDepartTree() {
			if (this.firstDepartId.sale) {
				const sale = this.departAll.find(dep => dep.value == this.firstDepartId.sale);
				if (!sale) return [];
				return sale.children;
				// const deps = sale.children.map(it => ({ value: it.value, label: it.label }));
				// // deps.unshift({ value: this.firstDepartId.sale, label: '营销中心' });
				// return deps; 
			} else return [];
		},
	},
};
export const handleSortMixin = (option = {}) => {
	const { callback } = option;
	return {
		methods: {
			handleSortChange({ key, order }) {
				const { path, query } = this.$route;
				const _query = { ...query };
				if (order == 'normal') {
					delete _query.sort_field;
					delete _query.sort_order;
				} else {
					_query.sort_field = key;
					_query.sort_order = order;
				}
				this.$router.replace({
					path,
					query: _query,
					
				});
				if (callback) {
					this[callback]();
				} else {
					this.handleResetFirst();
				}
			}
		},
	};
};
export const mixins = {
	departList: departListMixin,
	saleDepartTree: saleDepartTreeMixin,
	handleSort: handleSortMixin
};

export const getDealCustomerQuery = (query) => {
	query = { ...query };
	delete query.seasons;
	delete query.time;
	if (query.type == 1) {
		delete query.year;
		delete query.season;
		delete query.month;
	} else if (query.type == 2) {
		delete query.season;
		delete query.month;
		if (!query.year) {
			query.type = 1;
			delete query.year;
		}
	} else if (query.type == 3) {
		delete query.year;
		delete query.month;
		if (!query.season) {
			query.type = 1;
			delete query.season;
		}
	} else if (query.type == 4) {
		delete query.year;
		delete query.season;
		if (!query.month) {
			query.type = 1;
			delete query.month;
		}
	}
	return query;
};
export const getDealFilterQuery = (query) => {
	query = { ...query };
	const season = query.seasons.split(';');
	season[0] = +season[0] || '';
	return {
		time: {
			year: +query.year,
			season,
			month: query.month
		},
		type: +query.type,
		depart_id: +query.depart_id || '',
	};
};