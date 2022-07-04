import { action, observable } from "mobx";

import Core from "core";

import VoteService from "./services/VoteService";

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
  private service: VoteService;

  public core: Core;

  @observable
  public voteList: Vote[] = [];

  @observable
  public listLoaded = false;

  @observable
  private loading = false;

  constructor(core: Core) {
    this.core = core;
    this.service = new VoteService(this.core);
  }

  @action.bound
  public async getVoteList() {
    const items = await this.service.getVoteList();

    this.voteList = items || [];
    this.listLoaded = true;
  }

  @action.bound
  public async addVoteList(voteItem: Vote) {
    const newItems = await this.service.addVoteList(voteItem);

    this.voteList = newItems || [];
  }

  @action.bound
  public async removeVoteList(voteId: string) {
    const newItems = await this.service.removeVoteList(voteId);

    this.voteList = newItems || [];
  }

  @action.bound
  public async handleVoting(info: Vote, targetId: number, email: string) {
    if (this.service.checkOverlapUser(info, email)) return;

    if (!this.loading) {
      this.loading = true;
      const updatedItems = await this.service.handleVoting(
        info,
        targetId,
        email,
      );

      this.voteList = updatedItems || [];
      this.loading = false;
    }
  }
}
