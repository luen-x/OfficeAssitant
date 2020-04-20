import { 
	Customer, Delivery, Demand, 
	Supplement, Service, Elec, Paper,
	Info, RefundType, Achi, AchiDetail,
	SuppleInfo, Record, OtherContract, Company,
	Audit
} from './tabs';

const contractTabs = [
	{
		label: '审核信息',
		Component: Audit,
		value: '1'
	},
	{
		label: '项目需求',
		Component: Demand,
		value: '2'
	}, 
	{
		label: '客户信息',
		Component: Customer,
		value: '3'
	}, 
	{
		label: '服务提成',
		Component: Service,
		value: '4'
	}, 
	{
		label: '到账记录',
		Component: Achi,
		value: '5',
	},
	{
		label: '补款记录',
		Component: Supplement,
		value: '6'
	}, 
	{
		label: '交付完成表',
		Component: Delivery,
		value: '7'
	},
	{
		label: '其他合同',
		Component: OtherContract,
		value: '8'
	}
];

const elecTabs = [
	{
		label: '客户信息',
		Component: Customer,
		value: '1'
	},
	{
		label: '项目需求',
		Component: Demand,
		value: '2'
	},
	{
		label: '纸质合同',
		Component: Paper,
		value: '3'
	}
];

const suppleContractTabs = [
	{
		label: '项目需求',
		Component: Demand,
		value: '1',
	},
	{
		label: '原项目需求',
		Component: Demand,
		value: '2',
	},
	{
		label: '产品更换记录',
		Component: Record,
		value: '3'
	}
];

const achiDetailTabs = [
	{
		label: '到账详情',
		Component: AchiDetail,
		value: '1'
	},
	{
		label: '到账记录',
		Component: Achi,
		value: '2'
	},
	{
		label: '客户公司',
		Component: Company,
		value: '3'
	}
];

const supplementTabs = [
	{
		label: '补款信息',
		Component: SuppleInfo,
		value: '1'
	},
	{
		label: '项目需求',
		Component: Demand,
		value: '2'
	},
	{
		label: '补款记录',
		Component: Supplement,
		value: '3'
	},
	{
		label: '到账记录',
		Component: Achi,
		value: '4'
	}
];

export default {
	data() {
		return {
			tabs: this.getTabs()
		};
	},
	methods: {
		getRefundTabs() {
			return ([
				{
					label: '退款信息',
					Component: RefundType,
					value: '1'
				},
				{
					label: '项目需求',
					Component: Demand,
					value: '2'
				},
				{
					label: '到账记录',
					Component: Achi,
					value: '3'
				}
			]);
		},
		getTabs() {
			let tabsHandled;
			switch (this.name) {
				case 'contract':
					switch (this.contractType) {
						case 4:
						case 0:
						case 1:
						case 2:
						case 3:
						default:
							tabsHandled = [...contractTabs];
							switch (this.type) {
								case '1':
								case '3':
									tabsHandled.splice(5, 2);
									tabsHandled.splice(3, 1);
									break;
								case '4':
								default:
									tabsHandled.splice(6, 1);
									break;
								case '2':
									break;
							}
							break;
					}
					break;
				case 'elec':
					tabsHandled = [...elecTabs];
					switch (this.type) {
						case '1':
						case '3':
							tabsHandled.splice(3, 1);
							break;
						default:
						case '2':
							break;
					}
					break;
				case 'discount':
					tabsHandled = [...elecTabs];
					tabsHandled.splice(2, 1);
					break;
				case 'refund':
					tabsHandled = this.getRefundTabs();
					switch (this.refundType) {
						case 3:
							tabsHandled.splice(1, 1);
							break;
						default: 
							break;
					}
					break;
				case 'deal-refund':
					tabsHandled = this.getRefundTabs();
					tabsHandled.splice(2, 1);
					switch (this.refundType) {
						case 3:
							tabsHandled.splice(1, 2);
							break;
						case 1:
						case 2:
						case 4:
						default: 
							break;
					}
					break;
				case 'payment':
					tabsHandled = achiDetailTabs;
					break;
				case 'supplement':
					tabsHandled = supplementTabs;
					break;
				default:
					break;
			}
			return tabsHandled;
		}
	},
};