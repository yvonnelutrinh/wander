import { makeAutoObservable } from "mobx";

class IndexStore {
  currentIndex = 0;
  currentText = '';
  started = false;
  insight = "";

  constructor() {
    makeAutoObservable(this);
  }

  setIndex(index) {
    this.currentIndex = index;
  }

  setCurrentText(currentText) {
    this.currentText = currentText;
  }

  setStarted(started) {
    this.started = started;
  }

  setInsight(insight){
    this.insight = insight;
  }

}

export const indexStore = new IndexStore();