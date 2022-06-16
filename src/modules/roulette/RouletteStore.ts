/* eslint-disable no-console */
import { addDoc, collection, getDocs } from "firebase/firestore";
import { action, observable } from "mobx";
import { WheelDataType } from "react-custom-roulette";

import Core from "core";
import { DB } from "core/services/FireBase";

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
  public historyList: Roulette[];

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
  }

  @action.bound
  public async addRouletteList(item: Roulette, isUpload = true) {
    try {
      this.rouletteWheel = item;
      this.drawResult = "";
      if (isUpload) {
        await addDoc(collection(DB, "roulettes"), item);
      }
    } catch (e) {
      console.error("Error adding document: ", e);
    }
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

  @action.bound
  public async getHistory() {
    try {
      this.historyLoading = true;
      const result = await getDocs(collection(DB, "roulettes"));
      const getList = result.docs.map((item) => {
        return { ...item.data(), id: item.id } as Roulette;
      });
      getList.sort((a, b) => b.createdAt - a.createdAt);

      this.historyList = getList;
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      this.historyLoading = false;
    }
  }
}
