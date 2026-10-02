/** Server-side launch switch. Keep the LMS schema and implementation in place for the addon. */
export const isLmsEnabled = process.env.ENABLE_LMS === 'true'
