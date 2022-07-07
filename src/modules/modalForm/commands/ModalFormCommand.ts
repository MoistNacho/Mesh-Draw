/* eslint-disable max-classes-per-file */
import Form, {
  defaultValue,
  label,
  length,
  required,
} from "@meshkorea/cake-form";

interface ItemFormSource {
  id: number;
  name: string;
}

export interface ModalFormSource {
  title: string;
  items: ItemFormSource[];
}

// class ItemForm extends Form<ItemFormSource> {
//   @label("아이디")
//   public id: number;

//   @label("아이템")
//   public name: string;
// }

export default class ModalFormCommand extends Form<ModalFormSource> {
  @label("타이틀")
  @required()
  @length(2)
  @defaultValue("")
  public title: string;

  @label("리스트 아이템")
  public items: ItemFormSource[];
}
