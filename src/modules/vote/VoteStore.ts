import { action, observable } from "mobx";

import Core from "core";

export interface Vote {
  title: string;
  items: VoteItem[];
  id: number;
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
      id: 0,
      userId: "test",
      items: [
        { id: 0, like: 2, name: "치킨" },
        { id: 1, like: 1, name: "피자" },
        { id: 2, like: 5, name: "햄버거" },
      ],
    },
  ];

  constructor(core: Core) {
    this.core = core;
  }

  @action
  public getVoteAnswer(vote: Vote) {
    const result = vote && this.voteList[0];
    return result;
  }
}
