import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/PageHero'
import { RichTextView } from '@/components/RichTextView'
import { getCmsCollection } from '@/lib/cms'
import { entryMetadata } from '@/lib/seo'
type Props={params:Promise<{slug:string}>}
async function load(slug:string){return (await getCmsCollection('insights')).find((item)=>item.slug===slug)}
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const post=await load(slug);return post?entryMetadata(post,{title:String(post.title),description:String(post.excerpt)},`/insights/${slug}`,'article'):{title:'Insight not found'}}
export default async function InsightPage({params}:Props){const {slug}=await params;const post=await load(slug);if(!post)notFound();return <><PageHero eyebrow="Kenvision Insights" title={String(post.title)} description={String(post.excerpt)}/><section className="section section--white"><div className="container"><article className="prose"><p>{post.publishedAt?new Date(String(post.publishedAt)).toLocaleDateString('en-KE',{dateStyle:'long'}):'Kenvision Techniks'}</p><RichTextView value={post.content}/></article></div></section></>}
