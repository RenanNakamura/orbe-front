export interface TableColumn<T> {
  label: string;
  property: string;
  type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'phone' | 'enum' | 'date' | 'color';
  visible?: boolean;
  cssClasses?: string[];
}
