/**
 * walletKit.js — StellarWalletsKit v2 singleton (static class API)
 * Integration Phase: multi-wallet support (Freighter, LOBSTR, Albedo, xBull, etc.)
 *
 * v2 uses a static class pattern: StellarWalletsKit.init() then static methods.
 * No WalletNetwork / allowAllModules / FREIGHTER_ID — those are v1 exports.
 */
import {
  StellarWalletsKit,
  Networks as KitNetworks,
} from '@creit.tech/stellar-wallets-kit';

import { FreighterModule } from '@creit.tech/stellar-wallets-kit/modules/freighter';
import { LobstrModule } from '@creit.tech/stellar-wallets-kit/modules/lobstr';
import { AlbedoModule } from '@creit.tech/stellar-wallets-kit/modules/albedo';
import { xBullModule } from '@creit.tech/stellar-wallets-kit/modules/xbull';

let initialized = false;

export const initKit = () => {
  if (initialized) return;
  StellarWalletsKit.init({
    network: KitNetworks.TESTNET,
    modules: [
      new FreighterModule(),
      new LobstrModule(),
      new AlbedoModule(),
      new xBullModule()
    ]
  });
  initialized = true;
};

/**
 * Open the built-in wallet picker modal (async).
 * Resolves with the connected public key string.
 */
export const openKitModal = () => {
  initKit();
  return new Promise((resolve, reject) => {
    StellarWalletsKit.openModal({
      onWalletSelected: async (option) => {
        try {
          StellarWalletsKit.setWallet(option.id);
          const { address } = await StellarWalletsKit.getAddress();
          resolve(address);
        } catch (err) {
          reject(err);
        }
      },
      onClosed: () => reject(new Error('user_closed')),
    });
  });
};

/**
 * Get list of supported wallets (for our custom picker UI fallback).
 * Returns array with { id, name, type, icon, isAvailable, url }.
 */
export const getSupportedWallets = async () => {
  initKit();
  return StellarWalletsKit.refreshSupportedWallets();
};

/**
 * Sign a transaction XDR with the currently selected wallet.
 */
export const signWithKit = async (xdr) => {
  initKit();
  const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
    networkPassphrase: KitNetworks.TESTNET,
  });
  return signedTxXdr;
};

/**
 * Disconnect / reset.
 */
export const disconnectKit = () => {
  StellarWalletsKit.disconnect();
  initialized = false;
};

export { StellarWalletsKit, KitNetworks };
