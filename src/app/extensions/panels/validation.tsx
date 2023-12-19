import * as z from "zod";

export const Project = z.object({
  title: z.string().min(1, "Please enter a title"),
  detail: z.string().min(3, "C'mon, at least try!"),
  image: z.object({
    type: z.literal("image"),
    url: z.string().url(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  day: z.number().min(1).max(31),
  symbol: z.string().max(2).emoji({ message: "Use a single emoji character" }),
});

export const runValidation = (formData, touched?: {}) => {
  let schema = Project;
  if (touched) {
    schema = Project.pick(touched);
  }
  const validation = schema.safeParse(formData);

  let success = validation.success;
  let fields = {};
  if (!validation.success) {
    fields = validation.error.flatten().fieldErrors;
  }

  return { success, fields };
};
