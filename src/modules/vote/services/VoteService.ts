/* eslint-disable class-methods-use-this */
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  runTransaction,
} from "firebase/firestore";

import Core from "core";
import { DB } from "core/services/FireBase";

import { Vote, VoteItem } from "../VoteStore";

export default class VoteService {
  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  public async getVoteList() {
    try {
      const res = await getDocs(collection(DB, "votes"));
      const getList = res.docs.map((item) => {
        return { ...item.data(), id: item.id } as Vote;
      });
      getList.sort((a, b) => b.createdAt - a.createdAt);
      return getList;
    } catch (e) {
      this.core.dialog.openAlert({
        title: "Mash Draw",
        message: "투표를 불러오는중 오류발생!",
      });
    }
  }

  public async addVoteList(voteItem: Vote) {
    try {
      await addDoc(collection(DB, "votes"), voteItem);
      const res = await this.getVoteList();
      return res;
    } catch (e) {
      this.core.dialog.openAlert({
        title: "Mash Draw",
        message: "투표를 생성중 오류발생!",
      });
    }
  }

  public async removeVoteList(voteId: string) {
    try {
      await deleteDoc(doc(DB, "votes", voteId));
      const res = await this.getVoteList();
      return res;
    } catch (e) {
      this.core.dialog.openAlert({
        title: "Mash Draw",
        message: "투표를 삭제중 오류발생!",
      });
    }
  }

  public async handleVoting(info: Vote, targetId: number, email: string) {
    try {
      this.core.dialog.openSpinner();
      const docRef = doc(DB, "votes", info.id);

      await runTransaction(DB, async (transaction) => {
        const docSnap = await transaction.get(docRef);
        if (!docSnap.exists()) {
          throw new Error("Document does not exist!");
        }

        const items = docSnap.data()!.items as VoteItem[];
        items.forEach((item, index) => {
          if (item.id === targetId) {
            items[index].like += 1;
          }
        });
        const users = docSnap.data() as Vote;
        users.participants.push(email);

        transaction.update(docRef, {
          items,
          participants: users.participants,
        });
      });

      this.core.dialog.openAlert({
        title: "Mesh Draw",
        message: "투표 완료!",
      });

      const res = await this.getVoteList();
      return res;
    } catch (e) {
      this.core.dialog.openAlert({
        title: "Mash Draw",
        message: "투표상태 업데이트 중 오류발생",
      });
    } finally {
      this.core.dialog.closeSpinner();
    }
  }

  public checkOverlapUser(info: Vote, email: string) {
    const overlap = info.participants.find((i) => i === email);
    if (overlap) {
      this.core.dialog.openAlert({
        title: "Mesh Draw",
        message: "이미 참여한 투표입니다.",
      });
      return true;
    }
  }
}
