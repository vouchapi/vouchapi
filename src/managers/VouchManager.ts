import { version1 } from "../api/contract";
// import { VouchSelectSchema, vouch } from "../api/schema";
import { VouchClient } from "../client/VouchClient";
import { Vouch } from "../structure/Vouch";

export type FetchVouchesOptions = {
  vouchId?: string | number | string[] | number[];
  limit?: number;
  sortBy?: "createdAt" | "id";
  profileId?: string;
};

export type FetchVouchFetchOptions = string | number;

export class VouchManager {
  public readonly cache = new Map<string, Vouch>();

  constructor(
    public readonly vouchClient: VouchClient,
    private readonly profileId?: string
  ) {
    const vouches = this.vouchClient.apiClient.getVouches({
      query: {
        receiverId: this.profileId,
      },
    });

    vouches.then((vouches) => {
      if (vouches.status !== 200) {
        return;
      }

      for (const vouch of vouches.body) {
        this.cache.set(vouch.id.toString(), new Vouch(vouch, this.vouchClient));
      }
    });
  }

  async fetch(options: FetchVouchFetchOptions) {
    const vouch = await this.vouchClient.apiClient.getVouch({
      params: {
        vouchId: options.toString(),
      },
    });

    if (vouch.status !== 200) {
      return null;
    }

    if (vouch.body === null) return null;

    return new Vouch(vouch.body, this.vouchClient);
  }

  async fetchAll(options?: FetchVouchesOptions) {
    // if number then to string and if array then join with comma
    const vouchId =
      options?.vouchId instanceof Array
        ? options.vouchId.map((vouchId) => vouchId.toString()).join(",")
        : options?.vouchId?.toString();

    const vouches = await this.vouchClient.apiClient.getVouches({
      query: {
        receiverId: this.profileId,
        vouchIds: vouchId,
        ...options,
      },
    });

    if (vouches.status !== 200) {
      return [];
    }

    return vouches.body.map((vouch) => new Vouch(vouch, this.vouchClient));
  }

  async post(vouch: typeof version1.postVouch.body._type) {
    const posted = await this.vouchClient.apiClient.postVouch({
      body: vouch,
      params: {
        id: vouch.receiverId,
      },
    });

    if (posted.status !== 201) {
      return null;
    }

    return new Vouch(posted.body, this.vouchClient);
  }

  async approve(
    vouchId: number | string,
    vouchActivity: typeof version1.approveVouch.body._type
  ) {
    const returnType = await this.vouchClient.apiClient.approveVouch({
      body: vouchActivity,
      params: {
        vouchId: vouchId.toString(),
      },
    });

    if (returnType.status !== 201) {
      return null;
    }

    return new Vouch(returnType.body, this.vouchClient);
  }

  async deny(
    vouchId: number | string,
    vouchActivity: typeof version1.denyVouch.body._type
  ) {
    const returnType = await this.vouchClient.apiClient.denyVouch({
      body: vouchActivity,
      params: {
        vouchId: vouchId.toString(),
      },
    });

    if (returnType.status === 400) {
      if (returnType.body.statusCode === 400) {
        throw new Error(returnType.body.message + ". on denyVouch");
      }
    }

    if (returnType.status !== 201) {
      return null;
    }

    return new Vouch(returnType.body, this.vouchClient);
  }

  async askProof(
    vouchId: number | string,
    vouchActivity: typeof version1.askProofVouch.body._type,
    who: "RECEIVER" | "VOUCHER"
  ) {
    const returnType = await this.vouchClient.apiClient.askProofVouch({
      body: vouchActivity,
      params: {
        vouchId: vouchId.toString(),
        who,
      },
    });

    if (returnType.status === 400) {
      if (returnType.body.statusCode === 400) {
        throw new Error(returnType.body.message + ". on askProofVouch");
      }
    }

    if (returnType.status !== 201) {
      return null;
    }

    return new Vouch(returnType.body, this.vouchClient);
  }

  async delete(
    vouchId: number | string,
    vouchActivity: typeof version1.deleteVouch.body._type
  ) {
    const returnType = await this.vouchClient.apiClient.deleteVouch({
      body: vouchActivity,
      params: {
        vouchId: vouchId.toString(),
      },
    });

    if (returnType.status !== 201) {
      return null;
    }

    return new Vouch(returnType.body, this.vouchClient);
  }

  async update(
    vouchId: number | string,
    vouch: typeof version1.updateVouch.body._type
  ) {
    const returnType = await this.vouchClient.apiClient.updateVouch({
      body: vouch,
      params: {
        vouchId: vouchId.toString(),
      },
    });

    if (returnType.status !== 201) {
      return null;
    }

    return new Vouch(returnType.body, this.vouchClient);
  }
}
