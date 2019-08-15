namespace Utilities
{
  interface ILevelItem
  {
    classes: Array<string>;
    heading: string;
    title: HTMLElement;
    title_text: string;
  }

  export class LevelItem implements ILevelItem
  {
    public classes: Array<string> = [];
    public heading: string = "";
    public title: HTMLElement = null;
    public title_text: string = "";

    constructor(Heading: string, TitleText: string, Title: HTMLElement, ...Classes: Array<string>)
    {
      this.heading = Heading;
      this.title = Title;
      if (TitleText.length > 0)
      {
        this.title_text = TitleText;
        this.title = null;
      }
      if (Classes.length > 0) this.classes.push(...Classes);
    }
  }


}