import type { AdminColNameOptions } from "@/locales/types.ts";

import type { ColName as AdminCoursesCourseTypesColName } from "@/components/admin/AdminCoursesCourseTypes.vue";
import type { ColName as AdminCoursesCoursesColName } from "@/components/admin/AdminCoursesCourses.vue";
import type { ColName as AdminCoursesDegreesColName } from "@/components/admin/AdminCoursesDegrees.vue";
import type { ColName as AdminCoursesProgramsColName } from "@/components/admin/AdminCoursesPrograms.vue";
import type { ColName as AdminCoursesTracksColName } from "@/components/admin/AdminCoursesTracks.vue";

export default {
  courses: {
    title: "Courses",
    degrees: {
      label: "Degrees",
      column: {
        name: {
          label: "Name",
          tooltip: "",
        },
        nameShort: {
          label: "Short name",
          tooltip: "",
        },
        visible: {
          label: "Visible",
          tooltip: "",
        },
      } satisfies Record<AdminCoursesDegreesColName, AdminColNameOptions>,
      form: {
        title: {
          none: "New degree",
          single: "{label}",
          multiple: "{count} degrees selected",
        },
      },
      data: {
        success: {
          insert:
            "No degree created | Degree created | {count} degrees created",
          update:
            "No degree updated | Degree updated | {count} degrees updated",
          delete:
            "No degree deleted | Degree deleted | {count} degrees deleted",
          import:
            "0 degree imported | 1 degree imported | {count} degrees imported",
          export:
            "0 degree exported | 1 degree exported | {count} degrees exported",
        },
        confirm: {
          delete: {
            single: `Are you sure you want to delete the degree "{label}"?
If this degree contains programs, you will not be able to delete it.`,
            multiple: `Are you sure you want to delete the {count} selected degrees?
If these degrees contain programs, you will not be able to delete them.`,
          },
        },
      },
    },
    programs: {
      label: "Programs",
      column: {
        degree: {
          label: "Degree",
          tooltip: "",
        },
        name: {
          label: "Name",
          tooltip: "",
        },
        nameShort: {
          label: "Short name",
          tooltip: "",
        },
        visible: {
          label: "Visible",
          tooltip: "",
        },
      } satisfies Record<AdminCoursesProgramsColName, AdminColNameOptions>,
      form: {
        title: {
          none: "New program",
          single: "{label}",
          multiple: "{count} programs selected",
        },
        error: {
          degreeNotFound: 'No degree with the name "{degree}" exists',
        },
      },
      data: {
        success: {
          insert:
            "No program created | Program created | {count} programs created",
          update:
            "No program updated | Program updated | {count} programs updated",
          delete:
            "No program deleted | Program deleted | {count} programs deleted",
          import:
            "0 program imported | 1 program imported | {count} programs imported",
          export:
            "0 program exported | 1 program exported | {count} programs exported",
        },
        confirm: {
          delete: {
            single: `Are you sure you want to delete the program "{label}"?
If there are tracks, courses, or coordinators for this program, you will not be able to delete it.`,
            multiple: `Are you sure you want to delete the {count} selected programs?
If there are tracks, courses, or coordinators for these programs, you will not be able to delete them.`,
          },
        },
      },
    },
    tracks: {
      label: "Tracks",
      column: {
        degree: {
          label: "Degree",
          tooltip: "",
        },
        program: {
          label: "Program",
          tooltip: "",
        },
        name: {
          label: "Name",
          tooltip: "",
        },
        nameShort: {
          label: "Short name",
          tooltip: "",
        },
        visible: {
          label: "Visible",
          tooltip: "",
        },
      } satisfies Record<AdminCoursesTracksColName, AdminColNameOptions>,
      form: {
        title: {
          none: "New track",
          single: "{label}",
          multiple: "{count} tracks selected",
        },
        error: {
          updateDegreeWithoutProgram:
            "You cannot modify the degree without selecting a program",
          updateProgramWithoutDegree:
            "You cannot modify the program without selecting a degree",
          degreeNotFound: 'No degree with the name "{degree}" exists',
          programNotFound:
            'No program in the degree "{degree}" with the name "{program}" exists',
        },
      },
      data: {
        success: {
          insert: "No track created | Track created | {count} tracks created",
          update: "No track updated | Track updated | {count} tracks updated",
          delete: "No track deleted | Track deleted | {count} tracks deleted",
          import:
            "0 track imported | 1 track imported | {count} tracks imported",
          export:
            "0 track exported | 1 track exported | {count} tracks exported",
        },
        confirm: {
          delete: {
            single: `Are you sure you want to delete the track "{label}"?
If there are courses or coordinators for this track, you will not be able to delete it.`,
            multiple: `Are you sure you want to delete the {count} selected tracks?
If there are courses or coordinators for these tracks, you will not be able to delete them.`,
          },
        },
      },
    },
    courses: {
      label: "Courses",
      column: {
        year: {
          label: "Year",
          tooltip: "",
        },
        degree: {
          label: "Degree",
          tooltip: "",
        },
        program: {
          label: "Program",
          tooltip: "",
        },
        track: {
          label: "Track",
          tooltip: "",
        },
        name: {
          label: "Name",
          tooltip: "",
        },
        nameShort: {
          label: "Short name",
          tooltip: "",
        },
        semester: {
          label: "Semester",
          tooltip: "",
        },
        type: {
          label: "Course type",
          tooltip: "",
        },
        hours: {
          label: "Hours",
          tooltip: "Number of hours per group",
        },
        hoursAdjusted: {
          label: "Adj. hrs.",
          tooltip: "Adjusted number of hours per group",
        },
        groups: {
          label: "Groups",
          tooltip: "Number of groups",
        },
        groupsAdjusted: {
          label: "Adj. grps.",
          tooltip: "Adjusted number of groups",
        },
        description: {
          label: "Description",
          tooltip: "",
        },
        priorityRule: {
          label: "Priority rule",
          tooltip: "Priority rule",
        },
        visible: {
          label: "Visible",
          tooltip: "",
        },
      } satisfies Record<AdminCoursesCoursesColName, AdminColNameOptions>,
      form: {
        title: {
          none: "New course",
          single: "{label}",
          multiple: "{count} courses selected",
        },
        error: {
          updateDegreeWithoutProgram:
            "You cannot modify the degree without selecting a program",
          updateProgramWithoutDegree:
            "You cannot modify the program without selecting a degree",
          updateTrackWithoutProgram:
            "You cannot modify the track without selecting a program",
          updateTrackWithoutDegree:
            "You cannot modify the track without selecting a degree",
          degreeNotFound: 'No degree with the name "{degree}" exists',
          programNotFound:
            'No program in the degree "{degree}" with the name "{program}" exists',
          trackNotFound:
            'No track in the program "{program}" of the degree "{degree}" with the name "{track}" exists',
          courseTypeNotFound: 'No course type with the label "{type}" exists',
          hoursNegative: "Enter a positive or zero number of hours",
          hoursAdjustedNegative:
            "Enter a positive or zero adjusted number of hours",
          groupsNegative: "Enter a positive or zero number of groups",
          groupsAdjustedNegative:
            "Enter a positive or zero adjusted number of groups",
          priorityRule: "The priority rule must be a positive integer or zero",
        },
      },
      data: {
        success: {
          insert:
            "No course created | Course created | {count} courses created",
          update:
            "No course updated | Course updated | {count} courses updated",
          delete:
            "No course deleted | Course deleted | {count} courses deleted",
          import:
            "0 course imported | 1 course imported | {count} courses imported",
          export:
            "0 course exported | 1 course exported | {count} courses exported",
        },
        confirm: {
          delete: {
            single: `Are you sure you want to delete the course "{label}"?
If there are requests, priorities, or coordinators for this course, you will not be able to delete it.`,
            multiple: `Are you sure you want to delete the {count} selected tracks?
If there are requests, priorities, or coordinators for these courses, you will not be able to delete them.`,
          },
        },
      },
    },
    courseTypes: {
      label: "Course types",
      column: {
        label: {
          label: "Label",
          tooltip: "",
        },
        coefficient: {
          label: "Coefficient",
          tooltip: "",
        },
        description: {
          label: "Description",
          tooltip: "",
        },
      } satisfies Record<AdminCoursesCourseTypesColName, AdminColNameOptions>,
      form: {
        title: {
          none: "New course type",
          single: "{label}",
          multiple: "{count} course types selected",
        },
      },
      data: {
        success: {
          insert:
            "No course type created | Course type created | {count} course types created",
          update:
            "No course type updated | Course type updated | {count} course types updated",
          delete:
            "No course type deleted | Course type deleted | {count} course types deleted",
          import:
            "0 course type imported | 1 course type imported | {count} course types imported",
          export:
            "0 course type exported | 1 course type exported | {count} course types exported",
        },
        confirm: {
          delete: {
            single: `Are you sure you want to delete the course type "{label}"?
If this type is assigned to courses, you will not be able to delete it.`,
            multiple: `Are you sure you want to delete the {count} selected course types?
If these types are assigned to courses, you will not be able to delete them.`,
          },
        },
      },
    },
  },
} as const;
