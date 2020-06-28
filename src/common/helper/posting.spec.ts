import { createPermlink, extractMetaData, makeJsonMetaData, makeCommentOptions } from "./posting";

describe("createPermlink", () => {
  it("(1) ", () => {
    const input = "lorem ipsum dolor sit amet";
    expect(createPermlink(input)).toMatchSnapshot();
  });
});

describe("createPermlink random", () => {
  jest.spyOn(Math, "random").mockImplementation(() => {
    return 1.95136022969379;
  });

  it("(1) ", () => {
    const input = "lorem ipsum dolor sit amet";
    expect(createPermlink(input, true)).toMatchSnapshot();
  });
});

describe("createPermlink non-latin chars", () => {
  jest.spyOn(Math, "random").mockImplementation(() => {
    return 1.95136022969379;
  });

  it("(1) ", () => {
    const input = "ปลาตัวใหญ่สีเหลืองทอง";
    expect(createPermlink(input)).toMatchSnapshot();
  });
});

describe("extractMetadata", () => {
  it("(1) ", () => {
    const input = '<img src="http://www.xx.com/a.png"> @lorem @ipsum';
    expect(extractMetaData(input)).toMatchSnapshot();
  });

  it("(2) ", () => {
    const input =
      '@lorem <img src="http://www.xx.com/a.png"> ![h74zrad2fh.jpg](https://img.esteem.ws/h74zrad2fh.jpg) http://www.google.com/foo/bar  @ipsum';
    expect(extractMetaData(input)).toMatchSnapshot();
  });
});

describe("makeJsonMetaData", () => {
  it("(1) ", () => {
    const meta = {
      image: ["http://www.xx.com/a.png", "https://img.esteem.ws/h74zrad2fh.jpg"],
      links: ["http://www.google.com/foo/bar"],
      users: ["lorem", "ipsum"],
    };
    const tags = ["esteem", "art"];

    expect(makeJsonMetaData(meta, tags, "2.0.0")).toMatchSnapshot();
  });
});

describe("makeCommentOptions", () => {
  it("(1) Default 50% / 50%", () => {
    expect(makeCommentOptions("talhasch", "lorem-ipsum-1", "default")).toMatchSnapshot();
  });

  it("(2) Power Up 100%", () => {
    expect(makeCommentOptions("talhasch", "lorem-ipsum-1", "sp")).toMatchSnapshot();
  });

  it("(3) Decline Payout", () => {
    expect(makeCommentOptions("talhasch", "lorem-ipsum-1", "dp")).toMatchSnapshot();
  });
});