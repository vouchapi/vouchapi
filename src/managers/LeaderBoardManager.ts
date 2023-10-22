import { VouchClient } from "../client/VouchClient";

export class LeaderboardManager {
  constructor(public readonly vouchClient: VouchClient) {}

  async top10() {
    const leaderboard = await this.vouchClient.apiClient.getTop10();

    if (leaderboard.status !== 200) {
      return null;
    }

    return leaderboard.body;
  }

  async hot10() {
    const leaderboard = await this.vouchClient.apiClient.getHot10();

    if (leaderboard.status !== 200) {
      return null;
    }

    return leaderboard.body;
  }
}
