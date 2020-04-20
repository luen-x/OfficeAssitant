<script>
import { Tabs, TabPane } from 'iview';
import { createDecipheriv } from 'crypto';
import First from './tabs/demand';
import Detail from './detail';

export default {
	name: 'finance-detail-drawer-content',
	mixins: [Detail],
	props: {
		name: String,
		type: String,
		contractId: Number,
		refundId: Number,
		refundType: Number,
		companyId: Number,
		paymentId: Number,
		supplyId: Number,
		contractType: Number,
		electronicId: Number,
		discountId: Number,
		customerId: Number,
		dataInfo: Object
	},
	data() {
		return {
			label: "1",
		};
	},
	watch: {
		contractId() {
			this.label = '1';
		},
		refundId() {
			this.label = '1';
		},
	},
	mounted() {
	},
	methods: {
		handleChange(value) {
			this.label = value;
		},
	},
	render(h) {
		const tabs = this.getTabs();
		return (
			<Tabs onOn-click={this.handleChange} value={this.label} >
				{
					tabs && tabs.map((item, index) => {
						const Component = item.Component;
						return (
							<TabPane label={item.label} name={item.value}>
								<Component
									contractId={this.contractId}
									contractType={this.contractType}
									contratcType={this.contractType}
									isFinance={true}
									customerId={this.customerId}
									discountId={this.discountId}
									refundId={this.refundId}
									refundType={this.refundType}
									companyId={this.companyId}
									paymentId={this.paymentId}
									supplyId={this.supplyId}
									electronicId={this.electronicId}
									label={item.label}
									dataInfo={this.dataInfo}
									name={this.name}
									type={this.type}
									show={ this.label === item.value }
								/>
							</TabPane>
						);
					})
				}
			</Tabs>
		);
	}
};
</script>

<style lang="scss" >
</style>


