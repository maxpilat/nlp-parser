import { Injectable } from '@angular/core';

export enum TabList {
  Table,
  Tree,
}

@Injectable({
  providedIn: 'root',
})
export class TabService {
  tabs = TabList;
  private tab = TabList.Table;

  setTab(tab: TabList) {
    this.tab = tab;
  }

  getCurrentTab() {
    return this.tab;
  }
}
