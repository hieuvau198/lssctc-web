export const CourseDto = {
	Id: null,
	Name: null,
	Description: null,
	CategoryId: null,
	CategoryName: null,
	LevelId: null,
	LevelName: null,
	Price: null,
	IsActive: null,
	ImageUrl: null,
	DurationHours: null,
	CourseCodeId: null,
};

// ===== Course UI model (camelCase) =====
export const Course = {
	id: null,
	name: null,
	description: null,
	categoryId: null,
	categoryName: null,
	levelId: null,
	levelName: null,
	price: null,
	isActive: null,
	imageUrl: null,
	durationHours: null,
	courseCodeId: null,
};

// ===== CreateCourseDto =====
export const CreateCourseDto = {
	Name: null,
	Description: null,
	CategoryId: null,
	LevelId: null,
	Price: null,
	ImageUrl: null,
	DurationHours: null,
	CourseCodeId: null,
};

// ===== UpdateCourseDto =====
export const UpdateCourseDto = {
	Name: null,
	Description: null,
	CategoryId: null,
	LevelId: null,
	Price: null,
	IsActive: null,
	ImageUrl: null,
	DurationHours: null,
	CourseCodeId: null,
};

// ===== CourseQueryParameters =====
export const CourseQueryParameters = {
	PageNumber: null,
	PageSize: null,
	SearchTerm: null,
	CategoryId: null,
	LevelId: null,
	IsActive: null,
};

// ===== CourseCategory =====
export const CourseCategoryDto = {
	Id: null,
	Name: null,
	Description: null,
	Courses: null,
};

export const CourseCategory = {
	id: null,
	name: null,
	description: null,
	courses: null,
};

// ===== CourseLevel =====
export const CourseLevelDto = {
	Id: null,
	Name: null,
	Description: null,
	Courses: null,
};

export const CourseLevel = {
	id: null,
	name: null,
	description: null,
	courses: null,
};
