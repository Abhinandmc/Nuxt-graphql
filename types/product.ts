
export interface ProductImage {
  id: string
  url: string
  alt: string
}

export interface ProductVariant {
  id: string
  name: string
  sku: string
  price: number
  stock: number
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  category: string
  categorySlug: string
  featured: boolean
  images: ProductImage[]
  variants: ProductVariant[]
}
