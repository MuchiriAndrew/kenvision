import type { GlobalConfig } from 'payload'
import { isAdmin, isStaff } from '../access'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  access: {
    read: () => true,
    update: ({ req }) => isStaff(req.user),
  },
  fields: [
    { name: 'siteName', type: 'text', required: true, defaultValue: 'Kenvision Techniks' },
    { name: 'tagline', type: 'text', defaultValue: 'Technology, expertise and training that build capability.' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'contact', type: 'group', fields: [
      { name: 'generalEmail', type: 'email', defaultValue: 'info@kenvisiontechniks.com' },
      { name: 'trainingEmail', type: 'email', defaultValue: 'ken_trainers@kenvisiontechniks.com' },
      { name: 'phone', type: 'text', defaultValue: '+254 725 579 251' },
      { name: 'trainingPhone', type: 'text', defaultValue: '+254 731 983 371' },
      { name: 'address', type: 'textarea', defaultValue: 'Q7–Q9 Feliz Building, Kahawa Sukari Avenue, Nairobi, Kenya' },
    ] },
    { name: 'socialLinks', type: 'array', fields: [{ name: 'label', type: 'text', required: true }, { name: 'url', type: 'text', required: true }] },
    { name: 'defaultMetaTitle', type: 'text', defaultValue: 'Kenvision Techniks | Training & Technical Solutions' },
    { name: 'defaultMetaDescription', type: 'textarea', defaultValue: 'Professional training and technical solutions across East and Southern Africa.' },
    { name: 'defaultSocialImage', type: 'upload', relationTo: 'media' },
    { name: 'googleSiteVerification', type: 'text', admin: { description: 'Optional Search Console verification token.' } },
    { name: 'noIndexSite', type: 'checkbox', defaultValue: false, access: { update: ({ req }) => isAdmin(req.user) } },
  ],
}
