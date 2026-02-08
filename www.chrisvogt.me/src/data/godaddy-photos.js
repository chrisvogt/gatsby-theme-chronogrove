// GoDaddy office and SF Pride gallery for the About page
// Uses same format as blog post PhotoGallery: { src, width, height, title? }
// width/height are aspect-ratio integers for react-photo-gallery layout
//
// Cloudinary URLs use c_scale,h_900,f_auto (same as virgin-southern-caribbean album):
// - c_scale,h_900: scale to max height 900px to keep file size down
// - f_auto: serve WebP/AVIF when supported for smaller, modern formats

export const godaddyPhotos = [
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584492/chrisvogt-me/galleries/godaddy/godaddy-sf-pride-march.jpg',
    title: 'Marching with GoDaddy in SF Pride',
    width: 4,
    height: 3
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584491/chrisvogt-me/galleries/godaddy/godaddy-cart-pride.jpg',
    title: 'Me riding a GoDaddy kart in SF Pride',
    width: 3,
    height: 4
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584491/chrisvogt-me/galleries/godaddy/my-desk-before-covid.jpg',
    title: 'My desk in the SF office',
    width: 4,
    height: 3
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584492/chrisvogt-me/galleries/godaddy/godaddy-sf-office-science.jpg',
    title: 'The gang does science',
    width: 4,
    height: 3
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584491/chrisvogt-me/galleries/godaddy/whiteboarding.jpg',
    title: 'Dan, Nissim and Dick whiteboarding sprint plans',
    width: 4,
    height: 3
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_600,f_auto,q_auto/v1770584490/chrisvogt-me/galleries/godaddy/gaming-with-coworkers.jpg',
    title: 'Video game break in the office',
    width: 16,
    height: 9
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584492/chrisvogt-me/galleries/godaddy/techfest-2.jpg',
    title: 'GoDaddy TechFest 2018',
    width: 4,
    height: 3
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584497/chrisvogt-me/galleries/godaddy/godaddy-sf-holiday-party.jpg',
    title: 'GoDaddy SF holiday party photo booth',
    width: 3,
    height: 4
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770585984/chrisvogt-me/galleries/godaddy/chris-vogt-godaddy.jpg',
    title: 'Me',
    width: 3,
    height: 4
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584491/chrisvogt-me/galleries/godaddy/godaddy-sf-motivational-window.jpg',
    title: 'The Best Way To Complain Is To Make Things',
    width: 9,
    height: 16
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_600,f_auto,q_auto/v1770586161/chrisvogt-me/galleries/godaddy/board-games-at-work.jpg',
    title: 'Board games at work',
    width: 16,
    height: 9
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770586364/chrisvogt-me/galleries/godaddy/smores-at-work.jpg',
    title: 'Smores at work',
    width: 9,
    height: 16
  },
  {
    src: 'https://res.cloudinary.com/chrisvogt/image/upload/c_scale,h_900,f_auto/v1770584491/chrisvogt-me/galleries/godaddy/godaddy-kitten-mascot.jpg',
    title: 'That day we had a new kitten mascot',
    width: 3,
    height: 4
  }
]
