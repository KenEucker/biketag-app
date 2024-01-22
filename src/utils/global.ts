import { BikeTagDefaults } from 'biketag-vue'

// Get logo url
export const getLogoUrl = (
  logo: string,
  size = '',
  sanityBaseCDNUrl = BikeTagDefaults.sanityBaseCDNUrl
) => {
  switch (size) {
    case 'l':
      size = 'h=512'
      break
    case 'm':
      size = 'h=256'
      break
    case 's':
      size = 'h=192'
      break
    default:
      size = 'h=45'
      break
  }
  return logo?.length
    ? `${sanityBaseCDNUrl}${logo
        .replace('image-', '')
        .replace('-png', '.png')
        .replace('-webp', '.webp')
        .replace('-jpg', '.jpg')}${size.length ? `?${size}` : ''}`
    : BikeTagDefaults.logo
}

// Get thumnail for game tag detail
export const getThumbnail = (imgUrl: string) => {
  const imgType = imgUrl.lastIndexOf('.')
  return `${imgUrl.slice(0, imgType)}s${imgUrl.slice(imgType)}`
}

// Get time for game tag detail
export const getLocalDateTime = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleTimeString()

// Get date for game tag detail
export const getLocalDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString()
