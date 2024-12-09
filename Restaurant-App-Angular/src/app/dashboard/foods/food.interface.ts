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


export interface CreateEmployee {
  designation: string;
  joinDate: string;
  email: string;
  phoneNumber: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  dob: string;
  nid: string;
  genderId: number;
  image: string;
  base64: string;
}
