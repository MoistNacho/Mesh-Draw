/* eslint-disable max-classes-per-file */
import Form, {
  arrayLength,
  childrenForm,
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

class ItemForm extends Form<ItemFormSource> {
  @label("아이디")
  @required()
  public id: number;

  @label("아이템")
  @required()
  @length(1)
  public name: string;
}

export default class ModalFormCommand extends Form<ModalFormSource> {
  @label("타이틀")
  @required()
  @length(2)
  @defaultValue("")
  public title: string;

  @label("리스트 아이템")
  @childrenForm(ItemForm)
  @arrayLength(2, 10)
  public items: ItemForm[];
}
