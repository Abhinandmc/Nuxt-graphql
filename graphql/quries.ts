
export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products(
    $search: String
    $category: String
    $sort: String
    $page: Int
    $limit: Int
    $minPrice: Int
    $maxPrice: Int
  ) {
    products(
      search: $search
      category: $category
      sort: $sort
      page: $page
      limit: $limit
      minPrice: $minPrice
      maxPrice: $maxPrice
    ) {
      total
      page
      limit
      totalPages
      items {
        id
        name
        slug
        description
        featured
        category {
          name
          slug
        }
        images {
          url
          alt
        }
        variants {
          id
          name
          sku
          pricePaise
          stock
        }
      }
    }
  }
`

export const CATEGORIES_QUERY = /* GraphQL */ `
  query Categories {
    categories {
      id
      name
      slug
    }
  }
`

export const PRODUCT_QUERY = /* GraphQL */ `
  query Product($slug: String!) {
    product(slug: $slug) {
      id
      name
      slug
      description
      featured
      category {
        name
        slug
      }
      images {
        url
        alt
      }
      variants {
        id
        name
        sku
        pricePaise
        stock
      }
    }
  }
`
