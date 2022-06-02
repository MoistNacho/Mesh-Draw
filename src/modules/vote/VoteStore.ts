import { action, observable } from "mobx";

import Core from "core";

export interface Vote {
  title: string;
  items: VoteItem[];
  id: number;
  userId: string;
}

export interface VoteItem {
  like: number;
  name: string;
}

export default class VoteStore {
  public core: Core;

  @observable
  public voteList: Vote[] = [
    {
      title: "먹고싶은 음식",
      id: 0,
      userId: "test",
      items: [
        { like: 0, name: "치킨" },
        { like: 0, name: "피자" },
        { like: 0, name: "햄버거" },
      ],
    },
  ];

  constructor(core: Core) {
    this.core = core;
  }

  @action
  public getVoteList() {
    return this.voteList;
  }
}
