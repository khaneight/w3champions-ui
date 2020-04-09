import { moduleActionContext } from "..";
import { RankingState, Ranking, Gateways } from "./types";
import { DataTableOptions, RootState } from "../typings";
import { ActionContext } from "vuex";

const mod = {
  namespaced: true,
  state: {
    gateway: Gateways.Europe,
    page: 0,
    totalRanks: 0,
    working: false,
    rankings: [],
    topFive: [],
    searchRanks: []
  } as RankingState,
  actions: {
    async retrieveRankings(
      context: ActionContext<RankingState, RootState>,
      options?: DataTableOptions
    ) {
      const { commit, rootGetters, state } = moduleActionContext(context, mod);

      if (options && options.page != null) {
        commit.SET_PAGE(options.page - 1);
      }

      const response = await rootGetters.rankingService.retrieveRankings(
        0,
        state.gateway
      );

      commit.SET_TOTAL_RANKS(response.length);
      commit.SET_RANKINGS(response);
    },
    async getTopFive(context: ActionContext<RankingState, RootState>) {
      const { commit, rootGetters, state } = moduleActionContext(context, mod);

      const rankings = await rootGetters.rankingService.retrieveRankings(
        0,
        state.gateway
      );
      commit.SET_TOP_FIVE(rankings.slice(0, 5));
    },
    async search(
      context: ActionContext<RankingState, RootState>,
      searchText: string
    ) {
      const { commit, rootGetters, state } = moduleActionContext(context, mod);

      const rankings = await rootGetters.rankingService.searchRankings(
        searchText,
        state.gateway
      );

      commit.SET_SEARCH_RANKINGS(rankings);
    },
    async clearSearch(context: ActionContext<RankingState, RootState>) {
      const { commit } = moduleActionContext(context, mod);
      commit.SET_SEARCH_RANKINGS([]);
    },
    async setGateway(
      context: ActionContext<RankingState, RootState>,
      gateway: Gateways
    ) {
      const { commit, dispatch } = moduleActionContext(context, mod);
      commit.SET_GATEWAY(gateway);
      commit.SET_PAGE(0);
      await dispatch.retrieveRankings(undefined);
    }
  },
  mutations: {
    SET_RANKINGS(state: RankingState, rankings: Ranking[]) {
      state.rankings = rankings;
    },
    SET_PAGE(state: RankingState, page: number) {
      state.page = page;
    },
    SET_TOTAL_RANKS(state: RankingState, totalRanks: number) {
      state.totalRanks = totalRanks;
    },
    SET_TOP_FIVE(state: RankingState, rankings: Ranking[]) {
      state.topFive = rankings;
    },
    SET_SEARCH_RANKINGS(state: RankingState, rankings: Ranking[]) {
      state.searchRanks = rankings;
    },
    SET_GATEWAY(state: RankingState, gateway: Gateways) {
      state.gateway = gateway;
    }
  }
} as const;

export default mod;
