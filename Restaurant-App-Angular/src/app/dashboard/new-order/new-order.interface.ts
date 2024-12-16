
export type CartFoodItem = {
  tableId: string;
  quantity: number;
  amount: number;
  food: FoodItem;
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

export interface PostOrderItem {
  foodId: number
  foodPackageId: number | null
  quantity: number
  unitPrice: number
  totalPrice: number
}


export interface PostOrder {
  tableId: number
  orderNumber: string
  amount: number
  phoneNumber: string | null
  items: PostOrderItem[]
}
