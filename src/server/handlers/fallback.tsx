import express from "express";

import { initialState as globalInitialState } from "../../common/store/global";
import { initialState as dynamicPropsInitialState } from "../../common/store/dynamic-props";
import { initialState as trendingTagsInitialState } from "../../common/store/trending-tags";
import { initialState as accountsInitialState } from "../../common/store/accounts";
import { initialState as transactionsInitialState } from "../../common/store/transactions";
import { initialState as communityInitialState } from "../../common/store/community";
import { initialState as entriesInitialState } from "../../common/store/entries";

import { render } from "../template";

import { readGlobalCookies } from "../helper";

export default async (req: express.Request, res: express.Response) => {
  // TODO: promoted posts

  const preLoadedState = {
    global: {
      ...globalInitialState,
      ...readGlobalCookies(req),
    },
    dynamicProps: { ...dynamicPropsInitialState },
    trendingTags: { ...trendingTagsInitialState },
    community: communityInitialState,
    accounts: [...accountsInitialState],
    transactions: { ...transactionsInitialState },
    entries: { ...entriesInitialState },
  };

  res.send(render(req, preLoadedState));
};