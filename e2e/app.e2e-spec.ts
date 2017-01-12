import { MeanAppScotchPage } from './app.po';

describe('mean-app-scotch App', function() {
  let page: MeanAppScotchPage;

  beforeEach(() => {
    page = new MeanAppScotchPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
