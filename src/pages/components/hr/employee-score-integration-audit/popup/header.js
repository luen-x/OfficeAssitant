export default {
	functional: true,
	props: {
		name: String,
		staffId: Number,
		info: Object,
	},
	render: (h, ctx) => {
		const { info = {} } = ctx.props;
		return <div class="v-hr-employee-score-integration-audit-header">
			<div class="_detail-header">
				{ info.staff_name }
			</div>
			<div class="g-flex g-fw-w g-m-t-20">

				<span class="_item">
					<span>手机号码：</span>
					<span>{ info.mobile }</span>
				</span>
				<span class="_item">
					<span>所属部门：</span>
					<span>{ info.depart_name }</span>
				</span>
				<span class="_item">
					<span>职位：</span>
					<span>{ info.position_name }</span>
				</span>
				<span class="_item">
					<span>总积分：</span>
					<span>{ info.total_points }</span>
				</span>
				<span class="_item">
					<span>总服务积分：</span>
					<span>{ info.total_service_points }</span>
				</span>
			</div>
	  </div>;
	}
};