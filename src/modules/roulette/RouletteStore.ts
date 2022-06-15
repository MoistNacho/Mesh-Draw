/* eslint-disable no-console */
import { action, observable } from "mobx";
import { WheelDataType } from "react-custom-roulette";

import Core from "core";

export interface Roulette {
  id: string;
  title: string;
  items: RouletteItem[];
  createdAt: number;
}

export interface RouletteItem extends WheelDataType {
  id: number;
  option: string;
}

export default class RouletteStore {
  public core: Core;

  @observable
  public rouletteWheel: Roulette;

  @observable
  public mustSpin = false;

  @observable
  public prizeNum: number;

  @observable
  public drawResult: string;

  constructor(core: Core) {
    this.core = core;
  }

  @action.bound
  public addRouletteList(item: Roulette) {
    this.rouletteWheel = item;
  }

  @action.bound
  public handleSpinClick() {
    const newPrizeNum = Math.floor(
      Math.random() * this.rouletteWheel.items.length,
    );
    this.prizeNum = newPrizeNum;
    this.mustSpin = true;
  }

  @action.bound
  public handleSpinStop() {
    this.mustSpin = false;
    this.drawResult = this.rouletteWheel.items[this.prizeNum].option;
  }
}
