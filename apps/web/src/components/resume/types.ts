import z from "zod";

export const TaskTypeZodType = z.enum(["Development", "Management"]);
export const TaskTypeEnum = TaskTypeZodType.enum;
export type TTaskTypeEnum = z.infer<typeof TaskTypeZodType>;

export const TaskZodType = z.object({
  type: TaskTypeZodType,
  text: z.string(),
  techUsed: z.array(z.string()).optional(),
});

export const ExperienceZodType = z.object({
  title: z.string(),
  period: z.string(),
  links: z.array(z.string()),
  tasks: z.array(TaskZodType),
  productGoal: z.string().optional(),
  myRole: z.string().optional(),
});
export type TExperience = z.infer<typeof ExperienceZodType>;

export const ExperiencesZodType = z.object({
  title: z.string(),
  theProduct: z.string(),
  myRole: z.string(),
  current: ExperienceZodType,
  past: z.array(ExperienceZodType)
});

export const StudyZodType = z.object({
  title: z.string(),
  period: z.string()
});

export const StudiesZodType = z.object({
  title: z.string(),
  current: StudyZodType.optional(),
  past: z.array(StudyZodType)
});

export const ProjectZodType = z.object({
  title: z.string(),
  period: z.string(),
  links: z.array(z.string()),
  tasks: z.array(TaskZodType).optional()
});
export type TProject = z.infer<typeof ProjectZodType>

export const ProjectsZodType = z.object({
  title: z.string(),
  current: z.array(ProjectZodType)
});

export type TProjects = z.infer<typeof ProjectsZodType>