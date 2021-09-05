export type JobsByType = {
  VISUAL_IDENTITY: number,
  BRAND_DESIGN: number,
  PACKAGING_DESIGN: number,
  NAMING: number,
  OTHERS: number,
}

export type JobsByStatus = {
  OPEN: number,
  DONE: number,
}

export type Jobs = {
  byType: JobsByType;
  byStatus: JobsByStatus;
}

export type DashboardJobs = {
  month: number;
  year: number;
  jobs: Jobs;
}
