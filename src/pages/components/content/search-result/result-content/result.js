import { All, System, Service, Sale, Customer, Staff, Consult, Material, Product, Example } from './tabs';

const getTabs = [
	{
		label: '全部',
		value: '1',
		Component: All
	},
	{
		label: '系统功能',
		value: '2',
		Component: System
	}, 
	{
		label: '服务工具包',
		value: '3',
		Component: Service,
	}, 
	{
		label: '销售工具包',
		value: '4',
		Component: Sale
	}, 
	// {
	// 	label: '客户',
	// 	value: '5',
	// 	Component: Customer
	// }, 
	{
		label: '员工',
		value: '6',
		Component: Staff
	}
	// {
	// 	label: '资讯',
	// 	value: '7',
	// 	Component: Consult
	// } 
	// {
	// 	label: '素材',
	// 	value: '8',
	// 	Component: Material
	// }, 
	// {
	// 	label: '产品',
	// 	value: '9',
	// 	Component: Product
	// }, 
	// {
	// 	label: '客户案例',
	// 	value: '10',
	// 	Component: Example
	// } 
];
export default {
	data() {
		return {
			getTabs
		};
	},
};