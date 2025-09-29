import React from "react";
import { Button, Alert, Pagination, Tooltip } from "antd";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ProgramCoursesForm = ({
  programCourses,
  setProgramCourses,
  handleRemoveCourse,
  coursesError,
  courseSearch,
  setCourseSearch,
  courseList,
  courseLoading,
  handleAddCourse,
  coursePage,
  setCoursePage,
  coursePageSize,
  setCoursePageSize,
  courseTotal,
}) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = Array.from(programCourses);
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setProgramCourses(reordered.map((c, idx) => ({ ...c, order: idx + 1 })));
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Courses in Program</h2>
        {programCourses.length === 0 && (
          <div className="text-gray-500 mb-2">
            No courses added yet. Use the list below to add courses.
          </div>
        )}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="courses">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {programCourses.map((c, idx) => (
                  <Draggable
                    key={c.courseId}
                    draggableId={String(c.courseId)}
                    index={idx}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`flex items-center gap-2 mb-2 bg-white border rounded px-2 py-1 transition-shadow ${
                          snapshot.isDragging
                            ? "shadow-lg ring-2 ring-blue-400"
                            : ""
                        }`}
                        style={provided.draggableProps.style}
                        aria-label={`Course ${c.name}, position ${idx + 1}`}
                      >
                        <Tooltip title="Drag to reorder">
                          <span
                            className="cursor-move text-gray-400 select-none"
                            aria-label="Drag handle"
                          >
                            ⠿
                          </span>
                        </Tooltip>
                        <span className="w-6 text-right font-mono">
                          {idx + 1}.
                        </span>
                        <span className="flex-1 font-medium">{c.name}</span>
                        <Button
                          danger
                          size="small"
                          aria-label={`Remove ${c.name}`}
                          onClick={() => handleRemoveCourse(c.courseId)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        {coursesError && (
          <Alert
            type="error"
            message={coursesError}
            className="mb-2"
            showIcon
          />
        )}
      </div>
      {/* Add Course Section */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Add Course</h2>
        <input
          type="text"
          placeholder="Type to search courses by name..."
          value={courseSearch}
          onChange={(e) => {
            setCourseSearch(e.target.value);
            setCoursePage(1);
          }}
          className="border rounded px-2 py-1 mb-2 w-full max-w-xs focus:ring focus:border-blue-400"
          aria-label="Search courses"
        />
        <div className="border rounded p-2 bg-gray-50">
          {courseLoading ? (
            <div className="flex items-center justify-center py-4">
              <span className="animate-pulse text-gray-400">
                Loading courses...
              </span>
            </div>
          ) : courseList.length === 0 ? (
            <div className="text-gray-500 py-4">No courses found.</div>
          ) : (
            courseList.map((course) => (
              <div
                key={course.id}
                className="flex items-center justify-between py-1 border-b last:border-b-0 hover:bg-blue-50 transition"
              >
                <span>
                  <span className="font-medium">{course.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({course.categoryName} - {course.levelName})
                  </span>
                </span>
                <Button
                  size="small"
                  type="primary"
                  aria-label={`Add ${course.name}`}
                  onClick={() => handleAddCourse(course)}
                  disabled={programCourses.some(
                    (c) => c.courseId === course.id
                  )}
                >
                  Add
                </Button>
              </div>
            ))
          )}
          <div className="flex justify-center mt-2">
            <Pagination
              current={coursePage}
              pageSize={coursePageSize}
              total={courseTotal}
              onChange={(page, size) => {
                setCoursePage(page);
                setCoursePageSize(size);
              }}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
              aria-label="Course list pagination"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgramCoursesForm;
