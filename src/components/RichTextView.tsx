import type { ReactNode } from 'react'
type Node={type?:string;text?:string;format?:number;tag?:string;url?:string;children?:Node[];listType?:string}
function renderNode(node:Node,key:string):ReactNode {
  if(node.type==='text') { let out:ReactNode=node.text||''; if((node.format||0)&16)out=<code key={`${key}c`}>{out}</code>;if((node.format||0)&8)out=<u key={`${key}u`}>{out}</u>;if((node.format||0)&2)out=<em key={`${key}i`}>{out}</em>;if((node.format||0)&1)out=<strong key={`${key}b`}>{out}</strong>;return out }
  const children=(node.children||[]).map((child,index)=>renderNode(child,`${key}-${index}`))
  switch(node.type){case'heading':{const tag=node.tag||'h2';if(tag==='h1')return <h2 key={key}>{children}</h2>;if(tag==='h3')return <h3 key={key}>{children}</h3>;return <h2 key={key}>{children}</h2>}case'quote':return <blockquote key={key}>{children}</blockquote>;case'list':return node.listType==='number'?<ol key={key}>{children}</ol>:<ul key={key}>{children}</ul>;case'listitem':return <li key={key}>{children}</li>;case'link':case'autolink':return <a key={key} href={node.url} rel="nofollow">{children}</a>;case'linebreak':return <br key={key}/>;case'paragraph':return <p key={key}>{children}</p>;default:return <div key={key}>{children}</div>}
}
export function RichTextView({value}:{value:unknown}){const root=(value as {root?:Node}|null)?.root;if(!root?.children?.length)return null;return <>{root.children.map((node,index)=>renderNode(node,`rt-${index}`))}</>}
