export default class PopUp {
  private openedPopUps: Window[] = [];

  public openPopUp = (window: Window) => {
    this.openedPopUps.push(window);
  };

  public closePopUps = () => {
    this.openedPopUps.forEach((win) => {
      if (win && win.close) {
        win.close();
      }
    });
  };
}
