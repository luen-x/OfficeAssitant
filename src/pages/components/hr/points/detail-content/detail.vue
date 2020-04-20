<script>
import { Tabs, TabPane } from 'iview';
// import First from './tabs/demand';
import Detail from './detail';

export default {
	name: 'hr-detail-drawer-content',
	mixins: [Detail],
	props: {
		name: String,
		type: String,
		contract_company_id: String,
		label: {
			type: String,
			default: "1"
		}
	},
	data() {
		return {
			tab: this.label
		};
	},
	methods: {
		handleChange(value) {
			this.tab = value;
		}
	},
	render(h) {
		return (
			<Tabs onOn-click={this.handleChange} value={this.tab}>
				{
					this.getTabs && this.getTabs.map((item, index) => {
						const Component = item.Component;
						return (
							<TabPane label={item.label} name={item.value}>
								<Component 
									type={this.type} 
									contract_company_id={this.contract_company_id} 
									showItem={ this.tab === item.value }
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

<style lang="scss">

</style>
