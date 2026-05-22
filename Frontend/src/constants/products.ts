// src/constants/products.ts

export const PRODUCT_CATEGORIES = [
  {
    title: 'สินค้าทั้งหมด',
    type: '',
    path: 'all',
    items: [
      { name: 'สินค้ามาใหม่', type: 'New Arrivals', path: 'new-arrivals' },
    ]
  },
  {
    title: 'ของที่ระลึก',
    type: 'Merch',
    path: 'merch',
    items: [
      { name: 'สแตนดี้อะคริลิก', type: 'Acrylic Stand', path: 'acrylic_stand' },
      { name: 'พวงกุญแจ', type: 'Keychain', path: 'keychain' },
      { name: 'สติกเกอร์', type: 'Sticker', path: 'sticker' },
      { name: 'โฟโต้การ์ด', type: 'Photocard', path: 'photocard' }
    ]
  },
  {
    title: 'เครื่องแต่งกาย',
    type: 'Apparel',
    path: 'apparel',
    items: [
      { name: 'เสื้อยืด', type: 'T-shirt', path: 't-shirt' },
      { name: 'เสื้อแจ็คเก็ต', type: 'Jacket', path: 'jacket' },
      { name: 'เครื่องประดับ', type: 'Accessories', path: 'accessories' },
      { name: 'สินค้าลิมิเต็ด', type: 'Limited', path: 'limited' }
    ]
  },
  {
    title: 'ของสะสม',
    type: 'Collectibles',
    path: 'collectibles',
    items: [
      { name: 'ฟิกเกอร์', type: 'Figure', path: 'figure' },
      { name: 'กล่องสุ่ม', type: 'Blind Box', path: 'blind-box' },
      { name: 'รุ่นลิมิเต็ด', type: 'Limited Edition', path: 'limited-edition' },
      { name: 'คอลเลกชันเซ็ต', type: 'Set Collection', path: 'set-collection' }
    ]
  },
  {
    title: 'สินค้าไลฟ์สไตล์',
    type: 'Lifestyle Goods',
    path: 'lifestyle-goods',
    items: [
      { name: 'แก้วและภาชนะ', type: 'Drinkware', path: 'drinkware' },
      { name: 'เครื่องเขียน', type: 'Stationery', path: 'stationery' },
      { name: 'ของตกแต่งบ้าน', type: 'Home Decor', path: 'home-decor' },
      { name: 'สินค้าเพื่อความผ่อนคลาย', type: 'Comfort Goods', path: 'comfort-goods' }
    ]
  },
  {
    title: 'สินค้าดิจิทัล',
    type: 'Digital Goods',
    path: 'digital-goods',
    items: [
      { name: 'วอลเปเปอร์', type: 'Wallpaper', path: 'wallpaper' },
      { name: 'วอยซ์แพ็ก', type: 'Voice Pack', path: 'voice-pack' },
      { name: 'ดิจิทัลอาร์ต', type: 'Digital Art', path: 'digital-art' },
      { name: 'แอสเซทวีทูเบอร์', type: 'VTuber Assets', path: 'vtuber-assets' }
    ]
  },
  {
    title: 'อีเวนต์และคอสเพลย์',
    type: 'Events & Cosplay',
    path: 'events-cosplay',
    items: [
      { name: 'คอสเพลย์', type: 'Cosplay', path: 'cosplay' },
      { name: 'สินค้าอีเวนต์', type: 'Event Goods', path: 'event-goods' },
      { name: 'สินค้าลิมิเต็ด', type: 'Limited', path: 'limited' },
      { name: 'คอมมิชชัน', type: 'Commission', path: 'commission' }
    ]
  }
];

export const CATEGORY_FILTERS = [
  { title: 'Merch', type: 'merch' },
  { title: 'Apparel', type: 'apparel' },
  { title: 'Collectible', type: 'collectible' },
  { title: 'Lifestyle Goods', type: 'lifestyle_goods' },
  { title: 'Digital Goods', type: 'digital_goods' },
  { title: 'Events & Cosplay', type: 'events_cosplay' }
];

export const RECOMMENDED_CATEGORIES = [
  { 
    items6: [
      { name: 'สแตนดี้อะคริลิก', type: 'Acrylic Stand', img: 'https://picsum.photos/200/120?sig=1', path: 'acrylic_stand', catPath: 'merch' },
      { name: 'พวงกุญแจ', type: 'Keychain', img: 'https://picsum.photos/200/120?sig=2', path: 'keychain', catPath: 'merch' },
      { name: 'คอสเพลย์', type: 'Cosplay', img: 'https://picsum.photos/200/120?sig=11', path: 'cosplay', catPath: 'events-cosplay' },
      { name: 'กล่องสุ่ม', type: 'Blind Box', img: 'https://picsum.photos/200/120?sig=12', path: 'blind-box', catPath: 'collectibles' },
      { name: 'รุ่นลิมิเต็ด', type: 'Limited Edition', img: 'https://picsum.photos/200/120?sig=13', path: 'limited-edition', catPath: 'collectibles' },
      { name: 'ดิจิทัลอาร์ต', type: 'Digital Art', img: 'https://picsum.photos/200/120?sig=14', path: 'digital-art', catPath: 'digital-goods' }
    ] 
  },
  { 
    items8: [
      { name: 'เสื้อยืด', type: 'T-shirt', img: 'https://picsum.photos/200/120?sig=3', path: 't-shirt', catPath: 'apparel' },
      { name: 'เสื้อแจ็คเก็ต', type: 'Jacket', img: 'https://picsum.photos/200/120?sig=4', path: 'jacket', catPath: 'apparel' },
      { name: 'ฟิกเกอร์', type: 'Figure', img: 'https://picsum.photos/200/120?sig=5', path: 'figure', catPath: 'collectibles' },
      { name: 'กล่องสุ่ม', type: 'Blind Box', img: 'https://picsum.photos/200/120?sig=6', path: 'blind-box', catPath: 'collectibles' },
      { name: 'วอลเปเปอร์', type: 'Wallpaper', img: 'https://picsum.photos/200/120?sig=7', path: 'wallpaper', catPath: 'digital-goods' },
      { name: 'วอยซ์แพ็ก', type: 'Voice Pack', img: 'https://picsum.photos/200/120?sig=8', path: 'voice-pack', catPath: 'digital-goods' },
      { name: 'แก้วและภาชนะ', type: 'Drinkware', img: 'https://picsum.photos/200/120?sig=9', path: 'drinkware', catPath: 'lifestyle-goods' },
      { name: 'เครื่องเขียน', type: 'Stationery', img: 'https://picsum.photos/200/120?sig=10', path: 'stationery', catPath: 'lifestyle-goods' }
    ] 
  }
];