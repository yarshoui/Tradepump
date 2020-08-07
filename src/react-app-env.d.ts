/// <reference types="react-scripts" />

interface ItemsStore {
  session: Session;
  items: Array<Item>;
  categories: Array<CategoryItem>;
  tags: Array<TagItem>;
  dashboards: Array<DashboardItem>;
}

interface Session {
  id: string;
  authenticated: boolean;
  showComplete: boolean;
}

interface Item {
  id: string;
  name: string;
  price: number;
  qty: number;
  currency: string;
  open: boolean;
  urgent: bolean;
  dateto: string;
  tag: Array<string>;
  categoryID: string;
  isComplete: boolean;
  comments: string;
}

interface CategoryItem {
  id: string;
  name: string;
}

interface TagItem {
  id: string;
  name: string;
}

/**
 * @param id: string;
 * @param name: string;
 * @param fields: Array<DashboardField>;
 * */
interface DashboardItem {
  id: string;
  name: string;
  fields: Array<DashboardField>;
}

/**
 * @prop id: string;
 * @prop name: string;
 * */
interface DashboardField {
  name: string;
  type: string;
}

interface ItemListOwnProps {
  category: CategoryItem;
  categoriesEdit: boolean;
}

interface collectionResponse {
  name: string;
  type: string;
  infp: {};
  idIndex: {};
  options: {};
}
