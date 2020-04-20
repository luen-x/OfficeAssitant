import { Tooltip } from "iview";

export default {
	data() {
		return {
			columns: [],
		};
	},
	computed: {
		getColumns() {
			let columns = this.type == 0 ? [
				{
					type: 'selection',
					fixed: 'left',
					minWidth: 50,
					align: 'center'
				},
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					minWidth: 100,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 130,
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 130,
				},
				{
					title: '课程名称',
					key: 'course_name',
					minWidth: 150,
					render: (h, params) => {
						const { course_list } = params.row;
						let content = course_list.length ? course_list.map(v => v.course_name) : [];
						return (
							<div>
								{
									content.length
										? <div class="g-flex-ac">
											<span>
												{ course_list[0].course_name.length <= 10
													? <Tooltip class="g-pointer" transfer>
														{course_list[0].course_name.slice(0, 10) + '...'}
														<div slot="content">
															{
																<div>{
																	course_list.map((item, index) => <div key={index}>{
																		<span>{item.course_name.slice(0, 10)
																			+ '...(' + item.study_type_name + ')'
																			+ item.lecture_name}</span>
																	}</div>) 
																}
																</div>
															}
														</div>
													</Tooltip>
													: <Tooltip class="g-pointer" transfer>
														{course_list[0].course_name.slice(0, 10) + '...'}
														<div slot="content">
															{
																<div>{
																	course_list.map((item, index) => <div key={index}>{
																		<span>{item.course_name.slice(0, 10)
																			+ '...(' + item.study_type_name + ')'
																			+ item.lecture_name}</span>
																	}</div>) 
																}
																</div>
															}
														</div>>
													</Tooltip>
												}
											</span>
										</div> : <span></span>
								}
							</div>
							
						);
					}
				},
				{
					title: '来源',
					key: 'user_source_name',
					minWidth: 100,
				},
				{
					title: '师傅',
					key: 'master_name',
					minWidth: 100,
				},
				{
					title: '操作时间',
					key: 'update_time',
					minWidth: 200,
					render: (h, params) => {
						const { course_list } = params.row;
						let update_time = course_list[0].update_time;
						return (
							<div class="g-flex-ac">
								<span>
									{ update_time }
								</span>
							</div>
						);
					}
				}
			] : [
				{
					type: 'selection',
					fixed: 'left',
					minWidth: 50,
					align: 'center'
				},
				{
					title: '姓名',
					key: 'staff_name',
					fixed: 'left',
					minWidth: 100,
				},
				{
					title: '部门',
					key: 'depart_name',
					minWidth: 130,
				},
				{
					title: '手机号码',
					key: 'mobile',
					minWidth: 130,
				},
				{
					title: '人才梯队',
					key: 'echelon_name',
					minWidth: 100,
				},
				{
					title: '学习类型',
					key: 'study_type_name',
					minWidth: 100,
				},
				{
					title: '来源',
					key: 'user_source_name',
					minWidth: 100,
				},
				{
					title: '师傅',
					key: 'master_name',
					minWidth: 100,
				},
				{
					title: '操作时间',
					key: 'update_time',
					minWidth: 150,
				}
			];
			return columns;
		}
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_TRAIN_DETAIL_PARTICIPATE_0_ROSTER_LIST_RESET', { course_id: this.course_id });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
	}
};

