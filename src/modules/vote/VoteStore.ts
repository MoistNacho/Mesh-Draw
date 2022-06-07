import { action, observable } from "mobx";

import Core from "core";

export interface Vote {
  title: string;
  items: VoteItem[];
  id: string;
  userId: string;
}

export interface VoteItem {
  id: number;
  like: number;
  name: string;
}

export default class VoteStore {
  public core: Core;

  @observable
  public voteList: Vote[] = [
    {
      title: "먹고싶은 음식",
      id: new Date().toLocaleString(),
      userId: "test",
      items: [
        { id: 0, like: 2, name: "치킨" },
        { id: 1, like: 1, name: "피자" },
        { id: 2, like: 0, name: "햄버거" },
      ],
    },
  ];

  constructor(core: Core) {
    this.core = core;
  }

  @action.bound
  public addVoteList(voteItem: Vote) {
    this.voteList = [...this.voteList, voteItem];
  }

  @action.bound
  public removeVoteList(voteId: string) {
    this.voteList = this.voteList.filter((item) => item.id !== voteId);
  }
}
