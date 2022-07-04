/* eslint-disable no-console */
import { action, observable } from "mobx";

import Core from "core";

import { WheelDataType } from "../../components/CustomWheel";

import RouletteService from "./services/RouletteService";

export interface Roulette {
  id: string;
  title: string;
  items: RouletteItem[];
  userId: string;
  createdAt: number;
}

export interface RouletteItem extends WheelDataType {
  id: number;
  option: string;
}

export default class RouletteStore {
  private service: RouletteService;

  public core: Core;

  @observable
  public rouletteWheel: Roulette;

  @observable
  public historyList: Roulette[];

  @observable
  public animationPlay = false;

  @observable
  public mustSpin = false;

  @observable
  public prizeNum: number;

  @observable
  public drawResult: string;

  @observable
  public historyLoading = false;

  constructor(core: Core) {
    this.core = core;
    this.service = new RouletteService(this.core);
  }

  @action.bound
  public addRoulette(item: Roulette, isUpload = true) {
    this.rouletteWheel = item;
    this.drawResult = "";

    if (isUpload) {
      this.service.addRoulette(item);
    }
  }

  @action.bound
  public async removeRoulette(rouletteId: string) {
    const items = await this.service.removeRoulette(rouletteId);

    this.historyList = items || [];
  }

  @action.bound
  public async getHistory() {
    this.historyLoading = true;
    const items = await this.service.getHistory();

    this.historyList = items || [];
    this.historyLoading = false;
  }

  @action.bound
  public handleSpinClick() {
    if (this.mustSpin === true) return;

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
    this.animationPlay = true;
    setTimeout(() => {
      this.animationPlay = false;
    }, 3000);
  }
}
