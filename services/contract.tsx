import { ethers } from "ethers";
import { Host } from "../types/ethers-contracts";
import HOST_ABI from "../abis/contracts/Host.json";
import { SequenceSigner } from "@0xsequence/provider";
import { HOST_ADDRESS } from "@/store/contract/contractStore";

export enum UserType {
  UNREGISTERED = 0,
  PARENT = 1,
  CHILD = 2,
}

export interface IChild {
  username: string;
  avatarURI: string;
  familyId: string;
  memberSince: ethers.BigNumber;
  wallet: string;
  childId: number;
  sandboxMode: boolean;
  isActive: boolean;
}

class HostContract {
  private contract: Host;
  private wallet: string;

  constructor(contract: Host, wallet: string) {
    this.contract = contract;
    this.wallet = wallet;
  }

  getWallet() {
    return this.wallet;
  }

  static async fromProvider(
    provider: ethers.providers.JsonRpcProvider | SequenceSigner,
    address?: string
  ) {
    const contract = new ethers.Contract(
      HOST_ADDRESS,
      HOST_ABI.abi,
      provider
    ) as Host;

    return new HostContract(contract, address);
  }

  async getUserType(accountAddress: string): Promise<UserType> {
    const userType = await this.contract.getUserType(accountAddress);
    return userType;
  }

  async registerParent(hash: string, avatarURI: string) {
    return this.contract.registerParent(hash, avatarURI);
  }

  async fetchChildren(family_Id: string) {
    console.log("fetchChildren - contract");
    const children = await this.contract.fetchChildren(family_Id);
    console.log("Children - contract", children);
    return children;
  }

  async addChild(wallet: string, username: string, isLocked: boolean) {
    return this.contract.addChild(wallet, username, isLocked);
  }

  async changeAccess(wallet: string, childId: number) {
    return this.contract.changeAccess(wallet, childId);
  }

  async hashFamilyId(wallet: string, familyId: string) {
    return this.contract.hashFamilyId(wallet, familyId);
  }

  async getFamilyIdByOwner(wallet: string) {
    return this.contract.getFamilyIdByOwner(wallet);
  }
}

export default HostContract;
