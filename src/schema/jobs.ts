import { z } from "zod";

export const JobSchema = z.object({   
  title: z.string().min(3, { message: "Job title must be at least 3 characters long" }),
  description: z.string().min(2, { message: "Job description is required" }),
  location: z.string().min(2, { message: "Job location is required" }),   
  salary: z.number().positive({message: "Salary must be a positive number."}).optional(),
  companyName: z.string().min(2, { message: "Company name is required" }),
  employmentType: z.enum(["FULL_TIME","PART_TIME","CONTRACT","INTERNSHIP",], {  
    message: "Employment type must be one of: full-time, part-time, contract, internship"
  }),
});   

