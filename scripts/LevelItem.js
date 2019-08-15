var Utilities;
(function (Utilities) {
    class LevelItem {
        constructor(Heading, TitleText, Title, ...Classes) {
            this.classes = [];
            this.heading = "";
            this.title = null;
            this.title_text = "";
            this.heading = Heading;
            this.title = Title;
            if (TitleText.length > 0) {
                this.title_text = TitleText;
                this.title = null;
            }
            if (Classes.length > 0)
                this.classes.push(...Classes);
        }
    }
    Utilities.LevelItem = LevelItem;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=LevelItem.js.map