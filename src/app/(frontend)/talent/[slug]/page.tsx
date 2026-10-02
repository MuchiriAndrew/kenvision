import { redirect } from 'next/navigation'
export default async function TalentCourseAlias({params}:{params:Promise<{slug:string}>}){const {slug}=await params;redirect(`/training/${slug}`)}
