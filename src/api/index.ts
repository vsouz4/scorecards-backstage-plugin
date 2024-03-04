import {
  ConfigApi,
  createApiRef,
} from '@backstage/core-plugin-api';
import fetch from 'cross-fetch';

export const scorecardsApiRef = createApiRef<ScorecardsApi>({
  id: 'plugin.scorecards.service',
});

type Options = {
  configApi: ConfigApi;
};

export class ScorecardsApi {
  private readonly configApi: ConfigApi;

  constructor(options: Options) {
    this.configApi = options.configApi;
  }

  async getScorecards() {
    const backendUrl = this.configApi.getString('backend.baseUrl');
    const request = await fetch(`${backendUrl}/api/proxy/scorecards/v1/scorecards?limit=100`);
    if (!request.ok) {
      throw new Error(
        `failed to fetch data, status ${request.status}: ${request.statusText}`,
      );
    }
    return await request.json();
  }

  async getEvaluations(scorecardId: number) {
    const backendUrl = this.configApi.getString('backend.baseUrl');
    const request = await fetch(`${backendUrl}/api/proxy/scorecards/v1/scorecards/${scorecardId}`);
    if (!request.ok) {
      throw new Error(
        `failed to fetch data, status ${request.status}: ${request.statusText}`,
      );
    }
    return await request.json();
  }
}
