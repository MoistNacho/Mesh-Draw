import { action, observable } from "mobx";

import Core from "core";
import { Roulette } from "modules/roulette/RouletteStore";
import { Vote } from "modules/vote/VoteStore";

import ModalFormCommand, { ModalFormSource } from "./commands/ModalFormCommand";

// type Item = {
//   id: number;
//   name: string;
// };
export default class ModalFormStore {
  public core: Core;

  @observable
  public form: ModalFormCommand = new ModalFormCommand();

  // @observable
  // public items: Item[] = [
  //   { id: 0, name: "" },
  //   { id: 1, name: "" },
  // ];

  @observable
  private nextItemId = 2;

  @observable
  public itemNameError = "";

  constructor(core: Core) {
    this.core = core;
    this.form.update({
      items: [
        { id: 0, name: "" },
        { id: 1, name: "" },
      ],
    });
  }

  @action.bound
  public handleTitle(key: keyof ModalFormSource, value: string) {
    this.form.update({
      [key]: value,
    });
  }

  @action.bound
  public handleItemsName(id: number, value: string) {
    if (this.itemNameError) {
      this.itemNameError = "";
    }
    const newItems = this.form.items.map((item) => {
      if (item.id === id) {
        return { ...item, name: value };
      }
      return item;
    });

    this.form.update({
      items: newItems,
    });
  }

  @action.bound
  public createListItem() {
    if (this.form.items.length >= 12) {
      return;
    }

    const newItems = [
      ...this.form.items,
      {
        id: this.nextItemId,
        name: "",
      },
    ];
    this.form.update({
      items: newItems,
    });
    this.nextItemId += 1;
  }

  @action.bound
  public removeListItem(id: number) {
    if (this.form.items.length <= 2) {
      return;
    }

    const newItems = this.form.items.filter((item) => item.id !== id);
    this.form.update({
      items: newItems,
    });
  }

  @action.bound
  public handleInputError() {
    const emptyItemName = this.form.items.find((item) => !item.name);

    if (emptyItemName) {
      this.itemNameError = "아이템리스트의 이름을 입력하세요.";
    }

    return this.form.errors.title || emptyItemName;
  }

  @action.bound
  public loadEditData(editData: Roulette) {
    const convertItems = editData.items.map((i, index) => {
      return { id: index, name: i.option };
    });

    this.form.update({
      title: editData.title,
      items: convertItems,
    });

    this.nextItemId = convertItems.length;
  }

  @action.bound
  public convertVoteItem() {
    const item: Vote = {
      id: "",
      title: this.form.title,
      items: this.form.items.map((i) => {
        return { id: i.id, name: i.name, like: 0 };
      }),
      userId: this.core!.googleAuth?.user?.uid || "",
      createdAt: new Date().valueOf(),
      participants: [],
    };
    return item;
  }

  @action.bound
  public convertRouletteItem() {
    const rouletteItems = this.form.items.map((i) => {
      return { id: i.id, option: i.name };
    });
    const item: Roulette = {
      id: "",
      title: this.form.title,
      items: rouletteItems,
      userId: this.core!.googleAuth?.user?.uid || "",
      createdAt: new Date().valueOf(),
    };

    return item;
  }
}
