export interface ResponseTableList {
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
  next_page_url: any
  prev_page_url: any
  data: Table[]
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


export interface ResponseAvailableEmployees {
  employeeId: string
  name: string
}
