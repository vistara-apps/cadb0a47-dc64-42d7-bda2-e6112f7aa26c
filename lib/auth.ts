import { userDB, type User } from './database';

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  walletAddress: string | null;
}

export class AuthService {
  private currentUser: User | null = null;

  async authenticateWithWallet(walletAddress: string): Promise<User> {
    // Check if user exists
    let user = userDB.getByWallet(walletAddress);

    if (!user) {
      // Create new user
      user = userDB.create({
        walletAddress,
        username: `User_${walletAddress.slice(-6)}`, // Default username from wallet
      });
    }

    this.currentUser = user;
    return user;
  }

  async updateProfile(updates: Partial<User>): Promise<User | null> {
    if (!this.currentUser) {
      throw new Error('No authenticated user');
    }

    const updatedUser = userDB.update(this.currentUser.id, updates);
    if (updatedUser) {
      this.currentUser = updatedUser;
    }
    return updatedUser;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  getAuthState(): AuthState {
    return {
      isAuthenticated: !!this.currentUser,
      user: this.currentUser,
      walletAddress: this.currentUser?.walletAddress || null,
    };
  }

  logout(): void {
    this.currentUser = null;
  }

  // Utility function to validate wallet address format
  static isValidWalletAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Utility function to shorten wallet address for display
  static shortenAddress(address: string): string {
    if (!this.isValidWalletAddress(address)) return address;
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }
}

// Export singleton instance
export const authService = new AuthService();

