import { action, observable } from "mobx";

import Core from "core";
import { Roulette } from "modules/roulette/RouletteStore";

export type Item = {
  id: number;
  name: string;
};

export default class ModalFormStore {
  public core: Core;

  @observable
  public title = "";

  @observable
  public items: Item[] = [
    { id: 0, name: "" },
    { id: 1, name: "" },
  ];

  @observable
  private nextItemId = 2;

  @observable
  public itemNameError = "";

  @observable
  public titleError = "";

  constructor(core: Core) {
    this.core = core;
  }

  @action.bound
  public handleTitle(value: string) {
    if (this.titleError) {
      this.titleError = "";
    }
    this.title = value;
  }

  @action.bound
  public handleItemsName(id: number, value: string) {
    if (this.itemNameError) {
      this.itemNameError = "";
    }
    const newItems = this.items.map((item) => {
      if (item.id === id) {
        return { ...item, name: value };
      }
      return item;
    });

    this.items = newItems;
  }

  @action.bound
  public createListItem() {
    if (this.items.length >= 10) {
      return;
    }

    const newItems = [
      ...this.items,
      {
        id: this.nextItemId,
        name: "",
        like: 0,
      },
    ];
    this.items = newItems;
    this.nextItemId += 1;
  }

  @action.bound
  public removeListItem(id: number) {
    if (this.items.length <= 2) {
      return;
    }

    const newItems = this.items.filter((item) => item.id !== id);
    this.items = newItems;
  }

  @action.bound
  public handleInputError() {
    const emptyTitle = this.title === "";
    const emptyItemName = this.items.find((item) => !item.name);

    if (emptyTitle) {
      this.titleError = "투표의 주제를 입력하세요";
    }
    if (emptyItemName) {
      this.itemNameError = "아이템리스트의 이름을 입력하세요.";
    }

    return emptyTitle || emptyItemName;
  }

  @action.bound
  public loadEditData(editData: Roulette) {
    const convertItems = editData.items.map((i, index) => {
      return { id: index, name: i.option };
    });

    this.title = editData.title;
    this.items = convertItems;
    this.nextItemId = convertItems.length;
  }
}
