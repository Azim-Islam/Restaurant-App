export interface ResponseOrderList {
  data: OrderData[]
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
  prev_page_url: string
}

export interface OrderData {
  id: string
  orderNumber: string
  amount: number
  orderStatus: string
  orderTime: string
  table: Table
  orderedBy: OrderedBy
  orderTakenBy: OrderTakenBy
  orderItems: OrderItem[]
}

export interface Table {
  id: number
  tableNumber: string
  numberOfSeats: number
  isOccupied: boolean
  image: string
  employees: Employee[]
}

export interface Employee {
  employeeTableId: number
  employeeId: string
  name: string
}

export interface OrderedBy {
  id: string
  userName: string
  email: string
  fullName: string
  phoneNumber: string
  label: string
  firstName: string
  middleName: string
  lastName: string
  fatherName: string
  motherName: string
  spouseName: string
  dob: string
  address: string
  nid: string
  image: string
  existingImage: string
  facebook: string
  instagram: string
  genderId: number
  genderName: string
}

export interface OrderTakenBy {
  id: string
  userName: string
  email: string
  fullName: string
  phoneNumber: string
  label: string
  firstName: string
  middleName: string
  lastName: string
  fatherName: string
  motherName: string
  spouseName: string
  dob: string
  address: string
  nid: string
  image: string
  existingImage: string
  facebook: string
  instagram: string
  genderId: number
  genderName: string
}

export interface OrderItem {
  id: string
  quantity: number
  unitPrice: number
  totalPrice: number
  food: Food
  foodPackage: FoodPackage
}

export interface Food {
  id: number
  name: string
  description: string
  price: number
  discountType: string
  discount: number
  discountPrice: number
  image: string
}

export interface FoodPackage {
  id: number
  food: Food2
  package: Package
}

export interface Food2 {
  id: number
  name: string
  description: string
  price: number
  discountType: string
  discount: number
  discountPrice: number
  image: string
}

export interface Package {
  id: number
  name: string
  price: number
}
