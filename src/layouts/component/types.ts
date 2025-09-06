export interface menu {
  id: number
  name: string
  path: string
  nickName?: string
  icon?: string
  index?: string
  children?: menu[]
}

export interface MenuProps {
  menu_list: menu[]
  default_openeds?: string[]
}
