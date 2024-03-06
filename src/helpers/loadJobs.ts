import { Collection } from 'discord.js';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { CronJob } from '../interfaces/Job.interface';

interface ImportedCronJob {
  default: CronJob;
}

export type JobCollection = Collection<string, CronJob>;
export default async function loadJobs(): Promise<JobCollection> {
  const jobs = new Collection<string, CronJob>();
  // const files = (await readdir(path.join(__dirname, '../cronJobs'))).filter(
  //   (name: string) => name.endsWith('.ts') || name.endsWith('.js'),
  // );
  // const imports: ImportedCronJob[] = await Promise.all(
  //   files.map(
  //     (job) => import(path.relative(__dirname, `../cronJobs/${job}`)) as Promise<ImportedCronJob>,
  //   ),
  // );
  // imports.forEach((job) => {
  //   jobs.set(job.default.name, job.default);
  // });
  return jobs;
}
