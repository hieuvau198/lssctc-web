// Null-initialized models for Program module (mirror C# DTOs)

export const ProgramDto = {
	Id: null,
	Name: null,
	Description: null,
	IsDeleted: null,
	IsActive: null,
	DurationHours: null,
	TotalCourses: null,
	ImageUrl: null,
	Courses: null, // ICollection<ProgramCourseDto>
	Prerequisites: null, // ICollection<EntryRequirementDto>
};

export const CreateProgramDto = {
	Name: null,
	Description: null,
	DurationHours: null,
	ImageUrl: null,
};

export const UpdateProgramDto = {
	Name: null,
	Description: null,
	ImageUrl: null,
	IsActive: null,
	Courses: null, // ICollection<ProgramCourseOrderDto>
	Prerequisites: null, // ICollection<UpdateProgramPrerequisiteDto>
};

export const ProgramCourseDto = {
	Id: null,
	CoursesId: null,
	CourseOrder: null,
	Name: null,
	Description: null,
};

export const CourseOrderDto = {
	CourseId: null,
	Order: null,
};

export const ProgramCourseOrderDto = {
	CourseId: null,
	Order: null,
};

export const EntryRequirementDto = {
	Name: null,
	Description: null,
};

export const CreateProgramPrerequisiteDto = {
	Name: null,
	Description: null,
};

export const UpdateProgramPrerequisiteDto = {
	Id: null,
	Name: null,
	Description: null,
};

export const ProgramQueryParameters = {
	PageNumber: null,
	PageSize: null,
	SearchTerm: null,
	IsActive: null,
	IsDeleted: null,
	MinDurationHours: null,
	MaxDurationHours: null,
};

