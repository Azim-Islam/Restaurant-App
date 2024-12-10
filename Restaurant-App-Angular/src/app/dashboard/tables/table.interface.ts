export interface ResponseFoodList {
  pageNumber: number
  current_page: number
  per_page: number
  pageSize: number
  firstPage: string
  lastPage: string
  last_page: number
  totalPages: number
  totalRecords: number
  total: number
  from: number
  to: number
  next_page_url: string
  prev_page_url: any
  data: FoodItem[]
}

export interface FoodItem {
  id: number
  name: string
  description: string
  price: number
  discountType: string
  discount: number
  discountPrice: number
  image: string
}

export interface CreateFood {
  name: string
  description: string
  price: string
  discountType: number
  discount: string
  discountPrice: string
  image: string
  base64: string
}
