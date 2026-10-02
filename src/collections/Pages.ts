import type { CollectionConfig } from 'payload'
import { publishedOrStaff, staffOnly } from '../access'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: { group: 'Website', useAsTitle: 'title', defaultColumns: ['title', 'slug', '_status', 'updatedAt'] },
  access: { read: publishedOrStaff, create: staffOnly, update: staffOnly, delete: staffOnly },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true, admin: { description: 'For new top-level pages only. Built-in paths such as /about and /contact remain code-managed.' } },
    { name: 'summary', type: 'textarea' },
    { name: 'hero', type: 'group', fields: [
      { name: 'eyebrow', type: 'text' },
      { name: 'heading', type: 'text' },
      { name: 'subheading', type: 'textarea' },
      { name: 'image', type: 'upload', relationTo: 'media' },
    ] },
    { name: 'layout', type: 'blocks', blocks: [
      { slug: 'richText', labels: { singular: 'Rich text section', plural: 'Rich text sections' }, fields: [
        { name: 'heading', type: 'text' }, { name: 'content', type: 'richText', required: true },
      ] },
      { slug: 'imageText', labels: { singular: 'Image and text', plural: 'Image and text sections' }, fields: [
        { name: 'heading', type: 'text', required: true }, { name: 'content', type: 'richText' }, { name: 'image', type: 'upload', relationTo: 'media' },
      ] },
      { slug: 'cards', labels: { singular: 'Card grid', plural: 'Card grids' }, fields: [
        { name: 'heading', type: 'text' }, { name: 'items', type: 'array', fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea' }, { name: 'image', type: 'upload', relationTo: 'media' }, { name: 'link', type: 'text' }] },
      ] },
      { slug: 'callToAction', labels: { singular: 'Call to action', plural: 'Calls to action' }, fields: [
        { name: 'heading', type: 'text', required: true }, { name: 'text', type: 'textarea' }, { name: 'label', type: 'text' }, { name: 'url', type: 'text' },
      ] },
    ] },
  ],
  versions: { drafts: { autosave: { interval: 1500 } } },
}
