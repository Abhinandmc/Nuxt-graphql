
import type { Product } from '~/types/product'

export const products: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    slug: 'wireless-headphones',
    description:
      'Comfortable wireless headphones with rich sound for everyday listening.',
    category: 'Electronics',
    categorySlug: 'electronics',
    featured: true,
    images: [
      {
        id: 'img1',
        url: 'https://placehold.co/800x800?text=Headphones',
        alt: 'Wireless headphones',
      },
    ],
    variants: [
      {
        id: 'v1',
        name: 'Black',
        sku: 'HEADPHONES-BLK',
        price: 499900,
        stock: 10,
      },
      {
        id: 'v2',
        name: 'White',
        sku: 'HEADPHONES-WHT',
        price: 529900,
        stock: 5,
      },
    ],
  },
  {
    id: 'p2',
    name: 'USB-C Charger',
    slug: 'usb-c-charger',
    description:
      'Compact USB-C charger for compatible phones and other devices.',
    category: 'Accessories',
    categorySlug: 'accessories',
    featured: true,
    images: [
      {
        id: 'img2',
        url: 'https://placehold.co/800x800?text=Charger',
        alt: 'USB-C charger',
      },
    ],
    variants: [
      {
        id: 'v3',
        name: '30W',
        sku: 'CHARGER-30W',
        price: 149900,
        stock: 25,
      },
    ],
  },
  {
    id: 'p3',
    name: 'Mechanical Keyboard',
    slug: 'mechanical-keyboard',
    description:
      'A mechanical keyboard designed for typing and gaming.',
    category: 'Electronics',
    categorySlug: 'electronics',
    featured: false,
    images: [
      {
        id: 'img3',
        url: 'https://placehold.co/800x800?text=Keyboard',
        alt: 'Mechanical keyboard',
      },
    ],
    variants: [
      {
        id: 'v4',
        name: 'Standard',
        sku: 'KEYBOARD-STD',
        price: 349900,
        stock: 8,
      },
    ],
  },
  {
    id: 'p4',
    name: 'Laptop Sleeve',
    slug: 'laptop-sleeve',
    description:
      'A protective sleeve for carrying your laptop.',
    category: 'Accessories',
    categorySlug: 'accessories',
    featured: false,
    images: [
      {
        id: 'img4',
        url: 'https://placehold.co/800x800?text=Laptop+Sleeve',
        alt: 'Laptop sleeve',
      },
    ],
    variants: [
      {
        id: 'v5',
        name: '13-inch',
        sku: 'SLEEVE-13',
        price: 99900,
        stock: 15,
      },
      {
        id: 'v6',
        name: '15-inch',
        sku: 'SLEEVE-15',
        price: 119900,
        stock: 12,
      },
    ],
  },
]

export const categories = [
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Accessories', slug: 'accessories' },
]
