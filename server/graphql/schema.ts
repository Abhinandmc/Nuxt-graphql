
export const typeDefs = /* GraphQL */ `
  type Category {
    id: ID!
    name: String!
    slug: String!
  }

  type ProductVariant {
    id: ID!
    name: String!
    sku: String!
    pricePaise: Int!
    stock: Int!
  }

  type ProductImage {
    id: ID!
    url: String!
    alt: String!
  }

  type Product {
    id: ID!
    name: String!
    slug: String!
    description: String!
    featured: Boolean!
    category: Category
    variants: [ProductVariant!]!
    images: [ProductImage!]!
  }

  type ProductPage {
    items: [Product!]!
    total: Int!
    page: Int!
    limit: Int!
    totalPages: Int!
  }

  type Query {
    products(
      search: String
      category: String
      sort: String
      page: Int
      limit: Int
      minPrice: Int
      maxPrice: Int
    ): ProductPage!

    product(slug: String!): Product
    categories: [Category!]!
  }
`
