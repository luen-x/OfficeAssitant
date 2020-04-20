import { Participant } from "./popup/participant";

export default {
	methods: {
		getColumns(type) {
			let columns = [];
			switch (+type) {
				case 1:
					columns = [
						{
							title: '课程名称',
							key: 'course_name',
							minWidth: 220,
							fixed: "left"
						},
						{
							title: '授课讲师',
							key: 'lecture',
							minWidth: 100
						},
						{
							title: '授课时间',
							key: 'start_time',
							minWidth: 120
						},
						{
							title: '参与人数',
							key: 'participator_count',
							minWidth: 100
						},
						{
							title: '参与人员',
							key: 'participator',
							minWidth: 220,
							render: (h, params) => {
								let participator = [];
								let participatorString = "";

								params.row.participator && params.row.participator.forEach(item => {
									participator.push(item.staff_name);
								});

								participatorString = participator.join('、');

								return (
									<div
										class="g-operation"
										onClick={() => { this.handleOperate(participator); }}
									>
										{
											participatorString && participatorString.length > 18
												? <div>{participatorString.slice(0, 18)}...</div>
												: <div>{participatorString}</div>
										}
									</div>
								);
							}
						}
					];

					break;

				case 2:
				case 3:
					columns = [
						{
							title: '课程名称',
							key: 'course_name',
							minWidth: 220,
							fixed: "left"
						},
						{
							title: '授课讲师',
							key: 'lecture',
							minWidth: 100
						},
						{
							title: '授课时间',
							key: 'start_time',
							minWidth: 250,
							render: (h, params) => {
								return (
									<div>{params.row.start_time}~{params.row.end_time}</div>
								);
							}
						},
						{
							title: '授课地点',
							key: 'address',
							minWidth: 100
						},
						{
							title: '参与人数',
							key: 'participator_count',
							minWidth: 120,
							render: (h, params) => {
								return (
									<div
										class="g-operation"
										onClick={() => {
											this.$router.push({
												path: '/academy/train/plan/detail/participate',
												query: {
													course_id: params.row.course_id,
													type: 2
												}
											});
										}}
									>
										{params.row.participator_count}
									</div>
								);
							}
						},
						{
							title: '实际出勤人数',
							key: 'participator_count',
							minWidth: 120,
							render: (h, params) => {
								return (
									<div
										class="g-operation"
										onClick={() => {
											this.$router.push({
												path: '/academy/train/plan/detail/sign',
												query: {
													course_id: params.row.course_id,
													type: 2
												}
											});
										}}
									>
										{params.row.attendance_count}
									</div>
								);
							}
						},
						{
							title: '上传作业人数',
							key: 'upload_count',
							minWidth: 120,
							render: (h, params) => {
								return (
									<div
										class="g-operation"
										onClick={() => {
											this.$router.push({
												path: '/academy/train/plan/detail/exam',
												query: {
													course_id: params.row.course_id,
													is_upload: 1
												}
											});
										}}
									>
										{params.row.upload_count}
									</div>
								);
							}
						},
						{
							title: '未上传作业人数',
							key: 'no_upload_count',
							minWidth: 120,
							render: (h, params) => {
								return (
									<div
										class="g-operation"
										onClick={() => {
											this.$router.push({
												path: '/academy/train/plan/detail/exam',
												query: {
													course_id: params.row.course_id,
													is_upload: '0'
												}
											});
										}}
									>
										{params.row.no_upload_count}
									</div>
								);
							},
						},
						{
							title: '作业通关人数',
							key: 'pass_count',
							minWidth: 120
						},
						{
							title: '出勤率',
							key: 'attendance',
							minWidth: 100
						},
						{
							title: '通关率',
							key: 'pass_rate',
							minWidth: 100
						},
						{
							title: '操作',
							key: '',
							minWidth: 100,
							fixed: 'right',
							render: (h, params) => {
								if (this.$auth[1656]) {
									return (
										<div
											class="g-operation"
											onClick={() => {
												this.$router.push({
													path: '/academy/statistics/course/type',
													query: {
														course_name: params.row.course_name,
														train_course_type: params.row.train_course_type,
														course_id: params.row.course_id
													}
												});
											}}
										>
											查看详情
										</div>
									);
								} else {
									return null;
								}
							}
						}

					];

					break;
				case 4:
					columns = [
						{
							type: "selection",
							fixed: "left",
							width: 50
						},
						{
							title: '课程名称',
							key: 'course_name',
							minWidth: 220,
							fixed: "left"
						},
						{
							title: '培训类型',
							key: 'type_name',
							minWidth: 100
						},
						{
							title: '授课讲师',
							key: 'lecture',
							minWidth: 120
						},
						{
							title: '授课时间',
							key: 'start_time',
							minWidth: 250,
							render: (h, params) => {
								return (
									<div>{params.row.start_time}~{params.row.end_time}</div>
								);
							}
						},
						{
							title: '授课地点',
							key: 'address',
							minWidth: 100
						},
						{
							title: '参与人数',
							key: 'participator_count',
							minWidth: 100
						},
						{
							title: '实际出勤人数',
							key: 'participator_count',
							minWidth: 100
						},
						{
							title: '上传作业人数',
							key: 'upload_count',
							minWidth: 100
						},
						{
							title: '未上传作业人数',
							key: 'no_upload_count',
							minWidth: 100
						},
						{
							title: '作业通关人数',
							key: 'pass_count',
							minWidth: 100
						},
						{
							title: '出勤率',
							key: 'attendance',
							minWidth: 100
						},
						{
							title: '通关率',
							key: 'attendance',
							minWidth: 100
						}
					];

					break;

				default:
					break;
			}

			return columns;
		},
		handleResetFirst() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('ACADEMY_STATISTICS_COURSE_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOperate(participator) {
			Participant.popup({
				participator
			}).then();
		}
	}
};