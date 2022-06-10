/* eslint-disable no-console */
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { action, observable } from "mobx";

import Core from "core";
import { DB } from "core/services/FireBase";

export interface Vote {
  id: string;
  title: string;
  items: VoteItem[];
  userId: string;
  participants: string[];
  createdAt: number;
}

export interface VoteItem {
  id: number;
  like: number;
  name: string;
}

export default class VoteStore {
  public core: Core;

  @observable
  public voteList: Vote[] = [];

  @observable
  private loading = false;

  constructor(core: Core) {
    this.core = core;
  }

  @action.bound
  public async getVoteList() {
    const result = await getDocs(collection(DB, "votes"));
    const getList = result.docs.map((item) => {
      return { ...item.data(), id: item.id } as Vote;
    });
    getList.sort((a, b) => b.createdAt - a.createdAt);

    this.voteList = getList;
  }

  @action.bound
  public async addVoteList(voteItem: Vote) {
    try {
      await addDoc(collection(DB, "votes"), voteItem);
      this.getVoteList();
      // this.voteList = [{ ...voteItem, id: docRef.id }, ...this.voteList];
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  @action.bound
  public async removeVoteList(voteId: string) {
    try {
      await deleteDoc(doc(DB, "votes", voteId));
      this.getVoteList();
      // this.voteList = this.voteList.filter((item) => item.id !== voteId);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  @action.bound
  public async handleVoting(info: Vote, targetId: number, email: string) {
    if (this.checkOverlapUser(info, email)) return;

    if (!this.loading) {
      this.loading = true;
      this.core.dialog.openSpinner();
      try {
        const docRef = doc(DB, "votes", info.id);
        const docSnap = await getDoc(docRef);
        const updateItems = docSnap.data()!.items as VoteItem[];
        updateItems.forEach((item, index) => {
          if (item.id === targetId) {
            updateItems[index].like += 1;
          }
        });
        const updateUsers = docSnap.data() as Vote;
        updateUsers.participants.push(email);

        await updateDoc(docRef, {
          items: updateItems,
          participants: updateUsers.participants,
        });
        this.core.dialog.openAlert({
          title: "Mesh Draw",
          message: "투표 완료!",
        });
        this.getVoteList();
      } catch (e) {
        this.core.dialog.openAlert({
          title: "Mash Draw",
          message: "투표상태 업데이트 중 오류발생",
        });
      } finally {
        this.loading = false;
        this.core.dialog.closeSpinner();
      }
    }
  }

  @action
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
