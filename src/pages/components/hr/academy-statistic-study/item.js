import { Tooltip } from "iview";
import { getParseUrl, getHashUrl, setItem, getItem } from '@utils/utils';
import { StudentDetail } from './popup/student-detail';

export default {
	data() {
		return {
			columns: [
				{
					title: '姓名',
					key: 'staff_name',
					minWidth: 200,
					fixed: 'left',
					renderHeader: (h, params) => {
						return (
							<div style="marginLeft: 45px;fontWeight: normal">姓名</div>
						);
					},
					render: (h, params) => {
						const { staff_name, staff_status } = params.row;
						return (
							<div class="g-flex-ac g-pointer" onClick={() => this.handleOpenDrawer(params.row)}>
								{ staff_status == 4 ? <div class="g-m-r-5 g-remark">离职</div>
									: <div class="g-m-r-5 g-remark" style="opacity: 0">离职</div>}
								<span>
									{ staff_name.length <= 7
										? <span class="g-c-blue-light g-oneline">
											{staff_name}
										</span>
										: <span class="g-c-blue-light">{staff_name.slice(0, 7) + '...'}</span>
									}
								</span>
							</div>
						);
					}
				},
				{
					title: "部门",
					key: "depart_name",
					minWidth: 150,
				},
				{
					title: "手机号码",
					key: "mobile",
					minWidth: 150,
				},
				{
					title: "人才梯队",
					key: "echelon_name",
					minWidth: 150,
					render: (h, params) => {
						return (
							<div 
								class="g-operation"
								onClick={(e) => {
									e.stopPropagation();
									this.handleViewEchelon(params.row);
								}}
							>
								<span>{params.row.echelon_name}</span>
							</div>
						);
					}
				},
				{
					title: "课程名称",
					key: "position_name",
					minWidth: 200,
					render: (h, params) => {
						const { course } = params.row;
						let content = course.length ? course.map(v => v.course_name).filter((e, index) => index < 3) : [];
						return (
							<div>
								{
									content.length
										? <div class="g-flex-ac">
											<span>
												{ course[0].course_name.length <= 10
													? <Tooltip class="g-pointer" transfer>
														{course[0].course_name}
														<div slot="content">
															{content.map((item, index) => <div key={index}>
																{item.length < 15 ? item : item.slice(0, 15) + '...'}
															</div>)}
														</div>
													</Tooltip>
													: <Tooltip class="g-pointer" transfer>
														{course[0].course_name.slice(0, 10) + '...'}
														<div slot="content">
															{content.map((item, index) => <div key={index}>
																{item.length < 15 ? item : item.slice(0, 15) + '...'}
															</div>)}
														</div>
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
					title: "参与项目",
					key: "position_name",
					minWidth: 200,
					render: (h, params) => {
						const { project } = params.row;
						let name = project.map(v => v.type_name).join(',');
						return (
							<div class="g-flex-ac">
								<span>
									{ name.length <= 10
										? <Tooltip class="g-pointer" transfer>
											{name}
											<div slot="content">
												{project.map((item, index) => <div key={index}>{item.type_name}：{item.course_num}次</div>)}
											</div>
										</Tooltip>
										: <Tooltip class="g-pointer" transfer>
											{name.slice(0, 10) + '...'}
											<div slot="content">
												{project.map((item, index) => <div key={index}>{item.type_name}：{item.course_num}次</div>)}
											</div>
										</Tooltip>
									}
								</span>
							</div>
						);
					}
				},
				{
					title: "所的学分",
					key: "credit",
					minWidth: 100,
				}
			],
		};
	},
	methods: {
		handleResetFirst() {
			this.$store.commit('HR_ACADEMY_STATISTIC_STUDY_LIST_INIT');
		},
		handleResetCur() {
			this.$store.commit('HR_ACADEMY_STATISTIC_STUDY_LIST_RESET', { type: this.type });
		},
		handleLinkTo() {
			this.$router.push('/');
		},
		handleOpenDrawer(e) {
			StudentDetail.popup({ staff: e.staff_id, applicant: e.applicant_id }).then(res => {

			}).catch(err => {
			});
		},
		handleViewEchelon(row) {
			this.$router.push({
				path: '/hr/academy/statistic/study/detail',
				query: {
					staff_id: row.staff_id,
					applicant_id: row.applicant_id,
					echelon_id: row.echelon_id
				}
			});
		}
	}
};

