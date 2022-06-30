/* eslint-disable no-console */
/* eslint-disable class-methods-use-this */
import { collection, addDoc, getDocs } from "firebase/firestore";

import Core from "core";
import { DB } from "core/services/FireBase";

import { Roulette } from "../RouletteStore";

export default class RouletteService {
  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  public async getHistory() {
    try {
      const result = await getDocs(collection(DB, "roulettes"));
      const getList = result.docs.map((item) => {
        return { ...item.data(), id: item.id } as Roulette;
      });
      getList.sort((a, b) => b.createdAt - a.createdAt);
      return getList;
    } catch (e) {
      this.core.dialog.openAlert({
        title: "Mash Draw",
        message: "룰렛 히스토리를 불러오는중 오류발생!",
      });
    }
  }

  public async addRoulette(item: Roulette) {
    try {
      await addDoc(collection(DB, "roulettes"), item);
    } catch (e) {
      this.core.dialog.openAlert({
        title: "Mash Draw",
        message: "룰렛을 업로드중 오류발생!",
      });
    }
  }
}
